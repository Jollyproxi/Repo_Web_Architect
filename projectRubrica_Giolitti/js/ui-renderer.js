/**
 * ui-renderer.js - Handles all UI rendering logic
 */

import { getPlaceholderInitial } from "./contact-utils.js";
import { sessionState } from "./data-manager.js";
import { getPageContacts, searchState } from "./search-filter.js";

/**
 * Aggiorna il testo di aiuto nel pannello di accesso.
 * @param {HTMLElement} authHint - Elemento hint
 * @param {string} message - Messaggio
 * @param {"secondary"|"info"|"warning"|"success"|"danger"} type - Tipo alert
 * @returns {void}
 */
export function renderAuthHint(authHint, message, type = "secondary") {
    authHint.className = `small text-${type} mt-3`;
    authHint.textContent = message;
}

/**
 * Aggiorna le etichette dell'area workspace.
 * @param {HTMLElement} activeUserLabel - Label utente attivo
 * @param {HTMLElement} accountSettingsBtn - Bottone impostazioni
 * @param {HTMLElement} logoutBtn - Bottone logout
 * @param {Object} user - Utente attivo
 * @param {boolean} isAdmin - Se l'utente è admin
 * @returns {void}
 */
export function renderWorkspaceBar(activeUserLabel, accountSettingsBtn, logoutBtn, user, isAdmin) {
    if (!user) {
        activeUserLabel.textContent = "-";
        accountSettingsBtn.disabled = true;
        logoutBtn.disabled = true;
        return;
    }

    activeUserLabel.textContent = isAdmin ? `${user.username} (Admin)` : user.username;
    accountSettingsBtn.disabled = isAdmin && sessionState?.userId !== user.id ? true : false;
    logoutBtn.disabled = false;
}

/**
 * Mostra l'area autenticata.
 * @param {HTMLElement} authView - Vista autenticazione
 * @param {HTMLElement} appShell - Shell app
 * @returns {void}
 */
export function showAppView(authView, appShell) {
    authView.classList.add("d-none");
    appShell.classList.remove("d-none");
}

/**
 * Mostra il pannello di accesso.
 * @param {HTMLElement} authView - Vista autenticazione
 * @param {HTMLElement} appShell - Shell app
 * @param {HTMLElement} authUsernameInput - Input username
 * @returns {void}
 */
export function showAuthView(authView, appShell, authUsernameInput) {
    appShell.classList.add("d-none");
    authView.classList.remove("d-none");
    authUsernameInput.focus();
}

/**
 * Mostra il form di inserimento.
 * @param {HTMLElement} formView - Vista form
 * @param {HTMLElement} listView - Vista lista
 * @param {HTMLElement} showFormBtn - Bottone mostra form
 * @param {HTMLElement} showListBtn - Bottone mostra lista
 * @returns {void}
 */
export function showFormView(formView, listView, showFormBtn, showListBtn) {
    formView.classList.remove("d-none");
    listView.classList.add("d-none");
    showListBtn.classList.remove("btn-outline-primary");
    showListBtn.classList.add("btn-primary");
    showFormBtn.classList.remove("btn-primary");
    showFormBtn.classList.add("btn-outline-primary");
}

/**
 * Mostra la lista contatti.
 * @param {HTMLElement} formView - Vista form
 * @param {HTMLElement} listView - Vista lista
 * @param {HTMLElement} showFormBtn - Bottone mostra form
 * @param {HTMLElement} showListBtn - Bottone mostra lista
 * @param {Function} showSearchBarCallback - Callback per mostrare search bar
 * @returns {void}
 */
export function showListView(formView, listView, showFormBtn, showListBtn, showSearchBarCallback) {
    listView.classList.remove("d-none");
    formView.classList.add("d-none");
    showListBtn.classList.remove("btn-primary");
    showListBtn.classList.add("btn-outline-primary");
    showFormBtn.classList.remove("btn-outline-primary");
    showFormBtn.classList.add("btn-primary");
    showSearchBarCallback();
}

