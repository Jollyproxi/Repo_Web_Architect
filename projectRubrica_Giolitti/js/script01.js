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

// ============================================================================
// Callback Functions (Adapters between modules and DOM)
// ============================================================================

import {
    syncState,
    renderWorkspace,
    prepareFormForEdit,
    resetForm,
    handleEditContact,
    handleDeleteContact,
    handleToggleFavorite,
    applySearchAndRender,
    renderContactsPageHelper,
    saveContact,
    handleAuthSubmitWrapper,
    handleLogoutWrapper,
    handleChangePasswordWrapper,
    handleDeleteAccountWrapper,
    handleSubmitWrapper,
    handleListActionsWrapper,
    handleGlobalSearchWrapper,
    handleImportWrapper,
    openContactModalById,
    handleUndoDelete
} from "./app-logic.js";

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
const contactModal = document.querySelector("#contactModal");
const contactModalAvatar = document.querySelector("#contactModalAvatar");
const contactModalName = document.querySelector("#contactModalName");
const contactModalEmail = document.querySelector("#contactModalEmail");
const contactModalPhone = document.querySelector("#contactModalPhone");
const contactModalAge = document.querySelector("#contactModalAge");
const contactModalTags = document.querySelector("#contactModalTags");
const contactModalCreatedBy = document.querySelector("#contactModalCreatedBy");
const contactModalEditBtn = document.querySelector("#contactModalEditBtn");
const contactModalDeleteBtn = document.querySelector("#contactModalDeleteBtn");
const undoToastEl = document.querySelector("#undoToast");
const undoToastBtn = document.querySelector("#undoToastBtn");



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
// Apri modal dettaglio quando si clicca la card (escludendo i bottoni)
contactsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (btn) return; // lascia gestire i bottoni
    const card = e.target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;
    openContactModalById(id);
});
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

populateCountryCodeOptions(countryCodeSelect, countryDropdownOptions, countryDropdownBtn, countryNoResults);
initTheme(themeIcon);
bootstrapApp();
updateAvatarPreviewText(avatarPreview, null, "");

// Toast undo listener
undoToastBtn?.addEventListener("click", () => {
    handleUndoDelete();
    try {
        const t = bootstrap.Toast.getInstance(undoToastEl);
        if (t) t.hide();
    } catch (e) {}
});

// Quando il toast viene nascosto (scaduto o chiuso), rimuoviamo la copia temporanea
undoToastEl?.addEventListener("hidden.bs.toast", () => {
    try {
        sessionStorage.removeItem("lastDeleted");
    } catch (e) {}
});

// Modal edit/delete buttons
contactModalEditBtn?.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const c = contactState.contacts.find((x) => x.id === id);
    if (c) {
        const modalInstance = bootstrap.Modal.getInstance(contactModal);
        if (modalInstance) modalInstance.hide();
        handleEditContact(c);
    }
});

contactModalDeleteBtn?.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const c = contactState.contacts.find((x) => x.id === id);
    const modalInstance = bootstrap.Modal.getInstance(contactModal);
    if (modalInstance) modalInstance.hide();
    if (c) handleDeleteContact(c);
});
