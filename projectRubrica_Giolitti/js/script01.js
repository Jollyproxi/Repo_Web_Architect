import {countries} from "../node_modules/country-codes-flags-phone-codes/dist/index.mjs";

// File unico dell'app: qui convivono normalizzazione dati, UI, persistenza, ricerca,
// paginazione, tema e gestione della tendina paesi.

// ============================================================================
// Helper di normalizzazione e trasformazione dati
// ============================================================================
function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

// Normalizza il prefisso internazionale, mantenendo solo le cifre e il simbolo + iniziale.
function normalizeCountryCode(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? `+${digits}` : "";
}

// Normalizza il numero locale rimuovendo ogni carattere non numerico.
function normalizeLocalPhone(value) {
    return String(value || "").replace(/\D/g, "");
}

// Converte prefisso + numero locale in una stringa internazionale coerente per i controlli.
function buildInternationalPhone(countryCode, phoneLocal) {
    const normalizedPrefix = normalizeCountryCode(countryCode);
    const normalizedLocal = normalizeLocalPhone(phoneLocal);
    const localNoTrunkZero = normalizedLocal.replace(/^0+/, "") || normalizedLocal;
    return `${normalizedPrefix}${localNoTrunkZero}`;
}

// Ricava l'iniziale da mostrare come placeholder avatar quando non esiste un'immagine.
function getPlaceholderInitial(fullName) {
    const value = String(fullName || "").trim();
    return value ? value.slice(0, 1).toUpperCase() : "?";
}

// Verifica se una stringa è una URL http/https valida.
function isValidHttpUrl(value) {
    if (!value) {
        return false;
    }

    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_error) {
        return false;
    }
}

// Seleziona la sorgente avatar corretta con priorità: file base64, URL valida, placeholder.
function resolveAvatarSource({avatarUrl, avatarBase64, fullName}) {
    if (avatarBase64) {
        return {
            avatar: avatarBase64,
            avatarMode: "file",
            placeholderInitial: getPlaceholderInitial(fullName)
        };
    }

    const trimmedUrl = String(avatarUrl || "").trim();
    if (isValidHttpUrl(trimmedUrl)) {
        return {
            avatar: trimmedUrl,
            avatarMode: "url",
            placeholderInitial: getPlaceholderInitial(fullName)
        };
    }

    return {
        avatar: "",
        avatarMode: "placeholder",
        placeholderInitial: getPlaceholderInitial(fullName)
    };
}

// Controlla se il contatto candidato è già presente in rubrica per email o telefono.
function isDuplicateContact(contacts, candidate, options = {}) {
    const ignoreId = options.ignoreId || null;
    const normalizedEmail = normalizeEmail(candidate.email);
    const normalizedPhone = buildInternationalPhone(candidate.countryCode, candidate.phoneLocal);

    return contacts.some((contact) => {
        if (ignoreId && contact.id === ignoreId) {
            return false;
        }

        const contactPhone = contact.phoneInternational || buildInternationalPhone(contact.countryCode, contact.phoneLocal);
        return normalizeEmail(contact.email) === normalizedEmail || contactPhone === normalizedPhone;
    });
}

// ============================================================================
// Stato applicazione
// ============================================================================
// Chiavi di persistenza e impostazioni generali dell'app.
const STORAGE_KEY = "rubrica-giolitti-contacts";
const THEME_KEY = "rubrica-theme";
const CONTACTS_PER_PAGE = 6;

const state = {
    contacts: loadContacts(), editingContactId: null
};

const searchState = {
    searchQuery: "",
    currentPage: 1,
    filteredContacts: []
};

const contactForm = document.getElementById("contactForm");
const alertBox = document.getElementById("alertBox");
const formView = document.getElementById("formView");
const listView = document.getElementById("listView");
const showFormBtn = document.getElementById("showFormBtn");
const showListBtn = document.getElementById("showListBtn");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const avatarPreview = document.getElementById("avatarPreview");
const avatarFileInput = document.getElementById("avatarFile");
const avatarUrlInput = document.getElementById("avatarUrl");
const countryCodeSelect = document.getElementById("countryCode");
const countryIsoInput = document.getElementById("countryIso");
const countryDropdownBtn = document.getElementById("countryDropdownBtn");
const countryDropdownList = document.getElementById("countryDropdownList");
const countryDropdownOptions = document.getElementById("countryDropdownOptions");
const countryNoResults = document.getElementById("countryNoResults");
const countrySearchInput = document.getElementById("countrySearchInput");
const countryByDialCode = new Map();
const countryOptions = [];
let selectedCountry = null;

