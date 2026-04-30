/**
 * contact-manager.js - Handles contact CRUD operations
 */

import {
    normalizeEmail,
    normalizeCountryCode,
    normalizeLocalPhone,
    buildInternationalPhone,
    getPlaceholderInitial,
    resolveAvatarSource,
    isDuplicateContact,
    normalizeTags
} from "./contact-utils.js";
import { getActiveUser, getVisibleContactsForCurrentUser, saveContactsForCurrentUser } from "./data-manager.js";

export const state = {
    contacts: [],
    editingContactId: null
};

/**
 * Carica i dati del contatto nel form per permettere la modifica.
 * @param {Contact} contact
 * @param {Function} populateFormCallback - Callback per popolare il form
 * @param {Function} showFormViewCallback - Callback per mostrare il form
 * @returns {void}
 */
export function setEditMode(contact, populateFormCallback, showFormViewCallback) {
    state.editingContactId = contact.id;
    populateFormCallback(contact);
    showFormViewCallback();
}

/**
 * Riporta il form alla modalità creazione e ripulisce lo stato di editing.
 * @param {Function} resetFormCallback - Callback per resettare il form
 * @param {Function} showFormViewCallback - Callback per mostrare il form
 * @returns {void}
 */
export function resetFormMode(resetFormCallback, showFormViewCallback) {
    state.editingContactId = null;
    resetFormCallback();
    showFormViewCallback();
}

/**
 * Valida, normalizza e salva un contatto nuovo o modificato.
 * @param {FormData} formData
 * @param {Object} countryInfo - {selectedCountry, countryIso}
 * @param {File|null} avatarFile
 * @param {string} avatarUrl
 * @param {string} tagsInput
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @param {Function} saveCallback - Callback (contactPayload, isEdit) =>void
 * @returns {Promise<void>}
 */
export async function handleSubmitContact(
    formData,
    countryInfo,
    avatarFile,
    avatarUrl,
    tagsInput,
    showAlertCallback,
    saveCallback
) {
    const fullName = String(formData.get("fullName") || "").trim();
    const countryCode = String(formData.get("countryCode") || "").trim();
    const countryIso = String(formData.get("countryIso") || "").trim().toLowerCase();
    const phoneLocal = String(formData.get("phoneLocal") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const age = formData.get("age") ? parseInt(String(formData.get("age")).trim()) : null;
    const normalizedAvatarUrl = String(avatarUrl || "").trim();
    const tags = normalizeTags(tagsInput.split(","));

    if (!fullName || !countryCode || !phoneLocal || !email) {
        showAlertCallback("Compila tutti i campi obbligatori.", "warning");
        return;
    }

    const normalizedCountryCode = normalizeCountryCode(countryCode);
    const normalizedLocalPhone = normalizeLocalPhone(phoneLocal);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedCountryCode || !normalizedLocalPhone || !normalizedEmail) {
        showAlertCallback("Dati non validi: controlla telefono, prefisso ed email.", "warning");
        return;
    }

    const candidate = {
        countryCode: normalizedCountryCode,
        phoneLocal: normalizedLocalPhone,
        email: normalizedEmail
    };

    if (isDuplicateContact(state.contacts, candidate, { ignoreId: state.editingContactId })) {
        showAlertCallback("Contatto gia presente: email o telefono duplicati.", "danger");
        return;
    }

    let avatarBase64 = "";
    if (avatarFile) {
        try {
            avatarBase64 = await readFileAsDataUrl(avatarFile);
        } catch (error) {
            showAlertCallback(error.message, "danger");
            return;
        }
    }

    let existingAvatarBase64 = "";
    if (state.editingContactId && !avatarFile && !normalizedAvatarUrl) {
        const existingContact = state.contacts.find((entry) => entry.id === state.editingContactId);
        if (existingContact?.avatarMode === "file") {
            existingAvatarBase64 = existingContact.avatar;
        }
    }

    const avatar = resolveAvatarSource({
        avatarUrl: normalizedAvatarUrl,
        avatarBase64: avatarBase64 || existingAvatarBase64,
        fullName
    });

    const contactPayload = {
        id: state.editingContactId || crypto.randomUUID(),
        fullName,
        countryCode: normalizedCountryCode,
        countryIso: countryIso || countryInfo?.selectedCountry?.code || "",
        countryName: countryInfo?.selectedCountry?.name || "",
        phoneLocal: normalizedLocalPhone,
        phoneInternational: buildInternationalPhone(normalizedCountryCode, normalizedLocalPhone),
        email: normalizedEmail,
        age,
        avatar: avatar.avatar,
        avatarMode: avatar.avatarMode,
        placeholderInitial: avatar.placeholderInitial,
        createdBy: state.editingContactId
            ? (state.contacts.find((c) => c.id === state.editingContactId)?.createdBy || getActiveUser()?.username || "")
            : (getActiveUser()?.username || ""),
        isFavorite: state.editingContactId
            ? (state.contacts.find((c) => c.id === state.editingContactId)?.isFavorite || false)
            : false,
        tags
    };

    const isEdit = Boolean(state.editingContactId);
    saveCallback(contactPayload, isEdit);
}

/**
 * Converte un file immagine in base64.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Errore durante la lettura del file avatar."));
        reader.readAsDataURL(file);
    });
}

/**
 * Gestisce modifica, eliminazione e toggle favorite tramite event delegation.
 * @param {MouseEvent} event
 * @param {Function} editCallback - Callback(contact) per entrare in edit mode
 * @param {Function} deleteCallback - Callback(contact) per eliminare
 * @param {Function} toggleFavoriteCallback - Callback(contact) per toggle preferiti
 * @returns {void}
 */
export function handleListActions(event, editCallback, deleteCallback, toggleFavoriteCallback) {
    const target = event.target.closest("button[data-action]");
    if (!target) {
        return;
    }

    const contact = state.contacts.find((entry) => entry.id === target.dataset.id);
    if (!contact) {
        return;
    }

    if (target.dataset.action === "edit") {
        editCallback(contact);
        return;
    }

    if (target.dataset.action === "toggle-favorite") {
        toggleFavoriteCallback(contact);
        return;
    }

    if (target.dataset.action === "delete") {
        deleteCallback(contact);
    }
}

/**
 * Salva i contatti dell'utente attivo.
 * @returns {void}
 */
export function saveContacts() {
    saveContactsForCurrentUser(state.contacts);
}

/**
 * Sincronizza lo stato locale con i contatti dell'utente attivo.
 * @param {Function} updateTagsCallback - Callback per aggiornare i tag
 * @returns {void}
 */
export function syncStateFromUser(updateTagsCallback) {
    state.contacts = getVisibleContactsForCurrentUser();
    state.editingContactId = null;
    updateTagsCallback?.();
}
