/**
 * @typedef {Object} Contact
 * @property {string=} id
 * @property {string} email
 * @property {string} countryCode
 * @property {string} phoneLocal
 * @property {string=} phoneInternational
 * @property {boolean=} isFavorite
 * @property {string[]=} tags
 */

/**
 * @typedef {Object} ContactCandidate
 * @property {string} email
 * @property {string} countryCode
 * @property {string} phoneLocal
 */

/**
 * @typedef {Object} DuplicateOptions
 * @property {string=} ignoreId
 */

/**
 * Normalizza una email rendendola confrontabile (trim + lower case).
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

/**
 * Estrae il prefisso internazionale numerico e lo restituisce come +NNN.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeCountryCode(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? `+${digits}` : "";
}

/**
 * Mantiene solo le cifre del numero locale.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeLocalPhone(value) {
    return String(value || "").replace(/\D/g, "");
}

/**
 * Normalizza un array di tag (trim, lowercase, remove duplicates).
 * @param {unknown} value
 * @returns {string[]}
 */
export function normalizeTags(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [...new Set(
        value.map((tag) => String(tag || "").trim().toLowerCase()).filter((tag) => tag.length > 0)
    )];
}

/**
 * Costruisce un numero internazionale normalizzato a partire da prefisso e numero locale.
 * @param {unknown} countryCode
 * @param {unknown} phoneLocal
 * @returns {string}
 */
export function buildInternationalPhone(countryCode, phoneLocal) {
    const normalizedPrefix = normalizeCountryCode(countryCode);
    const normalizedLocal = normalizeLocalPhone(phoneLocal);
    const localNoTrunkZero = normalizedLocal.replace(/^0+/, "") || normalizedLocal;

    return `${normalizedPrefix}${localNoTrunkZero}`;
}

/**
 * Ricava l'iniziale da usare per il placeholder dell'avatar.
 * @param {unknown} fullName
 * @returns {string}
 */
export function getPlaceholderInitial(fullName) {
    const value = String(fullName || "").trim();
    return value ? value.slice(0, 1).toUpperCase() : "?";
}

/**
 * Verifica se una stringa rappresenta una URL HTTP/HTTPS valida.
 * @param {unknown} value
 * @returns {boolean}
 */
function isValidHttpUrl(value) {
    if (!value) {
        return false;
    }

    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_error) {
        return false;
    }
}

/**
 * Risolve la sorgente avatar finale con priorita: base64 > url valida > placeholder.
 * @param {AvatarInput} input
 * @returns {AvatarResult}
 */
export function resolveAvatarSource({avatarUrl, avatarBase64, fullName}) {
    if (avatarBase64) {
        return {
            avatar: avatarBase64,
            avatarMode: "file",
            placeholderInitial: getPlaceholderInitial(fullName)
        };
    }

    const trimmedUrl = String(avatarUrl || "").trim();
    if (isValidHttpUrl(trimmedUrl)) {
        return {
            avatar: trimmedUrl,
            avatarMode: "url",
            placeholderInitial: getPlaceholderInitial(fullName)
        };
    }

    return {
        avatar: "",
        avatarMode: "placeholder",
        placeholderInitial: getPlaceholderInitial(fullName)
    };
}

/**
 * Verifica se un contatto è duplicato per email o telefono internazionale.
 * @param {Contact[]} contacts
 * @param {ContactCandidate} candidate
 * @param {DuplicateOptions=} options
 * @returns {boolean}
 */
export function isDuplicateContact(contacts, candidate, options = {}) {
    const ignoreId = options.ignoreId || null;
    const normalizedEmail = normalizeEmail(candidate.email);
    const normalizedPhone = buildInternationalPhone(candidate.countryCode, candidate.phoneLocal);

    return contacts.some((contact) => {
        if (ignoreId && contact.id === ignoreId) {
            return false;
        }

        const contactPhone = contact.phoneInternational || buildInternationalPhone(contact.countryCode, contact.phoneLocal);
        return normalizeEmail(contact.email) === normalizedEmail || contactPhone === normalizedPhone;
    });
}
``