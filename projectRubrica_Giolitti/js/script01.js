/**
 * script01.js - Main application orchestrator
 * Imports modular components and coordinates between them
 */

import { normalizeEmail, normalizeCountryCode, normalizeLocalPhone, buildInternationalPhone, getPlaceholderInitial, resolveAvatarSource, isDuplicateContact, normalizeTags } from "./contact-utils.js";

// Data management
import { appData, sessionState, updateSessionState, loadAppData, saveAppData, loadSessionState, getActiveUser, seedAdminIfNeeded, isCurrentUserAdmin } from "./data-manager.js";

// Authentication
import { handleAuthSubmit, handleLogout, handleChangePassword, handleDeleteAccount } from "./auth-manager.js";

// Country/Phone handling
import { populateCountryCodeOptions, handleCountrySelection, setCountryDialCode, getCountryOptionBySelection, handleCountryTypeSearch, selectedCountry as getSelectedCountry } from "./country-selector.js";

// Contact management
import { state as contactState, setEditMode, resetFormMode, handleListActions, saveContacts, syncStateFromUser, handleSubmitContact } from "./contact-manager.js";

// Search/Filter
import { searchState, handleGlobalSearch, updateAllTags, applySearch, renderTagFilters, resetSearch as resetSearchState } from "./search-filter.js";

// UI Rendering
import { renderAuthHint, renderWorkspaceBar, showAppView, showAuthView, showFormView, showListView, showSearchBar, hideSearchBar, renderContactsPage, renderPagination, showAlert, updateAvatarPreviewText } from "./ui-renderer.js";

// Import/Export
import { handleExport, handleImportClick, handleImportFileChange } from "./import-export.js";

// Theme
import { initTheme, toggleTheme } from "./theme-manager.js";

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

// ============================================================================
// DOM References
// ============================================================================
const authView = document.querySelector("#authView");
const authForm = document.querySelector("#authForm");
const authUsernameInput = document.querySelector("#authUsername");
const authPasswordInput = document.querySelector("#authPassword");
const authHint = document.querySelector("#authHint");
const appShell = document.querySelector("#appShell");
const activeUserLabel = document.querySelector("#activeUserLabel");
const logoutBtn = document.querySelector("#logoutBtn");
const alertBox = document.querySelector("#alertBox");
const formView = document.querySelector("#formView");
const listView = document.querySelector("#listView");
const showFormBtn = document.querySelector("#showFormBtn");
const showListBtn = document.querySelector("#showListBtn");
const formTitle = document.querySelector("#formTitle");
const submitBtn = document.querySelector("#submitBtn");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const contactForm = document.querySelector("#contactForm");
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
const accountNewPassword = document.querySelector("#accountNewPassword");
const accountConfirmPassword = document.querySelector("#accountConfirmPassword");
const changePasswordBtn = document.querySelector("#changePasswordBtn");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
const favoriteFilterBtn = document.querySelector("#favoriteFilterBtn");
const exportBookBtn = document.querySelector("#exportBookBtn");
const importBookBtn = document.querySelector("#importBookBtn");
const importFileInput = document.querySelector("#importFileInput");
const tagFilterContainer = document.querySelector("#tagFilterContainer");

// ============================================================================
// Callback Functions (Adapters between modules and DOM)
// ============================================================================

function syncState() {
    syncStateFromUser();
}

function renderWorkspace() {
    const user = getActiveUser();
    renderWorkspaceBar(activeUserLabel, accountSettingsBtn, logoutBtn, user, isCurrentUserAdmin());
}

function prepareFormForEdit(contact) {
    formTitle.textContent = "Modifica Contatto";
    submitBtn.textContent = "Salva Modifica";
    cancelEditBtn.classList.remove("d-none");

    document.getElementById("fullName").value = contact.fullName;
    setCountryDialCode(contact.countryCode, contact.countryIso || "", countryCodeSelect, countryDropdownBtn, countryIsoInput);
    document.getElementById("phoneLocal").value = contact.phoneLocal;
    document.getElementById("email").value = contact.email;
    document.getElementById("age").value = contact.age || "";
    document.getElementById("avatarUrl").value = contact.avatarMode === "url" ? contact.avatar : "";
    document.getElementById("avatarFile").value = "";
    document.getElementById("tags").value = (contact.tags || []).join(", ");
    updateAvatarPreviewText(avatarPreview, null, contact.avatar, contact.avatarMode, contact.avatar);
}

