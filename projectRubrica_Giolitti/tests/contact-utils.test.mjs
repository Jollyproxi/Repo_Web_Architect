import assert from "node:assert/strict";
import {
    buildInternationalPhone,
    getPlaceholderInitial,
    isDuplicateContact,
    normalizeCountryCode,
    normalizeEmail,
    normalizeLocalPhone,
    resolveAvatarSource
} from "../js/contact-utils.js";

const contacts = [
    {
        id: "1",
        fullName: "Mario Rossi",
        countryCode: "+39",
        phoneLocal: "3331234567",
        phoneInternational: "+393331234567",
        email: "mario@example.com"
    },
    {
        id: "2",
        fullName: "Luigi Bianchi",
        countryCode: "+39",
        phoneLocal: "011223344",
        phoneInternational: "+3911223344",
        email: "luigi@example.com"
    }
];

assert.equal(normalizeEmail("  TEST@MAIL.IT "), "test@mail.it");
assert.equal(normalizeCountryCode(" 39 "), "+39");
assert.equal(normalizeLocalPhone(" 333-123 4567 "), "3331234567");
assert.equal(buildInternationalPhone("+39", "0333-1234567"), "+393331234567");
assert.equal(getPlaceholderInitial("  mario "), "M");

assert.deepEqual(
    resolveAvatarSource({avatarUrl: "https://example.com/a.png", avatarBase64: "", fullName: "Mario"}),
    {avatar: "https://example.com/a.png", avatarMode: "url", placeholderInitial: "M"}
);

assert.equal(
    resolveAvatarSource({avatarUrl: "not-valid", avatarBase64: "", fullName: "Mario"}).avatarMode,
    "placeholder"
);

assert.equal(
    resolveAvatarSource({avatarUrl: "", avatarBase64: "data:image/png;base64,abc", fullName: "Mario"}).avatarMode,
    "file"
);

assert.equal(
    isDuplicateContact(contacts, {countryCode: "+39", phoneLocal: "3331234567", email: "altro@mail.it"}),
    true,
    "Il telefono normalizzato deve essere riconosciuto come duplicato"
);

assert.equal(
    isDuplicateContact(contacts, {countryCode: "+39", phoneLocal: "999999999", email: " LUIGI@EXAMPLE.COM "}),
    true,
    "L'email normalizzata deve essere riconosciuta come duplicata"
);

assert.equal(
    isDuplicateContact(contacts, {countryCode: "+39", phoneLocal: "1234567", email: "nuovo@mail.it"}),
    false,
    "Un contatto nuovo non deve essere considerato duplicato"
);

assert.equal(
    isDuplicateContact(
        contacts,
        {countryCode: "+39", phoneLocal: "3331234567", email: "mario@example.com"},
        {ignoreId: "1"}
    ),
    false,
    "In modifica il contatto corrente non deve essere trattato come duplicato"
);

console.log("Test contatti: OK");

