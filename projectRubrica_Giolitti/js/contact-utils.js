export function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
}

export function normalizeCountryCode(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? `+${digits}` : "";
}

export function normalizeLocalPhone(value) {
    return String(value || "").replace(/\D/g, "");
}

export function buildInternationalPhone(countryCode, phoneLocal) {
    const normalizedPrefix = normalizeCountryCode(countryCode);
    const normalizedLocal = normalizeLocalPhone(phoneLocal);
    const localNoTrunkZero = normalizedLocal.replace(/^0+/, "") || normalizedLocal;

    return `${normalizedPrefix}${localNoTrunkZero}`;
}

export function getPlaceholderInitial(fullName) {
    const value = String(fullName || "").trim();
    return value ? value.slice(0, 1).toUpperCase() : "?";
}

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

export function resolveAvatarSource({ avatarUrl, avatarBase64, fullName }) {
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
