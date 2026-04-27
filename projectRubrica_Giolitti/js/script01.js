import {
    buildInternationalPhone, getPlaceholderInitial, isDuplicateContact, normalizeCountryCode, normalizeEmail, normalizeLocalPhone, resolveAvatarSource
} from "./contact-utils.js";
import { countries } from "https://cdn.jsdelivr.net/npm/country-codes-flags-phone-codes@1.1.1/dist/index.mjs";

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
const contactsList = document.getElementById("contactsList");
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
const countryDropdownBtn = document.getElementById("countryDropdownBtn");
const countryDropdownList = document.getElementById("countryDropdownList");
const countryDropdownOptions = document.getElementById("countryDropdownOptions");
const countryNoResults = document.getElementById("countryNoResults");
const countrySearchInput = document.getElementById("countrySearchInput");
const countryByDialCode = new Map();
const countryOptions = [];

const themeTglBtn = document.getElementById("themeTglBtn");
const themeIcon = document.getElementById("themeIcon");
const searchBar = document.getElementById("searchBar");
const globalSearchInput = document.getElementById("globalSearchInput");
const contactsGrid = document.getElementById("contactsGrid");
const noContactsMsg = document.getElementById("noContactsMsg");
const paginationNav = document.getElementById("paginationNav");
const paginationList = document.getElementById("paginationList");

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
    setCountryDialCode("+39");
}

function renderCountryOptions(options) {
    countryDropdownOptions.innerHTML = "";

    options.forEach((optionData) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dropdown-item country-dropdown-item";
        button.dataset.dialCode = optionData.dialCode;
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

function handleCountrySearch() {
    const query = countrySearchInput.value.trim().toLowerCase();

    if (!query) {
        renderCountryOptions(countryOptions);
        return;
    }

    const filtered = countryOptions.filter((optionData) => optionData.searchable.includes(query));
    renderCountryOptions(filtered);
}

function handleCountrySelection(event) {
    const button = event.target.closest("button[data-dial-code]");
    if (!button) {
        return;
    }

    setCountryDialCode(button.dataset.dialCode);
    resetCountrySearch();
}

function resetCountrySearch() {
    countrySearchInput.value = "";
    renderCountryOptions(countryOptions);
}

function setCountryDialCode(dialCode) {
    const country = countryByDialCode.get(dialCode);
    countryCodeSelect.value = dialCode;

    if (!country) {
        countryDropdownBtn.textContent = `Prefisso ${dialCode}`;
        return;
    }

    const iso2 = String(country.code || "").trim().toLowerCase();
    countryDropdownBtn.replaceChildren();

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.alt = "";
    flag.src = getFlagIconPath(iso2);
    flag.addEventListener("error", () => {
        flag.replaceWith(document.createTextNode(getCountryFlagEmoji(country.flag, country.code)));
    });

    countryDropdownBtn.append(flag, document.createTextNode(` ${country.name} (${dialCode})`));
}

function getFlagIconPath(iso2LowerCase) {
    return `./node_modules/flag-icons/flags/4x3/${iso2LowerCase}.svg`;
}


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

function loadContacts() {
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

            return {
                id: entry.id || crypto.randomUUID(),
                fullName,
                countryCode,
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

function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.contacts));
}

function showAlert(message, type = "info") {
    alertBox.innerHTML = `
		<div class="alert alert-${type} alert-dismissible fade show" role="alert">
			${message}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;
}

function renderContacts() {
    contactsList.innerHTML = "";

    if (state.contacts.length === 0) {
        contactsList.innerHTML = '<div class="text-body-secondary">Nessun contatto registrato.</div>';
        return;
    }

    state.contacts.forEach((contact) => {
        const item = document.createElement("article");
        item.className = "list-group-item py-3";

        const infoCol = document.createElement("div");
        infoCol.className = "clearfix";

        if (contact.avatar) {
            const img = document.createElement("img");
            img.src = contact.avatar;
            img.alt = `Avatar ${contact.fullName}`;
            img.className = "avatar rounded-circle float-start me-3 mb-2";
            infoCol.appendChild(img);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "avatar-placeholder rounded-circle float-start me-3 mb-2";
            placeholder.setAttribute("aria-hidden", "true");
            placeholder.textContent = contact.placeholderInitial || getPlaceholderInitial(contact.fullName);
            infoCol.appendChild(placeholder);
        }

        const textWrap = document.createElement("div");
        textWrap.innerHTML = `
			<div class="fw-semibold"></div>
			<div class="small text-body-secondary"></div>
			<div class="small text-body-secondary"></div>
		`;
        textWrap.children[0].textContent = contact.fullName;
        textWrap.children[1].textContent = `Telefono: ${contact.phoneInternational}`;
        textWrap.children[2].textContent = `Email: ${contact.email}`;
        infoCol.appendChild(textWrap);

        const actionWrap = document.createElement("div");
        actionWrap.className = "mt-3";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-sm btn-outline-primary me-2";
        editBtn.dataset.action = "edit";
        editBtn.dataset.id = contact.id;
        editBtn.textContent = "Modifica";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger";
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = contact.id;
        deleteBtn.textContent = "Elimina";

        actionWrap.append(editBtn, deleteBtn);
        item.append(infoCol, actionWrap);
        contactsList.appendChild(item);
    });
}

function showFormView() {
    formView.classList.remove("d-none");
    listView.classList.add("d-none");
}

function showListView() {
    listView.classList.remove("d-none");
    formView.classList.add("d-none");
    searchState.currentPage = 1;
    applySearch();
}

function setEditMode(contact) {
    state.editingContactId = contact.id;
    formTitle.textContent = "Modifica Contatto";
    submitBtn.textContent = "Salva Modifica";
    cancelEditBtn.classList.remove("d-none");

    document.getElementById("fullName").value = contact.fullName;
    setCountryDialCode(contact.countryCode);
    document.getElementById("phoneLocal").value = contact.phoneLocal;
    document.getElementById("email").value = contact.email;
    document.getElementById("age").value = contact.age || "";
    document.getElementById("avatarUrl").value = contact.avatarMode === "url" ? contact.avatar : "";
    document.getElementById("avatarFile").value = "";
    updateAvatarPreviewText(contact.avatarMode, contact.avatar);
    showFormView();
}

function resetFormMode() {
    state.editingContactId = null;
    formTitle.textContent = "Nuovo Contatto";
    submitBtn.textContent = "Salva Contatto";
    cancelEditBtn.classList.add("d-none");
    contactForm.reset();
    setCountryDialCode("+39");
    updateAvatarPreviewText();
    showFormView();
}

function handleListActions(event) {
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

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Errore durante la lettura del file avatar."));
        reader.readAsDataURL(file);
    });
}

function updateAvatarPreviewText(modeOverride, valueOverride) {
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

async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const fullName = String(formData.get("fullName") || "").trim();
    const countryCode = String(formData.get("countryCode") || "").trim();
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

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved);
}

function applyTheme(theme) {
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

function toggleTheme() {
    const current = localStorage.getItem(THEME_KEY) || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
}

function showSearchBar() {
    searchBar.classList.remove("d-none");
    globalSearchInput.focus();
}

function hideSearchBar() {
    searchBar.classList.add("d-none");
    searchState.searchQuery = "";
    globalSearchInput.value = "";
}

function handleGlobalSearch(event) {
    searchState.searchQuery = String(event.target.value || "").trim().toLowerCase();
    searchState.currentPage = 1;
    applySearch();
}

function applySearch() {
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

function renderContactsPage() {
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

function renderPagination(totalPages, currentPage) {
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
