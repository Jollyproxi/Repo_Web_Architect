import {countries} from "../node_modules/country-codes-flags-phone-codes/dist/index.mjs";
import {
    normalizeEmail,
    normalizeCountryCode,
    normalizeLocalPhone,
    buildInternationalPhone,
    getPlaceholderInitial,
    resolveAvatarSource,
    isDuplicateContact
} from "./contact-utils.js";

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} fullName
 * @property {string} countryCode
 * @property {string=} countryIso
 * @property {string=} countryName
 * @property {string} phoneLocal
 * @property {string} phoneInternational
 * @property {string} email
 * @property {number|null=} age
 * @property {string} avatar
 * @property {"file"|"url"|"placeholder"} avatarMode
 * @property {string} placeholderInitial
 */

/**
 * @typedef {Object} ContactCandidate
 * @property {string} countryCode
 * @property {string} phoneLocal
 * @property {string} email
 */

/**
 * @typedef {Object} CountryOption
 * @property {string} dialCode
 * @property {string} countryName
 * @property {string} iso2
 * @property {string} flag
 * @property {string} code
 * @property {string} searchable
 */

/**
 * @typedef {Object} SelectedCountry
 * @property {string} name
 * @property {string} code
 * @property {string} flag
 * @property {string} dialCode
 */

/**
 * @typedef {Object} AvatarInput
 * @property {string=} avatarUrl
 * @property {string=} avatarBase64
 * @property {string=} fullName
 */

/**
 * @typedef {Object} AvatarResult
 * @property {string} avatar
 * @property {"file"|"url"|"placeholder"} avatarMode
 * @property {string} placeholderInitial
 */

// ============================================================================
// Stato applicazione
// ============================================================================
const APP_DATA_KEY = "rubrica-giolitti-app-data";
const SESSION_KEY = "rubrica-giolitti-session";
const THEME_KEY = "rubrica-theme";
const CONTACTS_PER_PAGE = 6;

// Sposta qui su le variabili che servono a loadContacts
const countryByDialCode = new Map();
const countryOptions = [];
let selectedCountry = null;

// Variabili per la ricerca da tastiera (Convenzione standard)
let typeSearchBuffer = "";
let typeSearchTimeout = null;

const appData = {users: []};
let sessionState = {loggedInUserId: "", userId: "", bookId: ""};

const state = {
    contacts: [],
    editingContactId: null
};

const searchState = {
    searchQuery: "",
    currentPage: 1,
    filteredContacts: []
};

