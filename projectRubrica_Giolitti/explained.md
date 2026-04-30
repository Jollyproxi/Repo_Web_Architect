# Rubrica Personale - Quick Reference

Assistant-first reference for fast codebase navigation.

## What this app is

Client-only contact manager with Bootstrap UI, modular ES modules, no backend, and browser storage only.

## Main files

- [index.html](index.html): UI structure and controls.
- [css/style.css](css/style.css): theme and layout overrides.
- [js/script01.js](js/script01.js): bootstrap, DOM wiring, orchestration.
- [js/data-manager.js](js/data-manager.js): data loading, saving, migration, session.
- [js/contact-manager.js](js/contact-manager.js): CRUD and form handling.
- [js/search-filter.js](js/search-filter.js): search, tags, favorites, pagination.
- [tests/contact-utils.test.mjs](tests/contact-utils.test.mjs): utility tests.

## Storage

- `rubrica-giolitti-app-data`: users and contacts in localStorage.
- `rubrica-giolitti-session`: active session in sessionStorage.
- `rubrica-theme`: theme preference in localStorage.
- Contacts live under `users[].contacts[]`.

## Current data shape

```js
{
  users: [
    {
      id,
      username,
      password,
      isAdmin,
      contacts: [
        {
          id,
          fullName,
          countryCode,
          countryIso,
          countryName,
          phoneLocal,
          phoneInternational,
          email,
          age,
          avatar,
          avatarMode,
          placeholderInitial,
          tags,
          isFavorite
        }
      ]
    }
  ]
}
```

Legacy `books[]` data is migrated into `contacts[]` on load.

## Session tracking

Session state now tracks the active authenticated user only. There is no separate address-book layer anymore. `admin/admin` is still the seeded superuser.

## Contact shape

Key fields:

- `id`
- `fullName`
- `countryCode`
- `countryIso`
- `countryName`
- `phoneLocal`
- `phoneInternational`
- `email`
- `age`
- `avatar`
- `avatarMode`
- `placeholderInitial`
- `tags`
- `isFavorite`

## Main flow in `script01.js`

1. Load app data and session state.
2. Resolve the active user.
3. Sync `contactState.contacts` from the user.
4. Render auth or app view.
5. Validate and normalize contact input.
6. Block duplicates by normalized email or international phone.
7. Save through `saveContacts()` and `saveAppData()`.
8. Re-render search, tags, and pagination.

## Key functions

- `loadAppData()`: read persisted app data.
- `saveAppData()`: write current app data.
- `loadSessionState()` / `updateSessionState()`: manage session state.
- `getActiveUser()`: resolve the current user.
- `seedAdminIfNeeded()`: seed `admin/admin` once.
- `isCurrentUserAdmin()`: check admin status.
- `syncStateFromUser()`: copy active user contacts into UI state.
- `handleSubmitContact()`: add or edit a contact.
- `saveContacts()`: persist contact state back to the user.
- `handleAuthSubmit()`: login and account creation.
- `handleLogout()`: clear session and UI state.
- `handleChangePassword()`: update the current password.
- `handleDeleteAccount()`: delete the current user.

## UI notes

- `#authView`: auth screen.
- `#appShell`: app shell.
- `#searchBar`: global search.
- `#tagFilterContainer`: tag filters.
- Theme code: [js/theme-manager.js](js/theme-manager.js).

## Behaviour worth knowing

- No backend exists.
- No cloud sync exists.
- Data is per browser, device, and origin.
- `sessionStorage` does not hold contacts.
- Empty `contacts[]` means nothing has been saved for that user yet.

## Tests

```bash
npm test
```

## Live Server Testing

```bash
npx live-server --port=5500
```

All features tested and working (April 30, 2026):
- ✅ Auth (register, login, logout)
- ✅ Contact CRUD
- ✅ Search + filters
- ✅ Theme toggle
- ✅ Import/export

## Critical Fix Points

**If contacts don't render after adding/updating:**

1. Check that `applySearchAndRender()` is called in:
   - `saveContact()` in [js/script01.js](js/script01.js) (after `showListView()`)
   - `handleAuthSubmitWrapper()` in [js/script01.js](js/script01.js) (in the showListViewCallback)
   - `bootstrapApp()` in [js/script01.js](js/script01.js) (on page load if user is logged in)

2. Check form field names in [index.html](index.html):
   - `#authForm` inputs must be `name="username"` and `name="password"` (not `authUsername`/`authPassword`)
   - `#contactForm` inputs match the form read in `handleSubmitContact()`

3. Verify localStorage is not full or blocked by browser

**If search doesn't work:**
- Check that `searchState.filteredContacts` is populated by `applySearch()`
- Check that `getPageContacts()` returns from `searchState.filteredContacts` (not from `contactState.contacts`)

**If localStorage shows empty after page reload:**
- Check browser console for errors
- Verify session was not cleared (check `rubrica-giolitti-session`)
- Check that `loadSessionState()` and `getActiveUser()` return valid user



