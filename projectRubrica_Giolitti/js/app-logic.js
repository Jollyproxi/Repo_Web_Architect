/**
 * app-logic.js - Application logic moved out of script01.js
 * Exports functions used by the orchestrator.
 */
import { getPlaceholderInitial } from "./contact-utils.js";
import { getActiveUser, isCurrentUserAdmin } from "./data-manager.js";
import { handleAuthSubmit, handleLogout, handleChangePassword, handleDeleteAccount } from "./auth-manager.js";
import { selectedCountry as getSelectedCountry, setCountryDialCode } from "./country-selector.js";
import { state as contactState, setEditMode, resetFormMode, handleListActions, saveContacts, syncStateFromUser } from "./contact-manager.js";
import { searchState, handleGlobalSearch, updateAllTags, applySearch, renderTagFilters, resetSearchState } from "./search-filter.js";
import { renderWorkspaceBar, showAppView, showAuthView, showFormView, showListView, showSearchBar, renderContactsPage, renderPagination, showAlert, updateAvatarPreviewText, renderAuthHint } from "./ui-renderer.js";
import { handleSubmitContact } from "./contact-manager.js";
import { getDomRefs } from "./dom-refs.js";

// DOM refs centralized in dom-refs.js
const {
    alertBox,
    authForm,
    authHint,
    formView,
    listView,
    showFormBtn,
    showListBtn,
    formTitle,
    submitBtn,
    cancelEditBtn,
    contactForm,
    avatarPreview,
    avatarFileInput,
    avatarUrlInput,
    countryCodeSelect,
    countryIsoInput,
    countryDropdownBtn,
    globalSearchInput,
    contactsGrid,
    noContactsMsg,
    paginationNav,
    paginationList,
    tagFilterContainer,
    contactModal,
    contactModalAvatar,
    contactModalName,
    contactModalEmail,
    contactModalPhone,
    contactModalAge,
    contactModalTags,
    contactModalCreatedBy,
    contactModalEditBtn,
    contactModalDeleteBtn,
    undoToastEl,
    authView,
    appShell,
    authUsernameInput,
    searchBar
} = getDomRefs();


export function renderWorkspace() {
    const activeUserLabel = document.querySelector('#activeUserLabel');
    const accountSettingsBtn = document.querySelector('#accountSettingsBtn');
    const logoutBtn = document.querySelector('#logoutBtn');
    const user = getActiveUser();
    renderWorkspaceBar(activeUserLabel, accountSettingsBtn, logoutBtn, user, isCurrentUserAdmin());
}

export function prepareFormForEdit(contact) {
    formTitle.textContent = "Modifica Contatto";
    submitBtn.textContent = "Salva Modifica";
    cancelEditBtn.classList.remove("d-none");

    document.querySelector("#fullName").value = contact.fullName;
    setCountryDialCode(contact.countryCode, contact.countryIso || "", countryCodeSelect, countryDropdownBtn, countryIsoInput);
    document.querySelector("#phoneLocal").value = contact.phoneLocal;
    document.querySelector("#email").value = contact.email;
    document.querySelector("#age").value = contact.age || "";
    document.querySelector("#avatarUrl").value = contact.avatarMode === "url" ? contact.avatar : "";
    document.querySelector("#avatarFile").value = "";
    document.querySelector("#tags").value = (contact.tags || []).join(", ");
    updateAvatarPreviewText(avatarPreview, null, contact.avatar, contact.avatarMode, contact.avatar);
}

export function resetForm() {
    formTitle.textContent = "Nuovo Contatto";
    submitBtn.textContent = "Salva Contatto";
    cancelEditBtn.classList.add("d-none");
    contactForm.reset();
    setCountryDialCode("+39", "it", countryCodeSelect, countryDropdownBtn, countryIsoInput);
    document.querySelector("#tags").value = "";
    updateAvatarPreviewText(avatarPreview, null, "", "placeholder", "");
}

export function handleEditContact(contact) {
    setEditMode(contact, prepareFormForEdit, () => showFormView(formView, listView, showFormBtn, showListBtn));
}

export function handleDeleteContact(contact) {
    const confirmed = window.confirm(`Eliminare il contatto ${contact.fullName}?`);
    if (!confirmed) return null;

    // rimuovi e salva copia temporanea in sessionStorage
    contactState.contacts = contactState.contacts.filter((entry) => entry.id !== contact.id);
    saveContacts();
    sessionStorage.setItem("lastDeleted", JSON.stringify(contact));

    // mostra toast con undo
    try {
        const toast = new bootstrap.Toast(undoToastEl, { delay: 5000 });
        toast.show();
    } catch (e) {
        // ignore
    }

    searchState.currentPage = 1;
    applySearchAndRender();
    showAlert(alertBox, "Contatto eliminato. Puoi annullare dall'alert.", "success");

    if (contactState.editingContactId === contact.id) {
        resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn));
    }

    return contact;
}

export function handleUndoDelete() {
    const raw = sessionStorage.getItem("lastDeleted");
    if (!raw) return false;
    const contact = JSON.parse(raw);
    // reinserisci in cima
    contactState.contacts.unshift(contact);
    saveContacts();
    sessionStorage.removeItem("lastDeleted");
    applySearchAndRender();
    showAlert(alertBox, "Eliminazione annullata.", "success");
    return true;
}


