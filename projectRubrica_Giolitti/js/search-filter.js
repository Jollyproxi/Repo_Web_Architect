/**
 * search-filter.js - Handles search, filtering, and tag management
 */

export const searchState = {
    searchQuery: "",
    currentPage: 1,
    filteredContacts: [],
    showFavoritesOnly: false,
    selectedTags: [],
    allTags: []
};

const CONTACTS_PER_PAGE = 6;

/**
 * Aggiorna la query di ricerca globale e rilancia il filtro.
 * @param {InputEvent} event
 * @param {Function} applySearchCallback - Callback per applicare il filtro
 * @returns {void}
 */
export function handleGlobalSearch(event, applySearchCallback) {
    searchState.searchQuery = String(event.target.value || "").trim().toLowerCase();
    searchState.currentPage = 1;
    applySearchCallback();
}

/**
 * Raccoglie tutti i tag unici dai contatti attuali.
 * @param {Contact[]} contacts - Lista contatti
 * @returns {void}
 */
export function updateAllTags(contacts) {
    const allTagsSet = new Set();
    contacts.forEach((contact) => {
        (contact.tags || []).forEach((tag) => allTagsSet.add(tag));
    });
    searchState.allTags = Array.from(allTagsSet).sort();
}

/**
 * Filtra i contatti per nome, email, telefono ed età.
 * @param {Contact[]} contacts - Lista contatti completa
 * @returns {Contact[]} - Contatti filtrati
 */
export function applySearch(contacts) {
    let filtered = [...contacts];

    // Filtro testo
    if (searchState.searchQuery) {
        filtered = filtered.filter((contact) => {
            const lowerName = String(contact.fullName || "").toLowerCase();
            const lowerEmail = String(contact.email || "").toLowerCase();
            const lowerPhone = String(contact.phoneInternational || "").toLowerCase();
            const age = String(contact.age || "").toLowerCase();
            const q = searchState.searchQuery;

            return (
                lowerName.includes(q) ||
                lowerEmail.includes(q) ||
                lowerPhone.includes(q) ||
                age.includes(q)
            );
        });
    }

    // Filtro preferiti
    if (searchState.showFavoritesOnly) {
        filtered = filtered.filter((contact) => contact.isFavorite);
    }

    // Filtro tag
    if (searchState.selectedTags && searchState.selectedTags.length > 0) {
        filtered = filtered.filter((contact) => {
            const contactTags = contact.tags || [];
            return searchState.selectedTags.some((tag) => contactTags.includes(tag));
        });
    }

    searchState.filteredContacts = filtered;
    return filtered;
}

/**
 * Renderizza i pulsanti di filtro tag nella search bar.
 * @param {HTMLElement} tagFilterContainer - Container per i pulsanti
 * @param {Function} onTagSelectCallback - Callback(tag, isNowSelected) quando un tag è selezionato
 * @returns {void}
 */
export function renderTagFilters(tagFilterContainer, onTagSelectCallback) {
    if (!tagFilterContainer) return;
    tagFilterContainer.innerHTML = "";

    if (searchState.allTags.length === 0) {
        return;
    }

    searchState.allTags.forEach((tag) => {
        const isSelected = searchState.selectedTags.includes(tag);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `btn btn-sm ${isSelected ? "btn-primary" : "btn-outline-secondary"}`;
        btn.textContent = tag;
        btn.dataset.tag = tag;
        btn.addEventListener("click", () => {
            if (isSelected) {
                searchState.selectedTags = searchState.selectedTags.filter((t) => t !== tag);
            } else {
                searchState.selectedTags.push(tag);
            }
            searchState.currentPage = 1;
            onTagSelectCallback();
        });
        tagFilterContainer.appendChild(btn);
    });
}

/**
 * Calcola e restituisce i contatti per la pagina attuale.
 * @returns {{pageContacts: Contact[], totalPages: number}}
 */
export function getPageContacts() {
    const totalPages = Math.ceil(searchState.filteredContacts.length / CONTACTS_PER_PAGE);
    const start = (searchState.currentPage - 1) * CONTACTS_PER_PAGE;
    const end = start + CONTACTS_PER_PAGE;
    const pageContacts = searchState.filteredContacts.slice(start, end);

    return { pageContacts, totalPages };
}

/**
 * Restituisce il numero di contatti per pagina.
 * @returns {number}
 */
export function getContactsPerPage() {
    return CONTACTS_PER_PAGE;
}

/**
 * Resetta lo stato della ricerca.
 * @returns {void}
 */
export function resetSearch() {
    searchState.searchQuery = "";
    searchState.currentPage = 1;
    searchState.selectedTags = [];
    searchState.filteredContacts = [];
    searchState.showFavoritesOnly = false;
}