//Utilizzo il metodo moderno che permette di usare css per cercare quearyselector
const authView = document.querySelector("#authView");
const authForm = document.querySelector("#authForm");
const authUsernameInput = document.querySelector("#authUsername");
const authPasswordInput = document.querySelector("#authPassword");
const authHint = document.querySelector("#authHint");
const appShell = document.querySelector("#appShell");
const activeUserLabel = document.querySelector("#activeUserLabel");
const activeBookSelect = document.querySelector("#activeBookSelect");
const newBookBtn = document.querySelector("#newBookBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const alertBox = document.querySelector("#alertBox");
const formView = document.querySelector("#formView");
const listView = document.querySelector("#listView");
const showFormBtn = document.querySelector("#showFormBtn");
const showListBtn = document.querySelector("#showListBtn");
const formTitle = document.querySelector("#formTitle");
const submitBtn = document.querySelector("#submitBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const avatarPreview = document.querySelector("#avatarPreview");
const avatarFileInput = document.querySelector("#avatarFile");
const avatarUrlInput = document.querySelector("#avatarUrl");
const countryCodeSelect = document.querySelector("#countryCode");
const countryIsoInput = document.querySelector("#countryIso");
const countryDropdownBtn = document.querySelector("#countryDropdownBtn");
const countryDropdownList = document.querySelector("#countryDropdownList");
const countryDropdownOptions = document.querySelector("#countryDropdownOptions");
const countryNoResults = document.querySelector("#countryNoResults");
const themeTglBtn = document.querySelector("#themeTglBtn");
const themeIcon = document.querySelector("#themeIcon");
const searchBar = document.querySelector("#searchBar");
const globalSearchInput = document.querySelector("#globalSearchInput");
const contactsGrid = document.querySelector("#contactsGrid");
const noContactsMsg = document.querySelector("#noContactsMsg");
const paginationNav = document.querySelector("#paginationNav");
const paginationList = document.querySelector("#paginationList");
const accountSettingsBtn = document.querySelector("#accountSettingsBtn");
const accountModal = document.querySelector("#accountModal");
const accountForm = document.querySelector("#accountForm");
const accountNewPassword = document.querySelector("#accountNewPassword");
const accountConfirmPassword = document.querySelector("#accountConfirmPassword");
const changePasswordBtn = document.querySelector("#changePasswordBtn");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");

/**
 * Normalizza un contatto salvato nel formato corrente.
 * @param {Contact} entry
 * @returns {Contact}
 */
function normalizeStoredContact(entry) {
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
        placeholderInitial: entry.placeholderInitial || getPlaceholderInitial(fullName),
        createdBy: String(entry.createdBy || "")
    };
}

/**
 * Normalizza una lista di contatti salvati.
 * @param {Contact[]} entries
 * @returns {Contact[]}
 */
function normalizeStoredContacts(entries) {
    return Array.isArray(entries) ? entries.map((entry) => normalizeStoredContact(entry)) : [];
}

/**
 * Normalizza una rubrica salvata.
 * @param {unknown} entry
 * @returns {{id: string, name: string, contacts: Contact[]}}
 */
function normalizeBook(entry) {
    return {
        id: String(entry?.id || crypto.randomUUID()),
        name: String(entry?.name || "Rubrica principale").trim() || "Rubrica principale",
        contacts: normalizeStoredContacts(entry?.contacts || [])
    };
}

/**
 * Normalizza un account salvato.
 * @param {unknown} entry
 * @returns {{id: string, username: string, password: string, isAdmin?: boolean, books: Array<{id: string, name: string, contacts: Contact[]}>}}
 */
function normalizeUser(entry) {
    const books = Array.isArray(entry?.books) && entry.books.length > 0 ? entry.books.map((book) => normalizeBook(book)) : [normalizeBook({name: "Rubrica principale", contacts: []})];
    const isAdmin = Boolean(entry?.isAdmin === true);

    return {
        id: String(entry?.id || crypto.randomUUID()),
        username: normalizeAuthName(entry?.username),
        password: String(entry?.password || ""),
        isAdmin,
        books
    };
}

/**
 * Normalizza il nome utente per i confronti.
 * @param {unknown} value
 * @returns {string}
 */
function normalizeAuthName(value) {
    return String(value || "").trim().toLowerCase();
}

/**
 * Legge la struttura dati dell'app da localStorage.
 * @returns {{users: Array<{id: string, username: string, password: string, books: Array<{id: string, name: string, contacts: Contact[]}>}>}}
 */
function loadAppData() {
    const raw = localStorage.getItem(APP_DATA_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            const users = Array.isArray(parsed?.users) ? parsed.users.map((entry) => normalizeUser(entry)) : [];
            return {users};
        } catch (error) {
            console.error("Errore nel caricamento dei dati applicativi:", error);
        }
    }

    return {users: []};
}

/**
 * Salva la struttura dati dell'app in localStorage.
 * @returns {void}
 */
function saveAppData() {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify({users: appData.users}));
}

/**
 * Legge la sessione attiva dall'area di sessione del browser.
 * @returns {{userId: string, bookId: string}}
 */
