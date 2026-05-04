/**
 * auth-manager.js - Handles authentication, authorization, and account management
 */

import {
    appData,
    updateSessionState,
    saveAppData,
    normalizeAuthName,
    getActiveUser
} from "./data-manager.js";

/**
 * Gestisce accesso e creazione account.
 * @param {SubmitEvent} event
 * @param {Function} syncStateCallback - Callback per sincronizzare lo stato dell'app
 * @param {Function} renderWorkspaceCallback - Callback per rendere la workspace bar
 * @param {Function} showAppViewCallback - Callback per mostrare la vista app
 * @param {Function} showListViewCallback - Callback per mostrare la lista
 * @param {Function} renderAuthHintCallback - Callback per mostrare hint di auth
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @param {Function=} resetAuthFormCallback - Callback opzionale per svuotare il form auth
 * @returns {void}
 */
export function handleAuthSubmit(
    event,
    syncStateCallback,
    renderWorkspaceCallback,
    showAppViewCallback,
    showListViewCallback,
    renderAuthHintCallback,
    showAlertCallback,
    resetAuthFormCallback
) {
    event.preventDefault();

    const action = event.submitter?.dataset.action || "login";
    const username = normalizeAuthName(event.target.username.value);
    const password = String(event.target.password.value || "").trim();

    if (!username || !password) {
        renderAuthHintCallback("Inserisci nome utente e password.", "warning");
        return;
    }

    if (action === "register") {
        if (appData.users.some((user) => user.username === username)) {
            renderAuthHintCallback("Questo nome utente è già in uso.", "danger");
            return;
        }

        const newUser = {
            id: crypto.randomUUID(),
            username,
            password,
            contacts: []
        };

        appData.users.push(newUser);
        saveAppData();
        updateSessionState({ loggedInUserId: newUser.id, userId: newUser.id });
        syncStateCallback();
        renderWorkspaceCallback();
        showAppViewCallback();
        showListViewCallback();
        resetAuthFormCallback?.();
        renderAuthHintCallback("Account creato con successo.", "success");
        showAlertCallback("Account creato con successo.", "success");
        return;
    }

    const user = appData.users.find((entry) => entry.username === username && entry.password === password);
    if (!user) {
        renderAuthHintCallback("Credenziali non valide.", "danger");
        return;
    }

    updateSessionState({
        loggedInUserId: user.id,
        userId: user.id
    });
    syncStateCallback();
    renderWorkspaceCallback();
    showAppViewCallback();
    showListViewCallback();
    resetAuthFormCallback?.();
    renderAuthHintCallback("Accesso effettuato.", "success");
}

/**
 * Chiude la sessione corrente.
 * @param {Function} saveContactsCallback - Callback per salvare contatti
 * @param {Function} renderWorkspaceCallback - Callback per rendere workspace
 * @param {Function} showAuthViewCallback - Callback per mostrare login
 * @param {Function} renderAuthHintCallback - Callback per hint auth
 * @param {Function} clearStateCallback - Callback per pulire lo stato
 * @returns {void}
 */
export function handleLogout(
    saveContactsCallback,
    renderWorkspaceCallback,
    showAuthViewCallback,
    renderAuthHintCallback,
    clearStateCallback
) {
    saveContactsCallback();
    updateSessionState({ loggedInUserId: "", userId: "" });
    sessionStorage.removeItem("rubrica-giolitti-session");
    clearStateCallback();
    renderWorkspaceCallback();
    showAuthViewCallback();
    renderAuthHintCallback("Sessione chiusa. Effettua di nuovo l'accesso per continuare.", "secondary");
}

/**
 * Cambia la password dell'utente attivo.
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @param {Function} hideModalCallback - Callback per nascondere modal
 * @returns {void}
 */
export function handleChangePassword(newPassword, confirmPassword, showAlertCallback, hideModalCallback) {
    const user = getActiveUser();
    if (!user) {
        showAlertCallback("Nessun utente autenticato.", "danger");
        return;
    }

    const trimmedNew = String(newPassword || "").trim();
    const trimmedConfirm = String(confirmPassword || "").trim();

    if (!trimmedNew || !trimmedConfirm) {
        showAlertCallback("Inserisci la nuova password e la conferma.", "warning");
        return;
    }

    if (trimmedNew !== trimmedConfirm) {
        showAlertCallback("Le password non corrispondono.", "danger");
        return;
    }

    if (trimmedNew.length < 3) {
        showAlertCallback("La password deve avere almeno 3 caratteri.", "warning");
        return;
    }

    user.password = trimmedNew;
    saveAppData();
    showAlertCallback("Password cambiata con successo.", "success");
    hideModalCallback();
}

/**
 * Elimina l'account dell'utente attivo.
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @param {Function} handleLogoutCallback - Callback per logout
 * @param {Function} hideModalCallback - Callback per nascondere modal
 * @returns {void}
 */
export function handleDeleteAccount(showAlertCallback, handleLogoutCallback, hideModalCallback) {
    const user = getActiveUser();
    if (!user) {
        showAlertCallback("Nessun utente autenticato.", "danger");
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
    handleLogoutCallback();
    hideModalCallback();
}
