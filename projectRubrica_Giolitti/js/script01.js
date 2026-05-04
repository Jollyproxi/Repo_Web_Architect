/**
 * script01.js - Main application orchestrator
 * Imports modular components and coordinates between them
 */

// Data management
import {
    appData,
    sessionState,
    loadAppData,
    loadSessionState,
    getActiveUser,
    seedAdminIfNeeded
} from "./data-manager.js";

// Country/Phone handling
import {
    populateCountryCodeOptions,
    handleCountrySelection,
    handleCountryTypeSearch
} from "./country-selector.js";

// Contact management
import { state as contactState,
    resetFormMode,
    syncStateFromUser
} from "./contact-manager.js";

// Search/Filter
import {
    searchState
} from "./search-filter.js";

// UI Rendering
import { renderAuthHint,
    showAppView,
    showAuthView,
    showFormView,
    showListView,
    showSearchBar,
    hideSearchBar,
    showAlert,
    updateAvatarPreviewText
} from "./ui-renderer.js";

// Import/Export
import {
    handleExport,
    handleImportClick,
    handleImportFileChange
} from "./import-export.js";

// Theme
import {
    initTheme,
    toggleTheme
} from "./theme-manager.js";

// DOM refs (centralizzati)
import {
    getDomRefs
} from "./dom-refs.js";

// ============================================================================
// Callback Functions (Adapters between modules and DOM)
// ============================================================================

import {
    renderWorkspace,
    resetForm,
    handleEditContact,
    handleDeleteContact,
    applySearchAndRender,
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

/**
 * DOM refs centralized in dom-refs.js
 * Per evitare ogni volta di fare getDomRefs().qualcosa e per accedere agli elementi, estraiamo direttamente le refs in costanti locali.
 */
const {
    authView,
    authForm,
    authUsernameInput,
    authHint,
    appShell,
    logoutBtn,
    alertBox,
    formView,
    listView,
    showFormBtn,
    showListBtn,
    cancelEditBtn,
    contactForm,
    avatarPreview,
    avatarFileInput,
    avatarUrlInput,
    countryCodeSelect,
    countryDropdownBtn,
    countryDropdownList,
    countryDropdownOptions,
    countryNoResults,
    themeTglBtn,
    themeIcon,
    searchBar,
    globalSearchInput,
    contactsGrid,
    accountSettingsBtn,
    accountModal,
    changePasswordBtn,
    deleteAccountBtn,
    favoriteFilterBtn,
    exportBookBtn,
    importBookBtn,
    importFileInput,
    contactModal,
    contactModalEditBtn,
    contactModalDeleteBtn,
    undoToastEl,
    undoToastBtn
} = getDomRefs();


// ============================================================================
// Initialization
// ============================================================================

function bootstrapApp() {
    Object.assign(appData, loadAppData());
    seedAdminIfNeeded();
    Object.assign(sessionState, loadSessionState());

    const activeUser = getActiveUser();
    if (sessionState.userId && activeUser) {
        syncStateFromUser();
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
    //uso la classe Modal di bootstrap per i setting
    const modal = new bootstrap.Modal(accountModal);
    modal.show();
});
changePasswordBtn.addEventListener("click", handleChangePasswordWrapper);
deleteAccountBtn.addEventListener("click", handleDeleteAccountWrapper);
logoutBtn.addEventListener("click", handleLogoutWrapper);
contactForm.addEventListener("submit", handleSubmitWrapper);
showFormBtn.addEventListener("click", () => {
    showFormView(formView, listView, showFormBtn, showListBtn);
    hideSearchBar(searchBar);
});
showListBtn.addEventListener("click", () => showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput)));
cancelEditBtn.addEventListener("click", () => resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn)));
contactsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (btn) {
        handleListActionsWrapper(e);
        return;
    }

    // Apri il modal dettaglio quando si clicca la card.
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
// Listener filtro preferiti: `?.` evita errori se il bottone non e' presente nella vista.
favoriteFilterBtn?.addEventListener("click", () => {
    searchState.showFavoritesOnly = !searchState.showFavoritesOnly;
    favoriteFilterBtn.classList.toggle("btn-primary");
    favoriteFilterBtn.classList.toggle("btn-outline-primary");
    searchState.currentPage = 1;
    applySearchAndRender();
});
exportBookBtn?.addEventListener("click", () => handleExport((msg, type) => showAlert(alertBox, msg, type)));
importBookBtn?.addEventListener("click", () => {
    if (!importFileInput) return;
    handleImportClick(importFileInput);
});
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