const themeTglBtn = document.getElementById("themeTglBtn");
const themeIcon = document.getElementById("themeIcon");
const searchBar = document.getElementById("searchBar");
const globalSearchInput = document.getElementById("globalSearchInput");
const contactsGrid = document.getElementById("contactsGrid");
const noContactsMsg = document.getElementById("noContactsMsg");
const paginationNav = document.getElementById("paginationNav");
const paginationList = document.getElementById("paginationList");

// ============================================================================
// Eventi UI
// ============================================================================
// Tutti gli eventi vengono collegati una sola volta all'avvio, così la logica
// rimane centralizzata e non si disperde in più file.
contactForm.addEventListener("submit", handleSubmit);
showFormBtn.addEventListener("click", showFormView);
showListBtn.addEventListener("click", showListView);
cancelEditBtn.addEventListener("click", resetFormMode);
contactsGrid.addEventListener("click", handleListActions);
avatarFileInput.addEventListener("change", updateAvatarPreviewText);
avatarUrlInput.addEventListener("input", updateAvatarPreviewText);
countryDropdownList.addEventListener("click", handleCountrySelection);
countrySearchInput.addEventListener("input", handleCountrySearch);
countrySearchInput.addEventListener("keydown", (event) => event.stopPropagation());
countryDropdownBtn.addEventListener("shown.bs.dropdown", () => {
    resetCountrySearch();
    countrySearchInput.focus();
});

themeTglBtn.addEventListener("click", toggleTheme);
globalSearchInput.addEventListener("input", handleGlobalSearch);
showListBtn.addEventListener("click", showSearchBar);
showFormBtn.addEventListener("click", hideSearchBar);

initTheme();

populateCountryCodeOptions();
updateAvatarPreviewText();
searchState.filteredContacts = [...state.contacts];
renderContactsPage();

function populateCountryCodeOptions() {
    // Il dataset del pacchetto npm viene ordinato e trasformato in una dropdown
    // custom: bandiera, nome paese e prefisso numerico.
    const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, "it"));
    countryOptions.length = 0;
    countryDropdownOptions.innerHTML = "";
    countryCodeSelect.innerHTML = "";
    countryByDialCode.clear();

    sortedCountries.forEach((country) => {
        const dialCode = String(country.dialCode || "").trim();
        const iso2 = String(country.code || "").trim().toLowerCase();
        if (!dialCode || !/^[a-z]{2}$/.test(iso2)) {
            return;
        }

        if (!countryByDialCode.has(dialCode)) {
            countryByDialCode.set(dialCode, country);

            const hiddenOption = document.createElement("option");
            hiddenOption.value = dialCode;
            hiddenOption.textContent = dialCode;
            countryCodeSelect.appendChild(hiddenOption);
        }

        countryOptions.push({
            dialCode,
            countryName: country.name,
            iso2,
            flag: country.flag,
            code: country.code,
            searchable: `${country.name} ${dialCode} ${dialCode.replace("+", "")}`.toLowerCase()
        });
    });

    renderCountryOptions(countryOptions);
    setCountryDialCode("+39", "it");
}