function loadSessionState() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
        return {loggedInUserId: "", userId: "", bookId: ""};
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            loggedInUserId: String(parsed?.loggedInUserId || parsed?.userId || ""),
            userId: String(parsed?.userId || ""),
            bookId: String(parsed?.bookId || "")
        };
    } catch (error) {
        console.error("Errore nel caricamento della sessione:", error);
        return {loggedInUserId: "", userId: "", bookId: ""};
    }
}

/**
 * Salva la sessione corrente.
 * @returns {void}
 */
function saveSessionState() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionState));
}

/**
 * Restituisce l'utente autenticato.
 * @returns {{id: string, username: string, password: string, books: Array<{id: string, name: string, contacts: Contact[]}>}|null}
 */
function getActiveUser() {
    return appData.users.find((user) => user.id === sessionState.userId) || null;
}

/**
 * Restituisce la rubrica attiva dell'utente autenticato.
 * @returns {{id: string, name: string, contacts: Contact[]}|null}
 */
function getActiveBook() {
    const user = getActiveUser();
    if (!user) {
        return null;
    }

    return user.books.find((book) => book.id === sessionState.bookId) || user.books[0] || null;
}

/**
 * Sincronizza lo stato locale con la rubrica attiva.
 * @returns {void}
 */
function syncStateFromActiveBook() {
    const activeBook = getActiveBook();
    state.contacts = activeBook ? [...activeBook.contacts] : [];
    state.editingContactId = null;
    searchState.searchQuery = "";
    searchState.currentPage = 1;
    searchState.filteredContacts = [...state.contacts];
    globalSearchInput.value = "";
}

/**
 * Aggiorna il testo di aiuto nel pannello di accesso.
 * @param {string} message
 * @param {"secondary"|"info"|"warning"|"success"|"danger"} [type="secondary"]
 * @returns {void}
 */
function renderAuthHint(message, type = "secondary") {
    authHint.className = `small text-${type} mt-3`;
    authHint.textContent = message;
}

/**
 * Aggiorna il selettore delle rubriche e le etichette dell'area workspace.
 * @returns {void}
 */
function renderWorkspaceBar() {
    const user = getActiveUser();

    if (!user) {
        activeUserLabel.textContent = "-";
        activeBookSelect.innerHTML = "";
        activeBookSelect.disabled = true;
        newBookBtn.disabled = true;
        accountSettingsBtn.disabled = true;
        logoutBtn.disabled = true;
        return;
    }

    const isAdmin = isCurrentUserAdmin();
    activeUserLabel.textContent = isAdmin ? `${user.username} (Admin)` : user.username;
    activeBookSelect.innerHTML = "";

    if (isAdmin) {
        activeBookSelect.innerHTML = '<option value="">Seleziona utente/rubrica...</option>';
        appData.users.forEach((u) => {
            u.books.forEach((book) => {
                const option = document.createElement("option");
                option.value = `${u.id}|${book.id}`;
                option.textContent = `${u.username} - ${book.name}`;
                option.selected = u.id === sessionState.userId && book.id === sessionState.bookId;
                activeBookSelect.appendChild(option);
            });
        });
    } else {
        user.books.forEach((book) => {
            const option = document.createElement("option");
            option.value = book.id;
            option.textContent = book.name;
            option.selected = book.id === sessionState.bookId;
            activeBookSelect.appendChild(option);
        });
    }

    activeBookSelect.disabled = activeBookSelect.options.length <= (isAdmin ? 1 : 0);
    newBookBtn.disabled = isAdmin && sessionState.userId !== user.id ? true : false;
    accountSettingsBtn.disabled = isAdmin && sessionState.userId !== user.id ? true : false;
    logoutBtn.disabled = false;
}

/**
 * Mostra l'area autenticata.
 * @returns {void}
 */
function showAppView() {
    authView.classList.add("d-none");
    appShell.classList.remove("d-none");
}

/**
 * Mostra il pannello di accesso.
 * @returns {void}
 */
function showAuthView() {
    appShell.classList.add("d-none");
    authView.classList.remove("d-none");
    authUsernameInput.focus();
}

