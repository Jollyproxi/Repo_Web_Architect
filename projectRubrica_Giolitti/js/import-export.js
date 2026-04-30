/**
 * import-export.js - Handles contact import and export operations
 */

import { getActiveUser, saveAppData } from "./data-manager.js";
import { normalizeStoredContact } from "./data-manager.js";

/**
 * Esporta i contatti dell'utente come JSON.
 * @returns {{json: string, filename: string} | null}
 */
export function exportBook() {
    const user = getActiveUser();
    if (!user) {
        return null;
    }

    const exportData = {
        username: user.username,
        exportDate: new Date().toISOString(),
        contacts: user.contacts
    };

    const json = JSON.stringify(exportData, null, 2);
    const date = new Date().toISOString().split("T")[0];
    const filename = `rubrica-${user.username}-${date}.json`;

    return { json, filename };
}

/**
 * Gestisce il click sul pulsante di esportazione.
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @returns {void}
 */
export function handleExport(showAlertCallback) {
    const result = exportBook();
    if (!result) {
        showAlertCallback("Nessun utente autenticato per esportare.", "warning");
        return;
    }

    const blob = new Blob([result.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlertCallback("Rubrica esportata con successo.", "success");
}

/**
 * Importa contatti da un file JSON.
 * @param {string} jsonString
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @returns {{contacts: Contact[]} | null}
 */
export function importBook(jsonString, showAlertCallback) {
    try {
        const data = JSON.parse(jsonString);
        if (!Array.isArray(data.contacts)) {
            throw new Error("Il file non contiene un array 'contacts' valido.");
        }
        return data;
    } catch (error) {
        showAlertCallback(`Errore nell'importazione: ${error.message}`, "danger");
        return null;
    }
}

/**
 * Gestisce il cambio file nell'input di importazione.
 * @param {Event} event
 * @param {Function} importCallback - Callback con (normalizedContacts)
 * @param {Function} showAlertCallback - Callback per mostrare alert
 * @returns {void}
 */
export function handleImportFileChange(event, importCallback, showAlertCallback) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const jsonString = String(e.target?.result || "");
        const imported = importBook(jsonString, showAlertCallback);
        if (!imported) return;

        const confirmed = window.confirm(
            `Importare ${imported.contacts.length} contatti? I contatti attuali verranno sostituiti.`
        );
        if (!confirmed) return;

        const normalized = imported.contacts.map((c) => normalizeStoredContact(c));
        importCallback(normalized, imported.contacts.length);
    };
    reader.onerror = () => {
        showAlertCallback("Errore durante la lettura del file.", "danger");
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
}

/**
 * Gestisce il click sul pulsante di importazione.
 * @param {HTMLElement} importFileInput - Input file element
 * @returns {void}
 */
export function handleImportClick(importFileInput) {
    importFileInput.click();
}
