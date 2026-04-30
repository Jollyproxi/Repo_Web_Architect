/**
 * theme-manager.js - Handles theme switching between light and dark mode
 */

const THEME_KEY = "rubrica-theme";

/**
 * Legge il tema salvato e lo applica al caricamento della pagina.
 * @param {HTMLElement} themeIcon - Icona tema
 * @returns {void}
 */
export function initTheme(themeIcon) {
    const saved = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(saved, themeIcon);
}

/**
 * Applica tema chiaro o scuro e aggiorna il toggle visivo corrispondente.
 * @param {"light"|"dark"} theme - Tema da applicare
 * @param {HTMLElement} themeIcon - Icona tema
 * @returns {void}
 */
export function applyTheme(theme, themeIcon) {
    const isDark = theme === "dark";
    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
        html.setAttribute("data-bs-theme", "dark");
        body.classList.add("bg-dark");
        body.classList.remove("bg-body-tertiary");
        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
    } else {
        html.removeAttribute("data-bs-theme");
        body.classList.add("bg-body-tertiary");
        body.classList.remove("bg-dark");
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
    }

    localStorage.setItem(THEME_KEY, theme);
}

/**
 * Inverte il tema corrente tra modalità chiara e scura.
 * @param {HTMLElement} themeIcon - Icona tema
 * @returns {void}
 */
export function toggleTheme(themeIcon) {
    const current = localStorage.getItem(THEME_KEY) || "light";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next, themeIcon);
}