/**
 * Crea una rubrica vuota.
 * @param {string} name
 * @returns {{id: string, name: string, contacts: Contact[]}}
 */
function createEmptyBook(name) {
    return {
        id: crypto.randomUUID(),
        name: String(name || "Rubrica principale").trim() || "Rubrica principale",
        contacts: []
    };
}

/**
 * Inizializza lo stato dell'app dopo il caricamento della pagina.
 * @returns {void}
 */
function bootstrapApp() {
    Object.assign(appData, loadAppData());
    seedAdminIfNeeded();
    sessionState = loadSessionState();

    const activeUser = getActiveUser();
    if (sessionState.userId && activeUser) {
        if (!activeUser.books.some((book) => book.id === sessionState.bookId)) {
            sessionState.bookId = activeUser.books[0]?.id || "";
        }

        syncStateFromActiveBook();
        renderWorkspaceBar();
        showAppView();
        showListView();

        return;
    }

    renderWorkspaceBar();
    showAuthView();

    renderAuthHint("Crea un account per iniziare oppure accedi a uno già esistente.", "secondary");
}

/**
 * Gestisce accesso e creazione account.
 * @param {SubmitEvent} event
 * @returns {void}
 */
function handleAuthSubmit(event) {
    event.preventDefault();

    const action = event.submitter?.dataset.action || "login";
    const username = normalizeAuthName(authUsernameInput.value);
    const password = String(authPasswordInput.value || "").trim();

    if (!username || !password) {
        renderAuthHint("Inserisci nome utente e password.", "warning");
        return;
    }

    if (action === "register") {
        if (appData.users.some((user) => user.username === username)) {
            renderAuthHint("Questo nome utente è già in uso.", "danger");
            return;
        }

        const newUser = {
            id: crypto.randomUUID(),
            username,
            password,
            books: [createEmptyBook("Rubrica principale")]
        };

        appData.users.push(newUser);
        saveAppData();
        sessionState = {loggedInUserId: newUser.id, userId: newUser.id, bookId: newUser.books[0].id};
        saveSessionState();
        syncStateFromActiveBook();
        renderWorkspaceBar();
        showAppView();
        showListView();
        renderAuthHint("Account creato con successo.", "success");
        showAlert("Account creato e rubrica iniziale pronta.", "success");
        return;
    }

    const user = appData.users.find((entry) => entry.username === username && entry.password === password);
    if (!user) {
        renderAuthHint("Credenziali non valide.", "danger");
        return;
    }

    sessionState = {
        loggedInUserId: user.id,
        userId: user.id,
        bookId: user.books[0]?.id || ""
    };
    saveSessionState();
    syncStateFromActiveBook();
    renderWorkspaceBar();
    showAppView();
    showListView();
    renderAuthHint("Accesso effettuato.", "success");
}

/**
 * Cambia la rubrica attiva (e l'utente per admin).
 * @returns {void}
 */
function handleBookChange() {
    const user = getActiveUser();
    if (!user) {
        return;
    }

    const isAdmin = isCurrentUserAdmin();
    const selection = activeBookSelect.value;

    if (!selection) {
        return;
    }

    saveContacts();

    if (isAdmin && selection.includes("|")) {
        const [userId, bookId] = selection.split("|");
        sessionState.userId = userId;
        sessionState.bookId = bookId;
    } else {
        sessionState.userId = sessionState.loggedInUserId;
        sessionState.bookId = selection;
    }

    saveSessionState();
    syncStateFromActiveBook();
    resetFormMode();
    renderWorkspaceBar();
    applySearch();
    showListView();
}

/**
 * Crea una nuova rubrica per l'utente attivo.
 * @returns {void}
 */
