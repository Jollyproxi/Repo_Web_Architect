
# DECISIONS

## Why this structure exists

- `localStorage` e `sessionStorage` sono sufficienti per il requisito didattico e mantengono l'app autonoma.
- La separazione per moduli evita un unico file monolitico.
- La distinzione admin/non-admin serve per mostrare lettura globale e salvataggio per utente.
- Il file `explained.md` è stato declassato a puntatore per lasciare la documentazione viva nei file di memoria.

## Data decisions

- `createdBy` è la chiave per ricostruire la proprietà dei contatti quando l'admin salva.
- `lastDeleted` vive in sessione per rendere l'undo temporaneo.
- I tag sono normalizzati in minuscolo per confronti stabili.
