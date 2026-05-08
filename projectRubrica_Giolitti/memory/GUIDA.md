
# GUIDA

## Uso dell'app

1. Accedi o crea un account dalla vista auth.
2. Dopo il login, la shell mostra lista contatti, ricerca e impostazioni account.
3. Usa il form per aggiungere o modificare un contatto.
4. Usa ricerca, preferiti e tag per filtrare la rubrica.
5. Esporta o importa i contatti dal pannello superiore.

## Comportamento contatti

- Il form valida nome, prefisso, telefono locale ed email.
- I duplicati sono bloccati su email e telefono internazionale.
- L'avatar può arrivare da file, URL o placeholder.
- Il modal dettaglio permette modifica ed eliminazione.
- L'eliminazione supporta undo tramite toast.

## Ricerca e filtri

- La ricerca globale lavora su nome, email, telefono internazionale ed età.
- I tag sono multi-selezione con logica OR.
- Il filtro preferiti mostra solo i contatti marcati.
- La paginazione usa 6 elementi per pagina.

## Import/export

- L'export produce un file JSON con username, data export e contatti dell'utente attivo.
- L'import sostituisce i contatti correnti solo dopo conferma.

## UI

- La search bar compare solo nella vista lista.
- Il toggle tema persiste su `rubrica-theme`.
- Il selector paese supporta bandiere e ricerca da tastiera.