function handleCreateBook() {
    const user = getActiveUser();
    if (!user) {
        return;
    }

    const name = window.prompt("Nome della nuova rubrica:", "Nuova rubrica");
    if (!name) {
        return;
    }

    const trimmedName = String(name).trim();
    if (!trimmedName) {
        renderAuthHint("Inserisci un nome valido per la rubrica.", "warning");
        return;
    }

    if (user.books.some((book) => book.name.toLowerCase() === trimmedName.toLowerCase())) {
        renderAuthHint("Esiste già una rubrica con questo nome.", "danger");
        return;
    }

    const newBook = createEmptyBook(trimmedName);
    user.books.push(newBook);
    sessionState.bookId = newBook.id;
    saveAppData();
    saveSessionState();
    syncStateFromActiveBook();
    renderWorkspaceBar();
    resetFormMode();
    showListView();
    showAlert(`Rubrica ${newBook.name} creata con successo.`, "success");
}

/**
 * Chiude la sessione corrente.
 * @returns {void}
 */
function handleLogout() {
    saveContacts();
    sessionState = {loggedInUserId: "", userId: "", bookId: ""};
    sessionStorage.removeItem(SESSION_KEY);
    state.contacts = [];
    state.editingContactId = null;
    searchState.searchQuery = "";
    searchState.currentPage = 1;
    searchState.filteredContacts = [];
    globalSearchInput.value = "";
    renderWorkspaceBar();
    showAuthView();
    renderAuthHint("Sessione chiusa. Effettua di nuovo l'accesso per continuare.", "secondary");
}

/**
 * Cambia la password dell'utente attivo.
 * @returns {void}
 */
function handleChangePassword() {
    const user = getActiveUser();
    if (!user) {
        showAlert("Nessun utente autenticato.", "danger");
        return;
    }

    const newPassword = String(accountNewPassword.value || "").trim();
    const confirmPassword = String(accountConfirmPassword.value || "").trim();

    if (!newPassword || !confirmPassword) {
        showAlert("Inserisci la nuova password e la conferma.", "warning");
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert("Le password non corrispondono.", "danger");
        return;
    }

    if (newPassword.length < 3) {
        showAlert("La password deve avere almeno 3 caratteri.", "warning");
        return;
    }

    user.password = newPassword;
    saveAppData();
    accountNewPassword.value = "";
    accountConfirmPassword.value = "";
    showAlert("Password cambiata con successo.", "success");
    const modalInstance = bootstrap.Modal.getInstance(accountModal);
    if (modalInstance) modalInstance.hide();
}

/**
 * Elimina l'account dell'utente attivo.
 * @returns {void}
 */
function handleDeleteAccount() {
    const user = getActiveUser();
    if (!user) {
        showAlert("Nessun utente autenticato.", "danger");
        return;
    }

    const confirmed = window.confirm(
        `Sei sicuro di voler eliminare l'account ${user.username}? Questa azione è irreversibile e tutti i dati verranno persi.`
    );
    if (!confirmed) {
        return;
    }

    appData.users = appData.users.filter((u) => u.id !== user.id);
    saveAppData();
    sessionState = {loggedInUserId: "", userId: "", bookId: ""};
    sessionStorage.removeItem(SESSION_KEY);
    state.contacts = [];
    state.editingContactId = null;
    searchState.searchQuery = "";
    searchState.currentPage = 1;
    searchState.filteredContacts = [];
    globalSearchInput.value = "";
    renderWorkspaceBar();
    showAuthView();
    renderAuthHint("Account eliminato. Puoi crearne un nuovo.", "info");
    const modalInstance = bootstrap.Modal.getInstance(accountModal);
    if (modalInstance) modalInstance.hide();
}

/**
 * Inizializza il database con un account superuser admin/admin se non esistono utenti.
 * @returns {void}
 */
function seedAdminIfNeeded() {
    if (appData.users.length === 0) {
        const adminUser = {
            id: crypto.randomUUID(),
            username: "admin",
            password: "admin",
            isAdmin: true,
            books: [createEmptyBook("Rubrica principale")]
        };
        appData.users.push(adminUser);
        saveAppData();
    }
}

