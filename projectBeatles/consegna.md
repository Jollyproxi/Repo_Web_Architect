# Sviluppare una landing page di una beatles
- utilizzando scss (impostare comandi attraverso i file package.json). 
- sito completamente responsive
- no bootstrap, solo scss puro


# Struttura
- header con logo e menu di navigazione
- sezione principale con immagine e testo di benvenuto
- sezione con informazioni sulla band (storia, membri, discografia)
    - ogni membro della band dovrebbe avere una scheda con foto, nome e ruolo in una pagina dedicata
    - ogni album della discografia dovrebbe avere una scheda con copertina, titolo e anno di uscita in una pagina dedicata
    - le pagine dedicate ai membri e agli album dovrebbero essere accessibili tramite link nella sezione principale
    - facendo hover su ogni scheda dei membri o degli album, dovrebbe apparire un breve riassunto delle informazioni principali in una card
- sezione con galleria di immagini
- footer con contatti e link ai social media


# Struttura del progetto
- index.html (landing page)
- members.html (pagina dedicata ai membri della band)
- albums.html (pagina dedicata alla discografia)
- css/
- scss/
    - main.scss (file principale che importa tutti gli altri)
    - _variables.scss (variabili per colori, font, ecc.)
    - _extendedselectors.scss (mixin per stili riutilizzabili)
    - _header.scss (stili per l'header)
    - _members.scss (stili per la sezione dei membri)
    - _albums.scss (stili per la sezione degli album)
    - _gallery.scss (stili per la galleria di immagini)
    - _footer.scss (stili per il footer)
- img/ (cartella per le immagini)
- js/ (cartella per eventuali script JavaScript, se necessari)


# indicazioni per i dati musicali    
-Per dati musicali usa la seguenre api MusicBrainz API per ottenere informazioni sui membri della band e sulla discografia. Puoi utilizzare fetch 
o axios per fare richieste HTTP e recuperare i dati necessari. Assicurati di gestire correttamente le risposte e di visualizzare le informazioni in modo chiaro e accattivante nelle pagine dedicate ai membri e agli album.

-Per i dati dei membri della band, puoi fare una richiesta alla MusicBrainz API utilizzando l'endpoint per gli artisti, specificando il nome della 
band (ad esempio, "The Beatles") per ottenere informazioni sui membri. Per la discografia, puoi utilizzare l'endpoint per le release dell'artista per ottenere informazioni sugli album pubblicati dalla band.

-Aggiungi anche in grigio un membro e info placeholder per pete best 

-Per la galleria di immagini 
    - usa coverartmachine API per ottenere le copertine degli album
    - usa last.fm e/o unsplash API per ottenere immagini della band e dei membri
- Assicurati di rispettare le limitazioni delle API e di gestire eventuali errori nelle richieste.

Metti link alle canzoni e album con MusicFetcher API per permettere agli utenti di ascoltare i brani direttamente dalla tua landing page. Puoi integrare i link alle canzoni e agli album nelle schede dei membri e degli album, offrendo un'esperienza interattiva e coinvolgente per gli utenti che visitano il tuo sito dedicato ai Beatles.
 