// Disegna la lista paesi/prefissi nella dropdown custom, riusando gli stessi dati filtrabili.
function renderCountryOptions(options) {
    // Il rendering della lista è separato dalla preparazione dei dati per poter
    // riutilizzare lo stesso dataset sia completo sia filtrato dalla ricerca live.
    countryDropdownOptions.innerHTML = "";

    options.forEach((optionData) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dropdown-item country-dropdown-item";
        button.dataset.dialCode = optionData.dialCode;
        button.dataset.iso2 = optionData.iso2;
        button.dataset.countryName = optionData.countryName;

        const flag = document.createElement("img");
        flag.className = "country-flag";
        flag.alt = "";
        flag.src = getFlagIconPath(optionData.iso2);
        flag.loading = "lazy";
        flag.decoding = "async";
        flag.addEventListener("error", () => {
            flag.replaceWith(document.createTextNode(getCountryFlagEmoji(optionData.flag, optionData.code)));
        });

        const label = document.createElement("span");
        label.textContent = `${optionData.countryName} (${optionData.dialCode})`;

        button.append(flag, document.createTextNode(" "), label);
        countryDropdownOptions.appendChild(button);
    });

    countryNoResults.classList.toggle("d-none", options.length > 0);
}

// Applica il filtro live nella dropdown dei prefissi in base a nome paese o prefisso.
function handleCountrySearch() {
    // Ricerca live: filtro per nome paese e prefisso, senza toccare il valore già selezionato.
    const query = countrySearchInput.value.trim().toLowerCase();

    if (!query) {
        renderCountryOptions(countryOptions);
        return;
    }

    const filtered = countryOptions.filter((optionData) => optionData.searchable.includes(query));
    renderCountryOptions(filtered);
}

// Gestisce il click su una voce della dropdown dei prefissi.
function handleCountrySelection(event) {
    const button = event.target.closest("button[data-dial-code]");
    if (!button) {
        return;
    }

    setCountryDialCode(button.dataset.dialCode, button.dataset.iso2);
    resetCountrySearch();
}

// Ripristina la ricerca interna della dropdown e mostra di nuovo tutti i paesi.
function resetCountrySearch() {
    countrySearchInput.value = "";
    renderCountryOptions(countryOptions);
}

// Aggiorna il prefisso selezionato sia nel campo nascosto sia nel bottone visibile.
function setCountryDialCode(dialCode, iso2 = "") {
    // Allinea valore prefisso + nazione specifica per i casi con prefisso condiviso.
    const country = getCountryOptionBySelection(dialCode, iso2) || countryByDialCode.get(dialCode);
    countryCodeSelect.value = dialCode;
    countryIsoInput.value = String(country?.code || "").toLowerCase();
    selectedCountry = country || null;

    if (!country) {
        countryDropdownBtn.textContent = `Prefisso ${dialCode}`;
        return;
    }

    const selectedIso2 = String(country.code || "").trim().toLowerCase();
    countryDropdownBtn.replaceChildren();

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.alt = "";
    flag.src = getFlagIconPath(selectedIso2);
    flag.addEventListener("error", () => {
        flag.replaceWith(document.createTextNode(getCountryFlagEmoji(country.flag, country.code)));
    });

    countryDropdownBtn.append(flag, document.createTextNode(` ${country.name} (${dialCode})`));
}

// Restituisce la nazione precisa in base a prefisso+iso; fallback al primo match per prefisso.
function getCountryOptionBySelection(dialCode, iso2) {
    const normalizedDialCode = String(dialCode || "").trim();
    const normalizedIso2 = String(iso2 || "").trim().toLowerCase();

    if (normalizedDialCode && normalizedIso2) {
        const exact = countryOptions.find((item) => {
            return item.dialCode === normalizedDialCode && item.iso2 === normalizedIso2;
        });

        if (exact) {
            return {
                name: exact.countryName,
                code: exact.iso2,
                flag: exact.flag,
                dialCode: exact.dialCode
            };
        }
    }

    const byDial = countryOptions.find((item) => item.dialCode === normalizedDialCode);
    if (!byDial) {
        return null;
    }

    return {
        name: byDial.countryName,
        code: byDial.iso2,
        flag: byDial.flag,
        dialCode: byDial.dialCode
    };
}

// Costruisce il path SVG della bandiera locale a partire dal codice ISO2.
function getFlagIconPath(iso2LowerCase) {
    return `./node_modules/flag-icons/flags/4x3/${iso2LowerCase}.svg`;
}