/**
 * Verifica se l'utente autenticato è un amministratore.
 * @returns {boolean}
 */
function isCurrentUserAdmin() {
    const loggedInUser = appData.users.find((user) => user.id === sessionState.loggedInUserId);
    return Boolean(loggedInUser?.isAdmin === true);
}

// ============================================================================
// Eventi UI
// ============================================================================
// Tutti gli eventi vengono collegati una sola volta all'avvio, così la logica
// rimane centralizzata e non si disperde in più file.
authForm.addEventListener("submit", handleAuthSubmit);
activeBookSelect.addEventListener("change", handleBookChange);
newBookBtn.addEventListener("click", handleCreateBook);
accountSettingsBtn.addEventListener("click", () => {
    const modal = new bootstrap.Modal(accountModal);
    modal.show();
});
changePasswordBtn.addEventListener("click", handleChangePassword);
deleteAccountBtn.addEventListener("click", handleDeleteAccount);
logoutBtn.addEventListener("click", handleLogout);
contactForm.addEventListener("submit", handleSubmit);
showFormBtn.addEventListener("click", showFormView);
showListBtn.addEventListener("click", showListView);
cancelEditBtn.addEventListener("click", resetFormMode);
contactsGrid.addEventListener("click", handleListActions);
avatarFileInput.addEventListener("change", updateAvatarPreviewText);
avatarUrlInput.addEventListener("input", updateAvatarPreviewText);
countryDropdownList.addEventListener("click", handleCountrySelection);
countryDropdownList.addEventListener("keydown", handleCountryTypeSearch);
countryDropdownBtn.addEventListener("shown.bs.dropdown", () => {
    typeSearchBuffer = ""; // Reset buffer
    countryDropdownList.focus(); // Porta il focus sulla lista per ascoltare i tasti
});

themeTglBtn.addEventListener("click", toggleTheme);
globalSearchInput.addEventListener("input", handleGlobalSearch);
showListBtn.addEventListener("click", showSearchBar);
showFormBtn.addEventListener("click", hideSearchBar);

populateCountryCodeOptions();
initTheme();
bootstrapApp();
updateAvatarPreviewText();


/**
 * Gestisce la ricerca tramite tastiera (type-to-select).
 * Segue la convenzione: accumula caratteri digitati rapidamente per cercare il paese.
 * @param {KeyboardEvent} event
 */
function handleCountryTypeSearch(event) {
    // 1. Ignora i tasti di controllo
    if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }

    event.preventDefault();

    // 2. Gestione Buffer
    clearTimeout(typeSearchTimeout);
    typeSearchBuffer += event.key.toLowerCase();
    typeSearchTimeout = setTimeout(() => {
        typeSearchBuffer = "";
    }, 500);

    // 3. Ricerca del match
    const match = countryOptions.find(opt =>
        opt.countryName.toLowerCase().startsWith(typeSearchBuffer)
    );

    if (match) {
        const buttons = countryDropdownOptions.querySelectorAll("button");
        const targetBtn = Array.from(buttons).find(btn =>
            btn.dataset.dialCode === match.dialCode && btn.dataset.iso2 === match.iso2
        );

        if (targetBtn) {
            targetBtn.focus(); // Importante: sposta il focus sul pulsante
            targetBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }
}

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
/**
 * @param {CountryOption[]} options
 * @returns {void}
 */
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

// Gestisce il click su una voce della dropdown dei prefissi.
/**
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleCountrySelection(event) {
    const button = event.target.closest("button[data-dial-code]");
    if (!button) {
        return;
    }

    setCountryDialCode(button.dataset.dialCode, button.dataset.iso2);
}

// Aggiorna il prefisso selezionato sia nel campo nascosto sia nel bottone visibile.
/**
 * @param {string} dialCode
 * @param {string=} iso2
 * @returns {void}
 */
