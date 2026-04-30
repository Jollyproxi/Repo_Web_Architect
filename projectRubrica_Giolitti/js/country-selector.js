/**
 * country-selector.js - Handles country selection, phone codes, and flag display
 */

import { countries } from "../node_modules/country-codes-flags-phone-codes/dist/index.mjs";

export const countryByDialCode = new Map();
export let countryOptions = [];
export let selectedCountry = null;
let typeSearchBuffer = "";
let typeSearchTimeout = null;

/**
 * Popola le opzioni di selezione dei paesi dalla libreria.
 * @param {HTMLElement} countryCodeSelect - Select elemento hidden
 * @param {HTMLElement} countryDropdownOptions - Container per i pulsanti
 * @param {HTMLElement} countryDropdownBtn - Bottone che mostra il paese selezionato
 * @param {HTMLElement} countryNoResults - Elemento "no results"
 * @returns {void}
 */
export function populateCountryCodeOptions(countryCodeSelect, countryDropdownOptions, countryDropdownBtn, countryNoResults) {
    const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, "it"));
    countryOptions.length = 0;
    countryDropdownOptions.innerHTML = "";
    countryCodeSelect.innerHTML = "";
    countryByDialCode.clear();

    sortedCountries.forEach((country) => {
        const dialCode = String(country.dialCode || "").trim();
        const iso2 = String(country.code || "").trim().toLowerCase();
        if (!dialCode || !/^[a-z]{2}$/.test(iso2)) {
            return;
        }

        if (!countryByDialCode.has(dialCode)) {
            countryByDialCode.set(dialCode, country);

            const hiddenOption = document.createElement("option");
            hiddenOption.value = dialCode;
            hiddenOption.textContent = dialCode;
            countryCodeSelect.appendChild(hiddenOption);
        }

        countryOptions.push({
            dialCode,
            countryName: country.name,
            iso2,
            flag: country.flag,
            code: country.code,
            searchable: `${country.name} ${dialCode} ${dialCode.replace("+", "")}`.toLowerCase()
        });
    });

    renderCountryOptions(countryOptions, countryDropdownOptions, countryNoResults);
    setCountryDialCode("+39", "it", countryCodeSelect, countryDropdownBtn);
}

/**
 * Renderizza la lista dei paesi nella dropdown custom.
 * @param {Array} options - Opzioni paesi
 * @param {HTMLElement} countryDropdownOptions - Container
 * @param {HTMLElement} countryNoResults - Elemento "no results"
 * @returns {void}
 */
export function renderCountryOptions(options, countryDropdownOptions, countryNoResults) {
    countryDropdownOptions.innerHTML = "";

    options.forEach((optionData) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dropdown-item country-dropdown-item";
        button.dataset.dialCode = optionData.dialCode;
        button.dataset.iso2 = optionData.iso2;
        button.dataset.countryName = optionData.countryName;

        const flag = document.createElement("img");
        flag.className = "country-flag";
        flag.alt = "";
        flag.src = getFlagIconPath(optionData.iso2);
        flag.loading = "lazy";
        flag.decoding = "async";
        flag.addEventListener("error", () => {
            flag.replaceWith(document.createTextNode(getCountryFlagEmoji(optionData.flag, optionData.code)));
        });

        const label = document.createElement("span");
        label.textContent = `${optionData.countryName} (${optionData.dialCode})`;

        button.append(flag, document.createTextNode(" "), label);
        countryDropdownOptions.appendChild(button);
    });

    countryNoResults.classList.toggle("d-none", options.length > 0);
}

/**
 * Gestisce il click su una voce della dropdown dei prefissi.
 * @param {MouseEvent} event
 * @param {HTMLElement} countryCodeSelect
 * @param {HTMLElement} countryDropdownBtn
 * @returns {void}
 */
export function handleCountrySelection(event, countryCodeSelect, countryDropdownBtn) {
    const button = event.target.closest("button[data-dial-code]");
    if (!button) {
        return;
    }

    setCountryDialCode(button.dataset.dialCode, button.dataset.iso2, countryCodeSelect, countryDropdownBtn);
}

/**
 * Imposta il prefisso selezionato nei campi di controllo.
 * @param {string} dialCode
 * @param {string} iso2
 * @param {HTMLElement} countryCodeSelect
 * @param {HTMLElement} countryDropdownBtn
 * @param {HTMLElement} countryIsoInput
 * @returns {void}
 */