function resetForm() {
    formTitle.textContent = "Nuovo Contatto";
    submitBtn.textContent = "Salva Contatto";
    cancelEditBtn.classList.add("d-none");
    contactForm.reset();
    setCountryDialCode("+39", "it", countryCodeSelect, countryDropdownBtn, countryIsoInput);
    document.getElementById("tags").value = "";
    updateAvatarPreviewText(avatarPreview, null, "", "placeholder", "");
}

function handleEditContact(contact) {
    setEditMode(contact, prepareFormForEdit, () => showFormView(formView, listView, showFormBtn, showListBtn));
}

function handleDeleteContact(contact) {
    const confirmed = window.confirm(`Eliminare il contatto ${contact.fullName}?`);
    if (!confirmed) {
        return;
    }

    contactState.contacts = contactState.contacts.filter((entry) => entry.id !== contact.id);
    saveContacts();
    searchState.currentPage = 1;
    applySearchAndRender();
    showAlert(alertBox, "Contatto eliminato.", "success");

    if (contactState.editingContactId === contact.id) {
        resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn));
    }
}

function handleToggleFavorite(contact) {
    contact.isFavorite = !contact.isFavorite;
    saveContacts();
    applySearchAndRender();
    showAlert(alertBox, contact.isFavorite ? "Aggiunto ai preferiti." : "Rimosso dai preferiti.", "success");
}

function applySearchAndRender() {
    console.log("applySearchAndRender called, contactState.contacts:", contactState.contacts.length);
    applySearch(contactState.contacts);
    console.log("After applySearch, searchState.filteredContacts:", searchState.filteredContacts.length);
    updateAllTags(contactState.contacts);
    renderTagFilters(tagFilterContainer, applySearchAndRender);
    renderContactsPageHelper();
}

function renderContactsPageHelper() {
    renderContactsPage(
        contactsGrid,
        noContactsMsg,
        paginationNav,
        paginationList,
        handleEditContact,
        handleDeleteContact,
        handleToggleFavorite,
        (totalPages) => {
            renderPagination(paginationList, totalPages, searchState.currentPage, (newPage) => {
                searchState.currentPage = newPage;
                renderContactsPageHelper();
            });
        }
    );
}

function saveContact(contactPayload, isEdit) {
    console.log("saveContact called:", { contactPayload, isEdit, contactsCount: contactState.contacts.length });
    if (isEdit) {
        contactState.contacts = contactState.contacts.map((entry) =>
            entry.id === contactState.editingContactId ? contactPayload : entry
        );
        showAlert(alertBox, "Contatto modificato con successo.", "success");
    } else {
        contactState.contacts.push(contactPayload);
        showAlert(alertBox, "Contatto salvato con successo.", "success");
    }

    console.log("After push/update:", { contactsCount: contactState.contacts.length });
    saveContacts();
    resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn));
    searchState.currentPage = 1;
    searchState.searchQuery = "";
    searchState.filteredContacts = [...contactState.contacts];
    console.log("Before showListView:", { filteredCount: searchState.filteredContacts.length });
    showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput));
    applySearchAndRender();
    console.log("After applySearchAndRender");
}

// ============================================================================
// Event Handlers
// ============================================================================

function handleAuthSubmitWrapper(event) {
    handleAuthSubmit(
        event,
        syncState,
        renderWorkspace,
        () => showAppView(authView, appShell),
        () => {
            showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput));
            applySearchAndRender();
        },
        (msg, type) => renderAuthHint(authHint, msg, type),
        (msg, type) => showAlert(alertBox, msg, type)
    );
}

function handleLogoutWrapper() {
    handleLogout(
        saveContacts,
        renderWorkspace,
        () => showAuthView(authView, appShell, authUsernameInput),
        (msg, type) => renderAuthHint(authHint, msg, type),
        () => {
            contactState.contacts = [];
            contactState.editingContactId = null;
            searchState.searchQuery = "";
            searchState.currentPage = 1;
            searchState.filteredContacts = [];
            globalSearchInput.value = "";
        }
    );
}

function handleChangePasswordWrapper() {
    handleChangePassword(
        accountNewPassword.value,
        accountConfirmPassword.value,
        (msg, type) => showAlert(alertBox, msg, type),
        () => {
            accountNewPassword.value = "";
            accountConfirmPassword.value = "";
            const modalInstance = bootstrap.Modal.getInstance(accountModal);
            if (modalInstance) modalInstance.hide();
        }
    );
}

function handleDeleteAccountWrapper() {
    handleDeleteAccount(
        (msg, type) => showAlert(alertBox, msg, type),
        handleLogoutWrapper,
        () => {
            const modalInstance = bootstrap.Modal.getInstance(accountModal);
            if (modalInstance) modalInstance.hide();
        }
    );
}