// Ritorna un'emoji bandiera come fallback quando l'icona SVG non è disponibile.
function getCountryFlagEmoji(flag, countryCode) {
    const cleanFlag = String(flag || "").trim();
    if (cleanFlag) {
        return cleanFlag;
    }

    const iso2 = String(countryCode || "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(iso2)) {
        return "🏳";
    }

    const first = iso2.codePointAt(0) + 127397;
    const second = iso2.codePointAt(1) + 127397;
    return String.fromCodePoint(first, second);
}

// Legge i contatti da localStorage e li normalizza nel formato corrente dell'app.
function loadContacts() {
    // Carica i contatti da localStorage e normalizza il formato legacy.
    // Se il salvataggio precedente aveva campi vecchi o incompleti, li riporta
    // al formato attuale senza interrompere la lettura dell'elenco.
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map((entry) => {
            const fullName = String(entry.fullName || "").trim();
            const countryCode = normalizeCountryCode(entry.countryCode || "+39") || "+39";
            const legacyPhone = String(entry.phone || "");
            const phoneLocal = normalizeLocalPhone(entry.phoneLocal || legacyPhone);
            const phoneInternational = entry.phoneInternational || buildInternationalPhone(countryCode, phoneLocal);
            const email = normalizeEmail(entry.email || "");
            const avatar = String(entry.avatar || "").trim();
            const countryIso = String(entry.countryIso || "").trim().toLowerCase();
            const fallbackCountry = getCountryOptionBySelection(countryCode, countryIso);

            return {
                id: entry.id || crypto.randomUUID(),
                fullName,
                countryCode,
                countryIso: countryIso || fallbackCountry?.code || "",
                countryName: String(entry.countryName || fallbackCountry?.name || ""),
                phoneLocal,
                phoneInternational,
                email,
                age: entry.age || null,
                avatar,
                avatarMode: entry.avatarMode || (avatar ? "url" : "placeholder"),
                placeholderInitial: entry.placeholderInitial || getPlaceholderInitial(fullName)
            };
        });
    } catch (_error) {
        return [];
    }
}

// Salva l'intera rubrica in localStorage come JSON serializzato.
function saveContacts() {
    // Persistenza unica: tutta la rubrica viene salvata come array JSON nel localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.contacts));
}

