# Rubrica Personale

Client-side contact manager with multi-account support, browser-only storage, and a modular ES module architecture.

## What changed

- The old multi-book model has been removed.
- Contacts now live directly under each user as `users[].contacts[]`.
- The main entry file, [js/script01.js](js/script01.js), now acts as an orchestrator only.
- Most business logic has been split into focused modules for auth, contacts, search, rendering, theme, import/export, country selection, and data persistence.

## Features

- **Multi-account**: separate login and independent contact lists per user.
- **Account management**: change password and delete account.
- **Admin seed**: `admin/admin` is created on first run if no users exist.
- **Contacts**: full name, international prefix + local number, email, optional age, optional avatar, tags, and favorites.
- **Prefix picker**: country dropdown with live search and flag icons.
- **Avatar modes**: upload, URL, or placeholder from initials.
- **Duplicate blocking**: by normalized email or international phone.
- **Search + filtering**: global search, favorites filter, tag filters, and pagination.
- **Theme toggle**: light/dark theme persisted in localStorage.
- **Import/export**: JSON backup and restore.
- **Persistence**: browser storage only, no backend.

## Setup

```bash
npm install
npm test
```

## Run

Open [index.html](index.html) directly in a browser. No server is required.

## Architecture

Main modules:

- [js/data-manager.js](js/data-manager.js): loading, saving, normalization, session state.
- [js/auth-manager.js](js/auth-manager.js): login, logout, password change, account deletion.
- [js/contact-manager.js](js/contact-manager.js): contact CRUD and form handling.
- [js/country-selector.js](js/country-selector.js): country dial code selection.
- [js/search-filter.js](js/search-filter.js): search, tags, favorites, pagination.
- [js/ui-renderer.js](js/ui-renderer.js): DOM rendering helpers.
- [js/import-export.js](js/import-export.js): JSON import/export.
- [js/theme-manager.js](js/theme-manager.js): theme persistence and toggle.
- [js/script01.js](js/script01.js): app bootstrap and event wiring.

## Storage

Stored in localStorage and sessionStorage using these keys:

- `rubrica-giolitti-app-data`: users, contacts, and persisted app data.
- `rubrica-giolitti-session`: active session state.
- `rubrica-theme`: selected theme.

Current app data shape:

```json
{
  "users": [
    {
      "id": "...",
      "username": "admin",
      "password": "admin",
      "isAdmin": true,
      "contacts": [
        {
          "id": "...",
          "fullName": "...",
          "countryCode": "+39",
          "countryIso": "it",
          "countryName": "Italy",
          "phoneLocal": "...",
          "phoneInternational": "+39 ...",
          "email": "...",
          "age": null,
          "avatar": "...",
          "avatarMode": "placeholder",
          "placeholderInitial": "A",
          "tags": ["work"],
          "isFavorite": false
        }
      ]
    }
  ]
}
```

Older `books[]` data is migrated transparently into the flat `contacts[]` structure when the app loads.

## Tests

Run:

```bash
npm test
```

The current test suite focuses on contact normalization and duplicate handling in [tests/contact-utils.test.mjs](tests/contact-utils.test.mjs).
