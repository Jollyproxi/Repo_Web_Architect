# Rubrica Personale - Quick Reference

Short guide for fast codebase navigation.

## What this app is

Client-only contact manager with Bootstrap UI, one JS entry file, no backend, and browser storage only.

## Main files

- [index.html](index.html): structure and controls.
- [css/style.css](css/style.css): theme and layout overrides.
- [js/script01.js](js/script01.js): all behaviour, state, storage, rendering.
- [tests/contact-utils.test.mjs](tests/contact-utils.test.mjs): utility tests.

## Storage

- Contacts and users: `localStorage` key `rubrica-giolitti-app-data`.
- Session: `sessionStorage` key `rubrica-giolitti-session`.
- Theme: `localStorage` key `rubrica-theme`.
- Contacts are not stored directly at the top level. They live at `users[].books[].contacts`.

## Current data shape

```js
{
  users: [
    {
      id,
      username,
      password,
      isAdmin,          // true only for admin/admin superuser
      books: [
        {
          id,
          name,
          contacts: [contact]
        }
      ]
    }
  ]
}
```

## Session tracking

Dual-field session state allows admin to view other users' books while retaining superuser privileges:

```js
sessionStorage: {
  loggedInUserId,   // actual authenticated user (never changes)
  userId,           // user being viewed (changes when admin switches)
  bookId            // book being viewed
}
```

For regular users: `loggedInUserId` === `userId`. For admin viewing others: they differ.

## Contact shape

Important fields:

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
- `createdBy`

## Main flow in `script01.js`

1. Load app data and session.
2. Resolve active user and active book.
3. Sync `state.contacts` from `activeBook.contacts`.
4. Render auth or app view.
5. On submit, validate and normalise input.
6. Prevent duplicates by normalised email or international phone.
7. Push or replace the contact in `state.contacts`.
8. Save back through `saveContacts()` -> `saveAppData()`.

## Key functions

- `loadAppData()`: reads `rubrica-giolitti-app-data`.
- `saveAppData()`: writes `appData.users` to `localStorage`.
- `loadSessionState()` / `saveSessionState()`: manage active user/book.
- `syncStateFromActiveBook()`: copies active book contacts into UI state.
- `handleSubmit()`: add/edit contact.
- `saveContacts()`: copies `state.contacts` back into the active book.
- `handleBookChange()`: switches active book.
- `handleChangePassword()`: changes active user password.
- `handleDeleteAccount()`: deletes active user and all their data.
- `seedAdminIfNeeded()`: seeds `admin/admin` superuser on first run with `isAdmin: true`.
- `isCurrentUserAdmin()`: checks if logged-in user has admin privileges (checks `loggedInUserId`).
- `handleBookChange()`: switches active book; if admin and value contains pipe (`|`), parses as `userId|bookId` for cross-user viewing.
- `handleLogout()`: clears session and UI state.

## Superuser (admin) capabilities

- On first run, if no users exist, `admin/admin` is seeded with `isAdmin: true`.
- Admin sees `(Admin)` label next to username in workspace bar.
- Admin dropdown shows all users' books: `username - bookname`.
- Admin can select any user's book to view their contacts.
- Admin retains superuser rights while viewing other users (dual session tracking).
- New Book and Account Settings buttons disabled when viewing other users (read-only mode).
- Regular users see only their own books in dropdown.

## UI notes

- Auth screen is `#authView`.
- App screen is `#appShell`.
- Search bar is `#searchBar` and is transparent.
- Dark mode is high contrast and handled in `css/style.css`.

## Behaviour worth knowing

- No backend exists.
- No cloud sync exists.
- Data is per browser/device/origin.
- `sessionStorage` does not hold contacts.
- If DevTools shows an empty `contacts` array, nothing has been saved for that book yet.

## Tests

Run:

```bash
npm test
```

## If you need the fast answer

- Where are contacts saved? `localStorage -> rubrica-giolitti-app-data -> users[].books[].contacts`
- Why can storage look empty? Wrong origin, no saved contact yet, or wrong book/user.