function setCountryDialCode(dialCode, iso2 = "") {
    // Allinea valore prefisso + nazione specifica per i casi con prefisso condiviso.
    const country = getCountryOptionBySelection(dialCode, iso2) || countryByDialCode.get(dialCode);
    countryCodeSelect.value = dialCode;
    countryIsoInput.value = String(country?.code || "").toLowerCase();
    selectedCountry = country || null;

    if (!country) {
        countryDropdownBtn.replaceChildren();

        const label = document.createElement("span");
        label.className = "country-select-label";
        label.textContent = `Prefisso ${dialCode}`;

        countryDropdownBtn.append(label);
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

    const label = document.createElement("span");
    label.className = "country-select-label";
    label.textContent = `${country.name} (${dialCode})`;

    countryDropdownBtn.append(flag, label);
}

// Restituisce la nazione precisa in base a prefisso+iso; fallback al primo match per prefisso.
/**
 * @param {string} dialCode
 * @param {string} iso2
 * @returns {SelectedCountry|null}
 */
function getCountryOptionBySelection(dialCode, iso2) {
    const normalizedDialCode = String(dialCode || "").trim();
    const normalizedIso2 = String(iso2 || "").trim().toLowerCase();

    if (normalizedDialCode && normalizedIso2) {
        const exact = countryOptions.find((item) => {
            return item.dialCode === normalizedDialCode && item.iso2 === normalizedIso2;
        });

        if (exact) {
            return {
                name: exact.countryName, code: exact.iso2, flag: exact.flag, dialCode: exact.dialCode
            };
        }
    }

    const byDial = countryOptions.find((item) => item.dialCode === normalizedDialCode);
    if (!byDial) {
        return null;
    }

    return {
        name: byDial.countryName, code: byDial.iso2, flag: byDial.flag, dialCode: byDial.dialCode
    };
}

// Costruisce il path SVG della bandiera locale a partire dal codice ISO2.
/**
 * @param {string} iso2LowerCase
 * @returns {string}
 */
function getFlagIconPath(iso2LowerCase) {
    return `./node_modules/flag-icons/flags/4x3/${iso2LowerCase}.svg`;
}

// Ritorna un'emoji bandiera come fallback quando l'icona SVG non è disponibile.
/**
 * @param {unknown} flag
 * @param {unknown} countryCode
 * @returns {string}
 */
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

// Salva la rubrica attiva dentro la struttura utenti/rubriche.
/**
 * @returns {void}
 */
function saveContacts() {
    const activeUser = getActiveUser();
    const activeBook = getActiveBook();

    if (!activeUser || !activeBook) {
        return;
    }

    activeBook.contacts = [...state.contacts];
    saveAppData();
}

// Mostra messaggi Bootstrap dismissibili per conferme, errori e avvisi.
/**
 * @param {string} message
 * @param {"info"|"success"|"warning"|"danger"|"primary"|"secondary"} [type="info"]
 * @returns {void}
 */
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
/**
 * @returns {void}
 */
function showFormView() {
    // La vista form e la vista lista si escludono a vicenda.
    formView.classList.remove("d-none");
    listView.classList.add("d-none");
    showListBtn.classList.remove("btn-outline-primary");
    showListBtn.classList.add("btn-primary");
    showFormBtn.classList.remove("btn-primary");
    showFormBtn.classList.add("btn-outline-primary");
}

// Mostra la rubrica filtrata/paginata e nasconde il form di inserimento.
/**
 * @returns {void}
 */
function showListView() {
    // Quando apro la lista ricalcolo i risultati filtrati e riparto dalla pagina 1.
    listView.classList.remove("d-none");
    formView.classList.add("d-none");
    showListBtn.classList.remove("btn-primary");
    showListBtn.classList.add("btn-outline-primary");
    showFormBtn.classList.remove("btn-outline-primary");
    showFormBtn.classList.add("btn-primary");
    showSearchBar();
    searchState.currentPage = 1;
    applySearch();
}

// Carica i dati del contatto nel form per permettere la modifica.
/**
 * @param {Contact} contact
 * @returns {void}
 */
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
/**
 * @returns {void}
 */
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
/**
 * @param {MouseEvent} event
 * @returns {void}
 */
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
/**
 * @param {File} file
 * @returns {Promise<string>}
 */
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
/**
 * @param {string=} modeOverride
 * @param {string=} valueOverride
 * @returns {void}
 */
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
/**
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */
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
        placeholderInitial: avatar.placeholderInitial,
        createdBy: getActiveUser()?.username || ""
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
/**
 * @returns {void}
 */
function initTheme() {
    // Tema iniziale letto da localStorage per mantenere la scelta dell'utente anche dopo il refresh.
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);
}