// Mostra messaggi Bootstrap dismissibili per conferme, errori e avvisi.
function showAlert(message, type = "info") {
    // Messaggi feedback all'utente tramite alert Bootstrap dismissibile.
    alertBox.innerHTML = `
		<div class="alert alert-${type} alert-dismissible fade show" role="alert">
			${message}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;
}

// Mostra il form di inserimento e nasconde la lista contatti.
function showFormView() {
    // La vista form e la vista lista si escludono a vicenda.
    formView.classList.remove("d-none");
    listView.classList.add("d-none");
}

// Mostra la rubrica filtrata/paginata e nasconde il form di inserimento.
function showListView() {
    // Quando apro la lista ricalcolo i risultati filtrati e riparto dalla pagina 1.
    listView.classList.remove("d-none");
    formView.classList.add("d-none");
    searchState.currentPage = 1;
    applySearch();
}

// Carica i dati del contatto nel form per permettere la modifica.
function setEditMode(contact) {
    // La modifica riusa il form di inserimento: precompila i campi e cambia il titolo/CTA.
    state.editingContactId = contact.id;
    formTitle.textContent = "Modifica Contatto";
    submitBtn.textContent = "Salva Modifica";
    cancelEditBtn.classList.remove("d-none");

    document.getElementById("fullName").value = contact.fullName;
    setCountryDialCode(contact.countryCode, contact.countryIso || "");
    document.getElementById("phoneLocal").value = contact.phoneLocal;
    document.getElementById("email").value = contact.email;
    document.getElementById("age").value = contact.age || "";
    document.getElementById("avatarUrl").value = contact.avatarMode === "url" ? contact.avatar : "";
    document.getElementById("avatarFile").value = "";
    updateAvatarPreviewText(contact.avatarMode, contact.avatar);
    showFormView();
}

// Riporta il form alla modalità creazione e ripulisce lo stato di editing.
function resetFormMode() {
    // Ripristina il form in modalita creazione e rimuove eventuali stati residui di editing.
    state.editingContactId = null;
    formTitle.textContent = "Nuovo Contatto";
    submitBtn.textContent = "Salva Contatto";
    cancelEditBtn.classList.add("d-none");
    contactForm.reset();
    setCountryDialCode("+39", "it");
    updateAvatarPreviewText();
    showFormView();
}

// Gestisce modifica ed eliminazione tramite event delegation sulle card.
function handleListActions(event) {
    // Gestione delegata delle azioni sulle card: modifica o eliminazione del contatto scelto.
    const target = event.target.closest("button[data-action]");
    if (!target) {
        return;
    }

    const contact = state.contacts.find((entry) => entry.id === target.dataset.id);
    if (!contact) {
        return;
    }

    if (target.dataset.action === "edit") {
        setEditMode(contact);
        return;
    }

    if (target.dataset.action === "delete") {
        const confirmed = window.confirm(`Eliminare il contatto ${contact.fullName}?`);
        if (!confirmed) {
            return;
        }

        state.contacts = state.contacts.filter((entry) => entry.id !== contact.id);
        saveContacts();
        searchState.currentPage = 1;
        applySearch();
        showAlert("Contatto eliminato.", "success");

        if (state.editingContactId === contact.id) {
            resetFormMode();
        }
    }
}

// Converte un file immagine in base64 per poterlo salvare nel localStorage.
function readFileAsDataUrl(file) {
    // Converte il file immagine selezionato in stringa base64 da salvare nel contatto.
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Errore durante la lettura del file avatar."));
        reader.readAsDataURL(file);
    });
}

// Aggiorna il testo informativo sull'avatar selezionato nel form.
function updateAvatarPreviewText(modeOverride, valueOverride) {
    // Piccolo testo di supporto sotto al form: aiuta a capire quale sorgente avatar verrà usata.
    const file = avatarFileInput.files?.[0];
    const avatarUrl = avatarUrlInput.value.trim();

    if (modeOverride === "file") {
        avatarPreview.textContent = "Avatar attuale da file base64.";
        return;
    }

    if (modeOverride === "url") {
        avatarPreview.textContent = `Avatar attuale da URL: ${valueOverride}`;
        return;
    }

    if (file) {
        avatarPreview.textContent = `Avatar selezionato da file: ${file.name}`;
        return;
    }

    if (avatarUrl) {
        avatarPreview.textContent = "Avatar selezionato da URL.";
        return;
    }

    avatarPreview.textContent = "Nessun avatar selezionato: verra usato il placeholder automatico.";
}

// Valida, normalizza e salva un contatto nuovo o modificato.
async function handleSubmit(event) {
    // Salvataggio contatto: valida, normalizza, verifica duplicati e costruisce il payload finale.
    event.preventDefault();

    const formData = new FormData(contactForm);
    const fullName = String(formData.get("fullName") || "").trim();
    const countryCode = String(formData.get("countryCode") || "").trim();
    const countryIso = String(formData.get("countryIso") || "").trim().toLowerCase();
    const phoneLocal = String(formData.get("phoneLocal") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const age = formData.get("age") ? parseInt(String(formData.get("age")).trim()) : null;
    const avatarUrl = String(formData.get("avatarUrl") || "").trim();
    const avatarFile = avatarFileInput.files?.[0] || null;

    if (!fullName || !countryCode || !phoneLocal || !email) {
        showAlert("Compila tutti i campi obbligatori.", "warning");
        return;
    }

    const normalizedCountryCode = normalizeCountryCode(countryCode);
    const normalizedLocalPhone = normalizeLocalPhone(phoneLocal);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedCountryCode || !normalizedLocalPhone || !normalizedEmail) {
        showAlert("Dati non validi: controlla telefono, prefisso ed email.", "warning");
        return;
    }

    const candidate = {
        countryCode: normalizedCountryCode, phoneLocal: normalizedLocalPhone, email: normalizedEmail
    };

    if (isDuplicateContact(state.contacts, candidate, {ignoreId: state.editingContactId})) {
        showAlert("Contatto gia presente: email o telefono duplicati.", "danger");
        return;
    }

    let avatarBase64 = "";
    if (avatarFile) {
        try {
            avatarBase64 = await readFileAsDataUrl(avatarFile);
        } catch (error) {
            showAlert(error.message, "danger");
            return;
        }
    }

    let existingAvatarBase64 = "";
    if (state.editingContactId && !avatarFile && !avatarUrl) {
        const existingContact = state.contacts.find((entry) => entry.id === state.editingContactId);
        if (existingContact?.avatarMode === "file") {
            existingAvatarBase64 = existingContact.avatar;
        }
    }

    const avatar = resolveAvatarSource({
        avatarUrl, avatarBase64: avatarBase64 || existingAvatarBase64, fullName
    });

    const contactPayload = {
        id: state.editingContactId || crypto.randomUUID(),
        fullName,
        countryCode: normalizedCountryCode,
        countryIso: countryIso || selectedCountry?.code || "",
        countryName: selectedCountry?.name || "",
        phoneLocal: normalizedLocalPhone,
        phoneInternational: buildInternationalPhone(normalizedCountryCode, normalizedLocalPhone),
        email: normalizedEmail,
        age,
        avatar: avatar.avatar,
        avatarMode: avatar.avatarMode,
        placeholderInitial: avatar.placeholderInitial
    };

    if (state.editingContactId) {
        state.contacts = state.contacts.map((entry) => {
            return entry.id === state.editingContactId ? contactPayload : entry;
        });
        showAlert("Contatto modificato con successo.", "success");
    } else {
        state.contacts.push(contactPayload);
        showAlert("Contatto salvato con successo.", "success");
    }

    saveContacts();
    resetFormMode();
    searchState.currentPage = 1;
    searchState.searchQuery = "";
    searchState.filteredContacts = [...state.contacts];
    showListView();
}

// Legge il tema salvato e lo applica al caricamento della pagina.
function initTheme() {
    // Tema iniziale letto da localStorage per mantenere la scelta dell'utente anche dopo il refresh.
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);
}

// Applica tema chiaro o scuro e aggiorna il toggle visivo corrispondente.
function applyTheme(theme) {
    // Applica la modalità chiara/scura e aggiorna l'icona del toggle in base al tema attivo.
    const isDark = theme === "dark";
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
        html.setAttribute("data-bs-theme", "dark");
        body.classList.add("bg-dark");
        body.classList.remove("bg-body-tertiary");
        themeIcon.textContent = "🌙";
    } else {
        html.removeAttribute("data-bs-theme");
        body.classList.add("bg-body-tertiary");
        body.classList.remove("bg-dark");
        themeIcon.textContent = "☀️";
    }

    localStorage.setItem(THEME_KEY, theme);
}

// Inverte il tema corrente tra modalità chiara e scura.
function toggleTheme() {
    // Alterna tra light e dark senza perdere la preferenza memorizzata.
    const current = localStorage.getItem(THEME_KEY) || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
}

// Mostra la barra di ricerca globale quando l'utente entra nella vista lista.
function showSearchBar() {
    // La barra di ricerca globale si mostra solo quando si entra nella vista lista.
    searchBar.classList.remove("d-none");
    globalSearchInput.focus();
}

// Nasconde la barra di ricerca globale e azzera la query attiva.
function hideSearchBar() {
    // Tornando al form, la ricerca viene azzerata per evitare filtri residui.
    searchBar.classList.add("d-none");
    searchState.searchQuery = "";
    globalSearchInput.value = "";
}

// Aggiorna la query di ricerca globale e rilancia il filtro.
function handleGlobalSearch(event) {
    // Ricerca testuale globale su nome, email, telefono ed età.
    searchState.searchQuery = String(event.target.value || "").trim().toLowerCase();
    searchState.currentPage = 1;
    applySearch();
}

// Filtra i contatti per nome, email, telefono ed età e aggiorna la paginazione.
function applySearch() {
    // Filtra la lista completa e aggiorna la vista paginata in base alla query corrente.
    if (!searchState.searchQuery) {
        searchState.filteredContacts = [...state.contacts];
    } else {
        searchState.filteredContacts = state.contacts.filter((contact) => {
            const lowerName = String(contact.fullName || "").toLowerCase();
            const lowerEmail = String(contact.email || "").toLowerCase();
            const lowerPhone = String(contact.phoneInternational || "").toLowerCase();
            const age = String(contact.age || "").toLowerCase();
            const q = searchState.searchQuery;

            return lowerName.includes(q) || lowerEmail.includes(q) || lowerPhone.includes(q) || age.includes(q);
        });
    }

    renderContactsPage();
}

// Renderizza la pagina corrente della rubrica filtrata come griglia di card.
function renderContactsPage() {
    // Rendering card: la lista visualizzata è sempre una sotto-selezione della rubrica filtrata.
    contactsGrid.innerHTML = "";
    paginationList.innerHTML = "";

    if (searchState.filteredContacts.length === 0) {
        noContactsMsg.classList.remove("d-none");
        paginationNav.classList.add("d-none");
        return;
    }

    noContactsMsg.classList.add("d-none");
    const totalPages = Math.ceil(searchState.filteredContacts.length / CONTACTS_PER_PAGE);
    const start = (searchState.currentPage - 1) * CONTACTS_PER_PAGE;
    const end = start + CONTACTS_PER_PAGE;
    const pageContacts = searchState.filteredContacts.slice(start, end);

    pageContacts.forEach((contact) => {
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column";

        const avatar = contact.avatar
            ? `<img src="${contact.avatar}" alt="${contact.fullName}" class="rounded-circle mb-2" style="width:50px; height:50px; object-fit:cover;">`
            : `<div class="rounded-circle mb-2 d-inline-flex align-items-center justify-content-center" style="width:50px; height:50px; background:#0d6efd; color:white; font-weight:700;">${getPlaceholderInitial(contact.fullName)}</div>`;

        cardBody.innerHTML = `
            ${avatar}
            <h5 class="card-title mb-1">${contact.fullName}</h5>
            <p class="card-text small mb-2">
                <strong>Email:</strong> ${contact.email}<br>
                <strong>Telefono:</strong> ${contact.phoneInternational}
                ${contact.age ? `<br><strong>Età:</strong> ${contact.age} anni` : ""}
            </p>
        `;

        const actionWrap = document.createElement("div");
        actionWrap.className = "d-flex gap-2 mt-auto";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-sm btn-outline-primary flex-grow-1";
        editBtn.dataset.action = "edit";
        editBtn.dataset.id = contact.id;
        editBtn.textContent = "Modifica";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger flex-grow-1";
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = contact.id;
        deleteBtn.textContent = "Elimina";

        actionWrap.append(editBtn, deleteBtn);
        cardBody.appendChild(actionWrap);
        card.appendChild(cardBody);
        col.appendChild(card);
        contactsGrid.appendChild(col);
    });

    if (totalPages > 1) {
        paginationNav.classList.remove("d-none");
        renderPagination(totalPages, searchState.currentPage);
    } else {
        paginationNav.classList.add("d-none");
    }
}

// Costruisce i controlli di paginazione Bootstrap per la lista contatti.
function renderPagination(totalPages, currentPage) {
    // Paginazione Bootstrap: precedente, numeri pagina e successivo.
    paginationList.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-link";
    prevBtn.textContent = "Precedente";
    prevBtn.type = "button";
    if (currentPage > 1) {
        prevBtn.addEventListener("click", () => {
            searchState.currentPage--;
            renderContactsPage();
        });
    } else {
        prevBtn.disabled = true;
    }
    prevLi.appendChild(prevBtn);
    paginationList.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        const btn = document.createElement("button");
        btn.className = "page-link";
        btn.textContent = String(i);
        btn.type = "button";
        btn.addEventListener("click", () => {
            searchState.currentPage = i;
            renderContactsPage();
        });
        li.appendChild(btn);
        paginationList.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-link";
    nextBtn.textContent = "Successivo";
    nextBtn.type = "button";
    if (currentPage < totalPages) {
        nextBtn.addEventListener("click", () => {
            searchState.currentPage++;
            renderContactsPage();
        });
    } else {
        nextBtn.disabled = true;
    }
    nextLi.appendChild(nextBtn);
    paginationList.appendChild(nextLi);
}

