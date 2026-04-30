/**
 * data-manager.js - Handles data normalization, loading, saving, and session management
 */

import {
    normalizeEmail,
    normalizeCountryCode,
    normalizeLocalPhone,
    buildInternationalPhone,
    getPlaceholderInitial,
    isDuplicateContact,
    normalizeTags
} from "./contact-utils.js";

const APP_DATA_KEY = "rubrica-giolitti-app-data";
const SESSION_KEY = "rubrica-giolitti-session";

export const appData = { users: [] };
export let sessionState = { loggedInUserId: "", userId: "" };

/**
 * Normalizza un contatto salvato nel formato corrente.
 * @param {Contact} entry
 * @returns {Contact}
 */
export function normalizeStoredContact(entry) {
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
        createdBy: String(entry.createdBy || ""),
        isFavorite: entry.isFavorite === true,
        tags: normalizeTags(entry.tags)
    };
}

/**
 * Normalizza una lista di contatti salvati.
 * @param {Contact[]} entries
 * @returns {Contact[]}
 */
export function normalizeStoredContacts(entries) {
    return Array.isArray(entries) ? entries.map((entry) => normalizeStoredContact(entry)) : [];
}

/**
 * Normalizza un account salvato.
 * @param {unknown} entry
 * @returns {{id: string, username: string, password: string, isAdmin?: boolean, contacts: Contact[]}}
 */
export function normalizeUser(entry) {
    const contacts = normalizeStoredContacts(entry?.contacts || []);
    const isAdmin = Boolean(entry?.isAdmin === true);

    // Supporto legacy: se entry ha books, estrai i contatti dal primo libro
    if (Array.isArray(entry?.books) && entry.books.length > 0) {
        entry.books[0].contacts?.forEach((contact) => {
            const normalized = normalizeStoredContact(contact);
            if (!contacts.some((c) => c.id === normalized.id)) {
                contacts.push(normalized);
            }
        });
    }

    return {
        id: String(entry?.id || crypto.randomUUID()),
        username: normalizeAuthName(entry?.username),
        password: String(entry?.password || ""),
        isAdmin,
        contacts
    };
}

/**
 * Normalizza il nome utente per i confronti.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeAuthName(value) {
    return String(value || "").trim().toLowerCase();
}

/**
 * Legge la struttura dati dell'app da localStorage.
 * @returns {{users: Array}}
 */
export function loadAppData() {
    const raw = localStorage.getItem(APP_DATA_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            const users = Array.isArray(parsed?.users) ? parsed.users.map((entry) => normalizeUser(entry)) : [];
            return { users };
        } catch (error) {
            console.error("Errore nel caricamento dei dati applicativi:", error);
        }
    }

    return { users: [] };
}

/**
 * Salva la struttura dati dell'app in localStorage.
 * @returns {void}
 */
export function saveAppData() {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify({ users: appData.users }));
}

/**
 * Legge la sessione attiva dall'area di sessione del browser.
 * @returns {{loggedInUserId: string, userId: string}}
 */
export function loadSessionState() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
        return { loggedInUserId: "", userId: "" };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            loggedInUserId: String(parsed?.loggedInUserId || parsed?.userId || ""),
            userId: String(parsed?.userId || "")
        };
    } catch (error) {
        console.error("Errore nel caricamento della sessione:", error);
        return { loggedInUserId: "", userId: "" };
    }
}

/**
 * Salva la sessione corrente.
 * @returns {void}
 */
export function saveSessionState() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionState));
}

/**
 * Aggiorna la sessione con nuovi valori.
 * @param {Partial<{loggedInUserId: string, userId: string}>} newState
 * @returns {void}
 */
export function updateSessionState(newState) {
    Object.assign(sessionState, newState);
    saveSessionState();
}

/**
 * Restituisce l'utente attivo autenticato.
 * @returns {*|null}
 */
export function getActiveUser() {
    return appData.users.find((user) => user.id === sessionState.userId) || null;
}

/**
 * Ritorna i contatti visibili all'utente attivo.
 * L'admin vede i contatti di tutti gli utenti.
 * @returns {Contact[]}
 */
export function getVisibleContactsForCurrentUser() {
    const activeUser = getActiveUser();
    if (!activeUser) {
        return [];
    }

    const cloneContact = (contact) => ({
        ...normalizeStoredContact(contact),
        tags: Array.isArray(contact?.tags) ? [...contact.tags] : []
    });

    if (!isCurrentUserAdmin()) {
        return activeUser.contacts.map((contact) => cloneContact(contact));
    }

    return appData.users.flatMap((user) => user.contacts.map((contact) => cloneContact(contact)));
}

/**
 * Salva i contatti visibili nell'account corretto.
 * L'admin distribuisce i contatti in base a createdBy.
 * @param {Contact[]} contacts
 * @returns {void}
 */
export function saveContactsForCurrentUser(contacts) {
    const activeUser = getActiveUser();
    if (!activeUser) {
        return;
    }

    const normalizedContacts = Array.isArray(contacts)
        ? contacts.map((contact) => normalizeStoredContact(contact))
        : [];

    if (!isCurrentUserAdmin()) {
        activeUser.contacts = normalizedContacts.map((contact) => ({
            ...contact,
            createdBy: contact.createdBy || activeUser.username,
            tags: Array.isArray(contact.tags) ? [...contact.tags] : []
        }));
        saveAppData();
        return;
    }

    const contactsByUsername = new Map(appData.users.map((user) => [user.username, []]));

    normalizedContacts.forEach((contact) => {
        const ownerUsername = normalizeAuthName(contact.createdBy) || activeUser.username;
        const owner = appData.users.find((user) => user.username === ownerUsername) || activeUser;
        const ownerContacts = contactsByUsername.get(owner.username) || [];
        ownerContacts.push({
            ...contact,
            createdBy: owner.username,
            tags: Array.isArray(contact.tags) ? [...contact.tags] : []
        });
        contactsByUsername.set(owner.username, ownerContacts);
    });

    appData.users.forEach((user) => {
        user.contacts = contactsByUsername.get(user.username) || [];
    });

    saveAppData();
}

/**
 * Inizializza il database con un account superuser admin/admin se non esistono utenti.
 * @returns {void}
 */
export function seedAdminIfNeeded() {
    if (appData.users.length === 0) {
        const adminUser = {
            id: crypto.randomUUID(),
            username: "admin",
            password: "admin",
            isAdmin: true,
            contacts: []
        };
        appData.users.push(adminUser);
        saveAppData();
    }
}

/**
 * Verifica se l'utente autenticato è un amministratore.
 * @returns {boolean}
 */
export function isCurrentUserAdmin() {
    const loggedInUser = appData.users.find((user) => user.id === sessionState.loggedInUserId);
    return Boolean(loggedInUser?.isAdmin === true);
}

// Placeholder per gestire country options (sarà importato da country-selector.js)
export let countryByDialCode = new Map();

/**
 * Imposta la mappa dei paesi per la normalizzazione.
 * @param {Map} countryMap
 * @returns {void}
 */
export function setCountryByDialCode(countryMap) {
    countryByDialCode = countryMap;
}

/**
 * Placeholder per getCountryOptionBySelection.
 * @param {string} dialCode
 * @param {string} iso2
 * @returns {*|null}
 */
export function getCountryOptionBySelection(dialCode, iso2) {
    // Questo sarà implementato in country-selector.js e richiamato qui
    // Per ora ritorniamo null per evitare errori
    return null;
}
