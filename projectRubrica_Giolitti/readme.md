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

## Testing Report (April 30, 2026)

Full live-server testing completed successfully with all features validated.

### Test Results ✅

| Feature | Status | Notes |
|---------|--------|-------|
| **Theme Toggle** | ✅ PASS | Light/dark mode, icon changes, localStorage persistence |
| **Authentication** | ✅ PASS | Register, login, logout with credential validation |
| **Contact Create** | ✅ PASS | New contacts saved and rendered with all fields |
| **Contact Read** | ✅ PASS | Grid display with avatar, email, phone, age, tags |
| **Contact Update** | ✅ PASS | Edit form pre-populated, changes persist |
| **Contact Delete** | ✅ PASS | Confirmation dialog, deletion with success message |
| **Search** | ✅ PASS | Search by name, email, phone working |
| **Tag Filter** | ✅ PASS | Filter by tags, dynamic tag updates |
| **Favorite Filter** | ✅ PASS | Toggle favorite, filter by favorites |
| **Import/Export** | ✅ PASS | Export contacts JSON, import button ready |

### Bug Fixes Applied

1. **Auth Form Input Names** (index.html)
   - Changed: `name="authUsername"` → `name="username"`
   - Changed: `name="authPassword"` → `name="password"`
   - **Issue**: Form submission handler was reading `event.target.username` but HTML had different names
   - **Fix**: Updated to match expected form field names

2. **Missing Render After Contact Save** (js/script01.js)
   - Added: `applySearchAndRender()` in `saveContact()` function
   - **Issue**: Contacts were saved to storage but not rendered in UI
   - **Fix**: Calls search filter and pagination render after save

3. **Missing Render After Login** (js/script01.js)
   - Added: `applySearchAndRender()` in `handleAuthSubmitWrapper()` callback
   - **Issue**: Existing contacts were not displayed after login
   - **Fix**: Ensures contacts render immediately after authentication

4. **Missing Render on App Bootstrap** (js/script01.js)
   - Added: `applySearchAndRender()` in `bootstrapApp()` function
   - **Issue**: Page reload with logged-in user showed empty contact list
   - **Fix**: Renders persisted contacts on page load

### How to Run Tests

1. Start live-server:
   ```bash
   npx live-server --port=5500
   ```

2. Open browser at the provided URL

3. Test sequence:
   - Register new user or login with `admin/admin`
   - Test theme toggle (sun/moon icon)
   - Add/edit/delete contacts
   - Test search and filters
   - Test favorite toggle
   - Test export feature

### Test Data

Created during testing:
- User: `davide` / `test123`
- Contacts: Mario Rossi (work, friend tags), Anna Bianchi (family tag)

The current test suite focuses on contact normalization and duplicate handling in [tests/contact-utils.test.mjs](tests/contact-utils.test.mjs).