// Applica tema chiaro o scuro e aggiorna il toggle visivo corrispondente.
/**
 * @param {"light"|"dark"} theme
 * @returns {void}
 */
function applyTheme(theme) {
    const isDark = theme === "dark";
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
        html.setAttribute("data-bs-theme", "dark");
        body.classList.add("bg-dark");
        body.classList.remove("bg-body-tertiary");
        // Cambia l'icona in Luna
        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
    } else {
        html.removeAttribute("data-bs-theme");
        body.classList.add("bg-body-tertiary");
        body.classList.remove("bg-dark");
        // Cambia l'icona in Sole
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
    }

    localStorage.setItem(THEME_KEY, theme);
}

// Inverte il tema corrente tra modalità chiara e scura.
/**
 * @returns {void}
 */
function toggleTheme() {
    // Alterna tra light e dark senza perdere la preferenza memorizzata.
    const current = localStorage.getItem(THEME_KEY) || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
}

// Mostra la barra di ricerca globale quando l'utente entra nella vista lista.
/**
 * @returns {void}
 */
function showSearchBar() {
    // La barra di ricerca globale si mostra solo quando si entra nella vista lista.
    searchBar.classList.remove("d-none");
    globalSearchInput.focus();
}

// Nasconde la barra di ricerca globale e azzera la query attiva.
/**
 * @returns {void}
 */
function hideSearchBar() {
    // Tornando al form, la ricerca viene azzerata per evitare filtri residui.
    searchBar.classList.add("d-none");
    searchState.searchQuery = "";
    globalSearchInput.value = "";
}

// Aggiorna la query di ricerca globale e rilancia il filtro.
/**
 * @param {InputEvent} event
 * @returns {void}
 */
function handleGlobalSearch(event) {
    // Ricerca testuale globale su nome, email, telefono ed età.
    searchState.searchQuery = String(event.target.value || "").trim().toLowerCase();
    searchState.currentPage = 1;
    applySearch();
}

// Filtra i contatti per nome, email, telefono ed età e aggiorna la paginazione.
/**
 * @returns {void}
 */
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
/**
 * @returns {void}
 */
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

        const avatar = contact.avatar ? `<img src="${contact.avatar}" alt="${contact.fullName}" class="rounded-circle mb-2" style="width:50px; height:50px; object-fit:cover;">` : `<div class="rounded-circle mb-2 d-inline-flex align-items-center justify-content-center" style="width:50px; height:50px; background:#0d6efd; color:white; font-weight:700;">${getPlaceholderInitial(contact.fullName)}</div>`;

        cardBody.innerHTML = `
            ${avatar}
            <h5 class="card-title mb-1">${contact.fullName}</h5>
            <p class="card-text small mb-2">
                <strong>Email:</strong> ${contact.email}<br>
                <strong>Telefono:</strong> ${contact.phoneInternational}
                ${contact.age ? `<br><strong>Età:</strong> ${contact.age} anni` : ""}
                ${contact.createdBy ? `<br><strong>Inserito da:</strong> ${contact.createdBy}` : ""}
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
/**
 * @param {number} totalPages
 * @param {number} currentPage
 * @returns {void}
 */
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

