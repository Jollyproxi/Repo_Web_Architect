// data-manager.js
// Gestisce fetch MusicBrainz, helper immagini e fallback locali.
var DataManager = (function(){
  const MB_BASE = 'https://musicbrainz.org/ws/2';
  const CAA_BASE = 'https://coverartarchive.org/release-group';

  function safeText(value){
    return String(value || '').replace(/[<>&"]/g, '');
  }

  function buildSvgDataUri(label, accent = '#1b5e20'){
    const text = safeText(label).slice(0, 24) || 'The Beatles';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${text}">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="${accent}"/>
            <stop offset="100%" stop-color="#111"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#g)"/>
        <circle cx="400" cy="300" r="140" fill="rgba(255,255,255,0.15)"/>
        <text x="50%" y="56%" fill="#fff" font-family="Arial, sans-serif" font-size="48" text-anchor="middle">${text}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function buildUnsplashUrl(query, size = '900x900'){
    return `https://source.unsplash.com/${size}/?${encodeURIComponent(query)}`;
  }

  function buildCoverArtUrl(releaseGroupId){
    return `${CAA_BASE}/${encodeURIComponent(releaseGroupId)}/front-250`;
  }

  function buildMusicFetcherUrl(kind, query){
    const type = kind === 'album' ? 'release' : kind === 'member' ? 'artist' : 'recording';
    return `https://musicbrainz.org/search?type=${encodeURIComponent(type)}&query=${encodeURIComponent(query)}`;
  }

  function buildMusicFetcherLinks(title, artist = 'The Beatles'){
    const base = `${title} ${artist}`.trim();
    return {
      album: buildMusicFetcherUrl('album', base),
      track: buildMusicFetcherUrl('track', `${base}`),
      artist: buildMusicFetcherUrl('member', artist)
    };
  }

  function memberImage(member){
    const query = member.imageQuery || member.name;
    return buildUnsplashUrl(query);
  }

  function galleryImage(title, query){
    return {
      title,
      src: buildUnsplashUrl(query || title, '1200x800'),
      fallback: buildSvgDataUri(title, '#666')
    };
  }

  async function fetchArtistByName(name){
    const url = `${MB_BASE}/artist/?query=artist:%22${encodeURIComponent(name)}%22&fmt=json&limit=1`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok) return null;
      const data = await res.json();
      return data.artists && data.artists[0] ? data.artists[0] : null;
    }catch(e){
      console.warn('MusicBrainz artist fetch failed', e);
      return null;
    }
  }

  async function fetchReleaseGroupsByArtistMbid(mbid){
    const url = `${MB_BASE}/release-group?artist=${mbid}&fmt=json&limit=100&type=album`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok) return [];
      const data = await res.json();
      return data['release-groups'] || [];
    }catch(e){
      console.warn('MusicBrainz releases fetch failed', e);
      return [];
    }
  }

  async function fetchReleaseGroupById(id){
    const url = `${MB_BASE}/release-group/${encodeURIComponent(id)}?fmt=json`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok) return null;
      return await res.json();
    }catch(e){
      console.warn('MusicBrainz release-group fetch failed', e);
      return null;
    }
  }

  // Fallback locale per membri (include Pete Best come placeholder grigio)
  const localMembers = [
    {name:'John Lennon', role:'Voce, chitarra', imageQuery:'john lennon musician', bio:'Cantautore e membro fondatore.', summary:'Voce intensa, scrittura immediata e un ruolo centrale nella formazione del suono della band.'},
    {name:'Paul McCartney', role:'Voce, basso', imageQuery:'paul mccartney musician', bio:'Bassista, compositore e cantante.', summary:'Melodie memorabili, basso melodico e una delle voci più riconoscibili del rock.'},
    {name:'George Harrison', role:'Chitarra, voce', imageQuery:'george harrison guitarist', bio:'Chitarrista della band.', summary:'Chitarra elegante, sensibilità melodica e apertura verso la sperimentazione.'},
    {name:'Ringo Starr', role:'Batteria, voce', imageQuery:'ringo starr drummer', bio:'Batterista e voce.', summary:'Timing impeccabile, stile essenziale e presenza scenica inconfondibile.'},
    {name:'Pete Best', role:'Batteria (placeholder)', imageQuery:'pete best drummer', bio:'Membro iniziale della band (placeholder).', summary:'Scheda segnaposto in grigio per il batterista originale della prima formazione.', placeholder:true}
  ];

  const localAlbums = [
    {id:'please-please-me', title:'Please Please Me', year:'1963', summary:'Album di debutto con energia live e brani pop-rock essenziali.'},
    {id:'with-the-beatles', title:'With the Beatles', year:'1963', summary:'Secondo album, più maturo e con arrangiamenti vocali più ricchi.'},
    {id:'a-hard-days-night', title:"A Hard Day's Night", year:'1964', summary:'Colonna sonora e album chiave della prima fase della band.'},
    {id:'help', title:'Help!', year:'1965', summary:'Transizione verso una scrittura più personale e sofisticata.'}
  ];

  const localGallery = [
    galleryImage('The Beatles live', 'the beatles live concert'),
    galleryImage('Band portrait', 'the beatles portrait'),
    galleryImage('Studio session', 'the beatles studio'),
    galleryImage('Paul McCartney', 'paul mccartney portrait'),
    galleryImage('John Lennon', 'john lennon portrait'),
    galleryImage('Album covers', 'the beatles album covers')
  ];

  return {
    fetchArtistByName,
    fetchReleaseGroupsByArtistMbid,
    fetchReleaseGroupById,
    buildCoverArtUrl,
    buildSvgDataUri,
    buildMusicFetcherUrl,
    buildMusicFetcherLinks,
    memberImage,
    localMembers,
    localAlbums,
    localGallery
  };
})();

// Espone l'oggetto globalmente per essere usato dagli script caricati come classic scripts
window.DataManager = DataManager;

var MusicFetcher = (function(){
  function link(kind, title, artist = 'The Beatles'){
    return DataManager.buildMusicFetcherUrl(kind, `${title} ${artist}`.trim());
  }

  function album(title, artist = 'The Beatles'){
    return DataManager.buildMusicFetcherLinks(title, artist);
  }

  function member(name){
    return {
      artist: DataManager.buildMusicFetcherUrl('member', name),
      tracks: DataManager.buildMusicFetcherUrl('track', `${name} The Beatles`)
    };
  }

  return {album, member, link};
})();

window.MusicFetcher = MusicFetcher;