export function applySearchAndRender() {
    applySearch(contactState.contacts);
    updateAllTags(contactState.contacts);
    renderTagFilters(tagFilterContainer, applySearchAndRender);
    renderContactsPageHelper();
}

export function renderContactsPageHelper() {
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

export function handleToggleFavorite(contact) {
    contact.isFavorite = !contact.isFavorite;
    saveContacts();
    applySearchAndRender();
    showAlert(alertBox, contact.isFavorite ? "Aggiunto ai preferiti." : "Rimosso dai preferiti.", "success");
}

export function saveContact(contactPayload, isEdit) {
    if (isEdit) {
        contactState.contacts = contactState.contacts.map((entry) => (entry.id === contactState.editingContactId ? contactPayload : entry));
        showAlert(alertBox, "Contatto modificato con successo.", "success");
    } else {
        contactState.contacts.push(contactPayload);
        showAlert(alertBox, "Contatto salvato con successo.", "success");
    }

    saveContacts();
    resetFormMode(resetForm, () => showFormView(formView, listView, showFormBtn, showListBtn));
    resetSearchState({ contacts: contactState.contacts });
    showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput));
    applySearchAndRender();
}

export function handleAuthSubmitWrapper(event) {
    handleAuthSubmit(
        event,
        syncStateFromUser,
        () => renderWorkspace(),
        () => showAppView(authView, appShell),
        () => {
            showListView(formView, listView, showFormBtn, showListBtn, () => showSearchBar(searchBar, globalSearchInput));
            applySearchAndRender();
        },
        (msg, type) => renderAuthHint(authHint, msg, type),
        (msg, type) => showAlert(alertBox, msg, type),
        () => authForm?.reset()
    );
}

export function handleLogoutWrapper() {
    handleLogout(
        saveContacts,
        () => {},
        () => showAuthView(authView, appShell, authUsernameInput),
        (msg, type) => showAlert(alertBox, msg, type),
        () => {
            contactState.contacts = [];
            contactState.editingContactId = null;
            resetSearchState({ contacts: [] });
            if (globalSearchInput) globalSearchInput.value = "";
        }
    );
}

export function handleChangePasswordWrapper() {
    handleChangePassword(
        document.querySelector('#accountNewPassword').value,
        document.querySelector('#accountConfirmPassword').value,
        (msg, type) => showAlert(alertBox, msg, type),
        () => {
            document.querySelector('#accountNewPassword').value = "";
            document.querySelector('#accountConfirmPassword').value = "";
            const modalInstance = bootstrap.Modal.getInstance(document.querySelector('#accountModal'));
            if (modalInstance) modalInstance.hide();
        }
    );
}

export function handleDeleteAccountWrapper() {
    handleDeleteAccount(
        (msg, type) => showAlert(alertBox, msg, type),
        handleLogoutWrapper,
        () => {
            const modalInstance = bootstrap.Modal.getInstance(document.querySelector('#accountModal'));
            if (modalInstance) modalInstance.hide();
        }
    );
}

export async function handleSubmitWrapper(event) {
    event.preventDefault();
    event.stopPropagation();
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

export function handleListActionsWrapper(event) {
    handleListActions(event, handleEditContact, (c) => { handleDeleteContact(c); }, handleToggleFavorite);
}

export function handleGlobalSearchWrapper(event) {
    handleGlobalSearch(event, applySearchAndRender);
}

export function handleImportWrapper(normalized, contactsLength) {
    const user = getActiveUser();
    if (user) {
        user.contacts = normalized;
        contactState.contacts = [...normalized];
        saveContacts();
        searchState.currentPage = 1;
        searchState.searchQuery = "";
        if (globalSearchInput) globalSearchInput.value = "";
        applySearchAndRender();
        showAlert(alertBox, `${contactsLength} contatti importati con successo.`, "success");
    }
}

export function openContactModalById(contactId) {
    const contact = contactState.contacts.find((c) => c.id === contactId);
    if (!contact) return;

    function placeholderDataUrl(initial, size = 192, bg = '#0d6efd', fg = '#ffffff') {
        const fontSize = Math.round(size * 0.5);
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dy='0.35em' text-anchor='middle' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='${fontSize}' font-weight='700'>${initial}</text></svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    if (contact.avatar && contact.avatar.trim()) {
        contactModalAvatar.src = contact.avatar;
    } else {
        const initial = contact.placeholderInitial || getPlaceholderInitial(contact.fullName || "");
        contactModalAvatar.src = placeholderDataUrl(initial, 96);
    }
    contactModalName.textContent = contact.fullName || "-";
    contactModalEmail.textContent = contact.email || "-";
    contactModalPhone.textContent = contact.phoneInternational || "-";
    contactModalAge.textContent = contact.age ? `${contact.age} anni` : "-";
    contactModalTags.innerHTML = (contact.tags || []).map((t) => `<span class=\"badge bg-secondary me-1\">${t}</span>`).join("");
    contactModalCreatedBy.textContent = contact.createdBy || "-";

    contactModalEditBtn.dataset.id = contact.id;
    contactModalDeleteBtn.dataset.id = contact.id;

    const modal = new bootstrap.Modal(contactModal);
    modal.show();
}

export { renderContactsPage }; // re-export for use elsewhere if needed
