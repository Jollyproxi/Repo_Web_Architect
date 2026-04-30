# Rubrica Personale

Client-side contact manager with multi-account support, per-account address books, and browser-only storage.

## Features

- **Multi-account**: separate login + independent address books per user.
- **Account management**: change password, delete account.
- **Superuser**: `admin/admin` seeded on first run. Admin can view/access all users' books while retaining privileges.
- **Admin viewing**: dropdown shows all users' books; admin can switch between accounts; read-only when viewing others.
- **Contacts**: full name, international prefix + local number, email, optional age, optional avatar.
- **Prefix picker**: country dropdown with live search and flag icons.
- **Avatar modes**: upload (base64), URL, or automatic placeholder from initials.
- **Duplicate blocking**: by normalised email or international phone.
- **Search + pagination**: 6 per page, global search on name/email/phone/age.
- **Dark mode**: high-contrast theme toggle, persisted.
- **CRUD**: add, edit, delete, full form validation.
- **Persistence**: browser `localStorage` only, no server.

## Setup

```bash
npm install
npm test         # runs normalisation and duplicate tests
```

## Run

Open `index.html` directly in a browser (no server needed).

## Data

Stored in `localStorage` key `rubrica-giolitti-app-data`:

```json
{
  "users": [
    {
      "id": "...",
      "username": "admin",
      "password": "admin",
      "isAdmin": true,
      "books": [
        {
          "id": "...",
          "name": "Rubrica principale",
          "contacts": [
            { "id": "...", "fullName": "...", "email": "...", "phoneInternational": "...", ... }
          ]
        }
      ]
    },
    {
      "id": "...",
      "username": "testuser",
      "password": "...",
      "isAdmin": false,
      "books": []
    }
  ]
}
```

See [explained.md](explained.md) for quick code reference and storage layout.