export function setCountryDialCode(dialCode, iso2 = "", countryCodeSelect, countryDropdownBtn, countryIsoInput = null) {
    const country = getCountryOptionBySelection(dialCode, iso2) || countryByDialCode.get(dialCode);
    countryCodeSelect.value = dialCode;
    if (countryIsoInput) {
        countryIsoInput.value = String(country?.code || "").toLowerCase();
    }
    selectedCountry = country || null;

    if (!country) {
        countryDropdownBtn.replaceChildren();
        const label = document.createElement("span");
        label.className = "country-select-label";
        label.textContent = `Prefisso ${dialCode}`;
        countryDropdownBtn.append(label);
        return;
    }

    const selectedIso2 = String(country.code || "").trim().toLowerCase();
    countryDropdownBtn.replaceChildren();

    const flag = document.createElement("img");
    flag.className = "country-flag";
    flag.alt = "";
    flag.src = getFlagIconPath(selectedIso2);
    flag.addEventListener("error", () => {
        flag.replaceWith(document.createTextNode(getCountryFlagEmoji(country.flag, country.code)));
    });

    const label = document.createElement("span");
    label.className = "country-select-label";
    label.textContent = `${country.name} (${dialCode})`;

    countryDropdownBtn.append(flag, label);
}

/**
 * Restituisce la nazione precisa in base a prefisso+iso.
 * @param {string} dialCode
 * @param {string} iso2
 * @returns {SelectedCountry|null}
 */
export function getCountryOptionBySelection(dialCode, iso2) {
    const normalizedDialCode = String(dialCode || "").trim();
    const normalizedIso2 = String(iso2 || "").trim().toLowerCase();

    if (normalizedDialCode && normalizedIso2) {
        const exact = countryOptions.find((item) => {
            return item.dialCode === normalizedDialCode && item.iso2 === normalizedIso2;
        });

        if (exact) {
            return {
                name: exact.countryName,
                code: exact.iso2,
                flag: exact.flag,
                dialCode: exact.dialCode
            };
        }
    }

    const byDial = countryOptions.find((item) => item.dialCode === normalizedDialCode);
    if (!byDial) {
        return null;
    }

    return {
        name: byDial.countryName,
        code: byDial.iso2,
        flag: byDial.flag,
        dialCode: byDial.dialCode
    };
}

/**
 * Costruisce il path SVG della bandiera locale.
 * @param {string} iso2LowerCase
 * @returns {string}
 */
export function getFlagIconPath(iso2LowerCase) {
    return `./node_modules/flag-icons/flags/4x3/${iso2LowerCase}.svg`;
}

/**
 * Ritorna un'emoji bandiera come fallback.
 * @param {unknown} flag
 * @param {unknown} countryCode
 * @returns {string}
 */
export function getCountryFlagEmoji(flag, countryCode) {
    const cleanFlag = String(flag || "").trim();
    if (cleanFlag) {
        return cleanFlag;
    }

    const iso2 = String(countryCode || "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(iso2)) {
        return "🏳";
    }

    const first = iso2.codePointAt(0) + 127397;
    const second = iso2.codePointAt(1) + 127397;
    return String.fromCodePoint(first, second);
}

/**
 * Gestisce la ricerca tramite tastiera (type-to-select).
 * @param {KeyboardEvent} event
 * @param {HTMLElement} countryDropdownOptions
 * @returns {void}
 */
export function handleCountryTypeSearch(event, countryDropdownOptions) {
    if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }

    event.preventDefault();

    clearTimeout(typeSearchTimeout);
    typeSearchBuffer += event.key.toLowerCase();
    typeSearchTimeout = setTimeout(() => {
        typeSearchBuffer = "";
    }, 500);

    const match = countryOptions.find((opt) =>
        opt.countryName.toLowerCase().startsWith(typeSearchBuffer)
    );

    if (match) {
        const buttons = countryDropdownOptions.querySelectorAll("button");
        const targetBtn = Array.from(buttons).find(
            (btn) => btn.dataset.dialCode === match.dialCode && btn.dataset.iso2 === match.iso2
        );

        if (targetBtn) {
            targetBtn.focus();
            targetBtn.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }
}