async function handleSubmitWrapper(event) {
    const formData = new FormData(contactForm);
    const tagsInput = String(formData.get("tags") || "").trim();

    await handleSubmitContact(
        formData,
        { selectedCountry: getSelectedCountry },
        avatarFileInput.files?.[0] || null,
        avatarUrlInput.value,
        tagsInput,
        (msg, type) => showAlert(alertBox, msg, type),
        saveContact
    );
}

function handleListActionsWrapper(event) {
    handleListActions(event, handleEditContact, handleDeleteContact, handleToggleFavorite);
}

function handleGlobalSearchWrapper(event) {
    handleGlobalSearch(event, applySearchAndRender);
}

function handleImportWrapper(normalized, contactsLength) {
    const user = getActiveUser();
    if (user) {
        user.contacts = normalized;
        contactState.contacts = [...normalized];
        saveContacts();
        searchState.currentPage = 1;
        searchState.searchQuery = "";
        globalSearchInput.value = "";
        applySearchAndRender();
        showAlert(alertBox, `${contactsLength} contatti importati con successo.`, "success");
    }
}

// ============================================================================
// Initialization
// ============================================================================

function bootstrapApp() {
    Object.assign(appData, loadAppData());
    seedAdminIfNeeded();
    Object.assign(sessionState, loadSessionState());

    const activeUser = getActiveUser();
    if (sessionState.userId && activeUser) {
        syncState();
        renderWorkspace();
        showAppView(authView, appShell);
        showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput));
        applySearchAndRender();
        return;
    }

    renderWorkspace();
    showAuthView(authView, appShell, authUsernameInput);
    renderAuthHint(authHint, "Crea un account per iniziare oppure accedi a uno già esistente.", "secondary");
}

// ============================================================================
// Event Listener Setup
// ============================================================================

authForm.addEventListener("submit", handleAuthSubmitWrapper);
accountSettingsBtn.addEventListener("click", () => {
    const modal = new bootstrap.Modal(accountModal);
    modal.show();
});
changePasswordBtn.addEventListener("click", handleChangePasswordWrapper);
deleteAccountBtn.addEventListener("click", handleDeleteAccountWrapper);
logoutBtn.addEventListener("click", handleLogoutWrapper);
contactForm.addEventListener("submit", handleSubmitWrapper);
showFormBtn.addEventListener("click", () => showFormView(formView, listView, showFormBtn, showListBtn));
showListBtn.addEventListener("click", () => showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput)));
cancelEditBtn.addEventListener("click", () => resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn)));
contactsGrid.addEventListener("click", handleListActionsWrapper);
avatarFileInput.addEventListener("change", () => updateAvatarPreviewText(avatarPreview, avatarFileInput.files?.[0], avatarUrlInput.value));
avatarUrlInput.addEventListener("input", () => updateAvatarPreviewText(avatarPreview, avatarFileInput.files?.[0], avatarUrlInput.value));
countryDropdownList.addEventListener("click", (e) => handleCountrySelection(e, countryCodeSelect, countryDropdownBtn));
countryDropdownList.addEventListener("keydown", (e) => handleCountryTypeSearch(e, countryDropdownOptions));
countryDropdownBtn.addEventListener("shown.bs.dropdown", () => {
    countryDropdownList.focus();
});

themeTglBtn.addEventListener("click", () => toggleTheme(themeIcon));
globalSearchInput.addEventListener("input", handleGlobalSearchWrapper);
showListBtn.addEventListener("click", () => showSearchBar(searchBar, globalSearchInput));
showFormBtn.addEventListener("click", () => hideSearchBar(searchBar));
favoriteFilterBtn?.addEventListener("click", () => {
    searchState.showFavoritesOnly = !searchState.showFavoritesOnly;
    favoriteFilterBtn.classList.toggle("btn-primary");
    favoriteFilterBtn.classList.toggle("btn-outline-primary");
    searchState.currentPage = 1;
    applySearchAndRender();
});
exportBookBtn?.addEventListener("click", () => handleExport((msg, type) => showAlert(alertBox, msg, type)));
importBookBtn?.addEventListener("click", () => handleImportClick(importFileInput));
importFileInput?.addEventListener("change", (e) => handleImportFileChange(e, handleImportWrapper, (msg, type) => showAlert(alertBox, msg, type)));

populateCountryCodeOptions(countryCodeSelect, countryDropdownOptions, countryNoResults);
initTheme(themeIcon);
bootstrapApp();
updateAvatarPreviewText(avatarPreview, null, "");