/**
 * Mostra la barra di ricerca globale.
 * @param {HTMLElement} searchBar - Elemento search bar
 * @param {HTMLElement} globalSearchInput - Input ricerca
 * @returns {void}
 */
export function showSearchBar(searchBar, globalSearchInput) {
    searchBar.classList.remove("d-none");
    globalSearchInput.focus();
}

/**
 * Nasconde la barra di ricerca globale.
 * @param {HTMLElement} searchBar - Elemento search bar
 * @returns {void}
 */
export function hideSearchBar(searchBar) {
    searchBar.classList.add("d-none");
}

/**
 * Renderizza la pagina corrente della rubrica filtrata come griglia di card.
 * @param {HTMLElement} contactsGrid - Container griglia
 * @param {HTMLElement} noContactsMsg - Messaggio no contacts
 * @param {HTMLElement} paginationNav - Elemento paginazione
 * @param {HTMLElement} paginationList - Lista paginazione
 * @param {Function} onEditCallback - Callback modifica
 * @param {Function} onDeleteCallback - Callback eliminazione
 * @param {Function} onToggleFavoriteCallback - Callback toggle favorite
 * @param {Function} renderPaginationCallback - Callback renderizza paginazione
 * @returns {void}
 */
export function renderContactsPage(
    contactsGrid,
    noContactsMsg,
    paginationNav,
    paginationList,
    onEditCallback,
    onDeleteCallback,
    onToggleFavoriteCallback,
    renderPaginationCallback
) {
    const { pageContacts, totalPages } = getPageContacts();
    contactsGrid.innerHTML = "";

    if (pageContacts.length === 0) {
        noContactsMsg.classList.remove("d-none");
        paginationNav.classList.add("d-none");
        return;
    }

    noContactsMsg.classList.add("d-none");

    pageContacts.forEach((contact) => {
        const col = document.createElement("div");
        col.className = "col";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column";

        const avatar = contact.avatar
            ? `<img src="${contact.avatar}" alt="${contact.fullName}" class="rounded-circle mb-2" style="width:50px; height:50px; object-fit:cover;">`
            : `<div class="rounded-circle mb-2 d-inline-flex align-items-center justify-content-center" style="width:50px; height:50px; background:#0d6efd; color:white; font-weight:700;">${getPlaceholderInitial(contact.fullName)}</div>`;
        // helper: escape and highlight matches based on searchState.searchQuery
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        }

        function highlight(text, query) {
            const t = String(text || "");
            if (!query) return escapeHtml(t);
            try {
                const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const re = new RegExp(q, "ig");
                return escapeHtml(t).replace(re, (m) => `<mark>${escapeHtml(m)}</mark>`);
            } catch (e) {
                return escapeHtml(t);
            }
        }

        const q = searchState?.searchQuery || "";
        const highlightedName = highlight(contact.fullName, q);
        const highlightedEmail = highlight(contact.email, q);
        const highlightedPhone = highlight(contact.phoneInternational, q);

        card.dataset.id = contact.id;
        card.dataset.action = "view";
        card.style.cursor = "pointer";

        cardBody.innerHTML = `
            ${avatar}
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${highlightedName}</h5>
                <button type="button" class="btn btn-sm" data-action="toggle-favorite" data-id="${contact.id}" style="padding: 0; background: none; border: none;">
                    <i class="bi ${contact.isFavorite ? "bi-star-fill" : "bi-star"}" style="font-size: 1.25rem; color: ${contact.isFavorite ? "#ffc107" : "#ccc"};"></i>
                </button>
            </div>
            <p class="card-text small mb-2">
                <strong>Email:</strong> ${highlightedEmail}<br>
                <strong>Telefono:</strong> ${highlightedPhone}
                ${contact.age ? `<br><strong>Età:</strong> ${contact.age} anni` : ""}
                ${contact.createdBy ? `<br><strong>Inserito da:</strong> ${escapeHtml(contact.createdBy)}` : ""}
            </p>
            ${
                contact.tags && contact.tags.length > 0
                    ? `
                <div class="mb-2">
                    ${contact.tags.map((tag) => `<span class="badge bg-secondary me-1">${escapeHtml(tag)}</span>`).join("")}
                </div>
            `
                    : ""
            }
        `;

        const actionWrap = document.createElement("div");
        actionWrap.className = "d-flex gap-2 mt-auto";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn btn-sm btn-outline-primary flex-grow-1";
        editBtn.dataset.action = "edit";
        editBtn.dataset.id = contact.id;
        editBtn.textContent = "Modifica";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "btn btn-sm btn-outline-danger flex-grow-1";
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = contact.id;
        deleteBtn.textContent = "Elimina";

        actionWrap.append(editBtn, deleteBtn);
        cardBody.appendChild(actionWrap);
        card.appendChild(cardBody);
        col.appendChild(card);
        contactsGrid.appendChild(col);
    });

    if (totalPages > 1) {
        paginationNav.classList.remove("d-none");
        renderPaginationCallback(totalPages);
    } else {
        paginationNav.classList.add("d-none");
    }
}

/**
 * Costruisce i controlli di paginazione Bootstrap.
 * @param {HTMLElement} paginationList - Container lista paginazione
 * @param {number} totalPages - Numero totale pagine
 * @param {number} currentPage - Pagina attuale
 * @param {Function} onPageChangeCallback - Callback quando pagina cambia
 * @returns {void}
 */
export function renderPagination(paginationList, totalPages, currentPage, onPageChangeCallback) {
    paginationList.innerHTML = "";

    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    const prevBtn = document.createElement("button");
    prevBtn.className = "page-link";
    prevBtn.textContent = "Precedente";
    prevBtn.type = "button";
    if (currentPage > 1) {
        prevBtn.addEventListener("click", () => onPageChangeCallback(currentPage - 1));
    } else {
        prevBtn.disabled = true;
    }
    prevLi.appendChild(prevBtn);
    paginationList.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? "active" : ""}`;
        const btn = document.createElement("button");
        btn.className = "page-link";
        btn.textContent = String(i);
        btn.type = "button";
        btn.addEventListener("click", () => onPageChangeCallback(i));
        li.appendChild(btn);
        paginationList.appendChild(li);
    }

    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    const nextBtn = document.createElement("button");
    nextBtn.className = "page-link";
    nextBtn.textContent = "Successivo";
    nextBtn.type = "button";
    if (currentPage < totalPages) {
        nextBtn.addEventListener("click", () => onPageChangeCallback(currentPage + 1));
    } else {
        nextBtn.disabled = true;
    }
    nextLi.appendChild(nextBtn);
    paginationList.appendChild(nextLi);
}

/**
 * Mostra messaggi Bootstrap dismissibili.
 * @param {HTMLElement} alertBox - Container alert
 * @param {string} message - Messaggio
 * @param {"info"|"success"|"warning"|"danger"|"primary"|"secondary"} type - Tipo alert
 * @returns {void}
 */
export function showAlert(alertBox, message, type = "info") {
    alertBox.innerHTML = `
		<div class="alert alert-${type} alert-dismissible fade show" role="alert">
			${message}
			<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
		</div>
	`;
}

/**
 * Aggiorna il testo informativo sull'avatar selezionato nel form.
 * @param {HTMLElement} avatarPreview - Elemento preview
 * @param {File|null} file - File selezionato
 * @param {string} avatarUrl - URL avatar
 * @param {string} modeOverride - Modalità override
 * @param {string} valueOverride - Valore override
 * @returns {void}
 */
export function updateAvatarPreviewText(avatarPreview, file, avatarUrl, modeOverride, valueOverride) {
    if (modeOverride === "file") {
        avatarPreview.textContent = "Avatar attuale da file base64.";
        return;
    }

    if (modeOverride === "url") {
        avatarPreview.textContent = `Avatar attuale da URL: ${valueOverride}`;
        return;
    }

    if (file) {
        avatarPreview.textContent = `Avatar selezionato da file: ${file.name}`;
        return;
    }

    if (avatarUrl.trim()) {
        avatarPreview.textContent = "Avatar selezionato da URL.";
        return;
    }

    avatarPreview.textContent = "Nessun avatar selezionato: verra usato il placeholder automatico.";
}
