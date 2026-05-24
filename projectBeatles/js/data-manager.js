// data-manager.js
var DataManager = (function(){
  const MB_BASE = 'https://musicbrainz.org/ws/2';
  const CAA_BASE = 'https://coverartarchive.org/release-group';
  const AUDIODB_BASE = 'https://www.theaudiodb.com/api/v1/json/2';
  const portraitCache = new Map();

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

  async function resolveMemberPortrait(member){
    if(!member) return buildSvgDataUri('The Beatles', '#1b5e20');
    const cacheKey = member.name || member.role || 'unknown-member';
    if(portraitCache.has(cacheKey)) return portraitCache.get(cacheKey);

    let src = null;
    if(member.placeholder){
      src = buildSvgDataUri(member.name, '#666');
    }else{
      src = await fetchArtistLogoByName(member.name);
      if(!src && member.imageQuery){
        src = buildUnsplashUrl(member.imageQuery);
      }
      if(!src){
        src = buildSvgDataUri(member.name, '#1b5e20');
      }
    }

    portraitCache.set(cacheKey, src);
    return src;
  }

  function galleryImage(title, query){
    return {
      title,
      src: buildUnsplashUrl(query || title, '1200x800')
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
    // default: fetch albums; allow type override by passing string like 'album' or 'single'
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

  // Fetch release-groups by artist mbid and optional type (album, single, ep)
  async function fetchReleaseGroupsByArtistMbidType(mbid, type = 'album'){
    const url = `${MB_BASE}/release-group?artist=${encodeURIComponent(mbid)}&fmt=json&limit=200&type=${encodeURIComponent(type)}`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok) return [];
      const data = await res.json();
      return data['release-groups'] || [];
    }catch(e){
      console.warn('MusicBrainz release-groups fetch failed', e);
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

  // Fetch recordings (tracks) for a given release-group id: find a release and request its recordings
  async function fetchRecordingsByReleaseGroup(releaseGroupId){
    try{
      const rgUrl = `${MB_BASE}/release-group/${encodeURIComponent(releaseGroupId)}?inc=releases&fmt=json`;
      const rgRes = await fetch(rgUrl, {headers:{'Accept':'application/json'}});
      if(!rgRes.ok) return [];
      const rgData = await rgRes.json();
      const releases = rgData.releases || [];
      if(releases.length === 0) return [];
      // pick the first release with id
      const releaseId = releases[0].id;
      if(!releaseId) return [];
      const relUrl = `${MB_BASE}/release/${encodeURIComponent(releaseId)}?inc=recordings&fmt=json`;
      const relRes = await fetch(relUrl, {headers:{'Accept':'application/json'}});
      if(!relRes.ok) return [];
      const relData = await relRes.json();
      // tracks are under media[].tracks
      const media = relData.media || [];
      const tracks = media.flatMap(m => (m.tracks || []).map(t => ({
        title: t.title,
        length: t.length,
        position: t.position,
        recordingId: t.recording && t.recording.id ? t.recording.id : null
      })));
      return tracks;
    }catch(e){
      console.warn('MusicBrainz recordings fetch failed', e);
      return [];
    }
  }

  // Fetch recordings by artist MBID (search recordings endpoint)
  async function fetchRecordingsByArtistMbid(mbid, limit = 500){
    const url = `${MB_BASE}/recording?artist=${encodeURIComponent(mbid)}&fmt=json&limit=${encodeURIComponent(limit)}`;
    try{
      const res = await fetch(url, {headers:{'Accept':'application/json'}});
      if(!res.ok) return [];
      const data = await res.json();
      return data.recordings || [];
    }catch(e){
      console.warn('MusicBrainz recordings by artist fetch failed', e);
      return [];
    }
  }

  async function fetchArtistLogoByName(name){
    const urls = [
      `${AUDIODB_BASE}/search.php?s=${encodeURIComponent(name)}`,
      `${AUDIODB_BASE}/artist.php?strArtist=${encodeURIComponent(name)}`
    ];
    for(const url of urls){
      try{
        const res = await fetch(url, {headers:{'Accept':'application/json'}});
        if(!res.ok) continue;
        const data = await res.json();
        if(data.artists && data.artists[0] && data.artists[0].strArtistThumb){
          return data.artists[0].strArtistThumb;
        }
      }catch(e){
        console.warn('AudioDB artist logo fetch failed', e);
      }
    }
    return null;
  }

  // Fallback locale per membri (include Pete Best come placeholder grigio)
  const localMembers = [
    {
      name:'John Lennon',
      role:'Voce, chitarra',
      imageQuery:'john lennon musician',
      bio:'Cantautore e membro fondatore dei Beatles (1940-1980).',
      summary:'Voce intensa, scrittura immediata e un ruolo centrale nella formazione del suono della band.',
      biography:'John Winston Lennon nacque a Liverpool nel 1940. Insieme a Paul McCartney, George Harrison e Stuart Sutcliffe fondò i Beatles nel 1960. Era il songwriting partner principale di Paul, noto per il suo approccio sperimentale alla musica. Dopo lo scioglimento della band nel 1970, pursue una carriera solista, collaborando nel 1969 con Yoko Ono. Assassinato a New York nel 1980, rimane una figura iconica della musica rock.'
    },
    {
      name:'Paul McCartney',
      role:'Voce, basso',
      imageQuery:'paul mccartney musician',
      bio:'Bassista, compositore e cantante, membro fondatore.',
      summary:'Melodie memorabili, basso melodico e una delle voci più riconoscibili del rock.',
      biography:'Paul James McCartney nacque a Liverpool nel 1942. Divenne il cantante e bassista principale dei Beatles dopo Stuart Sutcliffe, contribuendo con melodie iconiche come "Yesterday" e "Let It Be". Compositore prolifico insieme a John, Paul ha continuato la carriera solista dopo il 1970, formando il gruppo "Wings" e pubblicando 50+ album. Rimane uno dei musicisti più influenti e prolifici della storia della musica.'
    },
    {
      name:'George Harrison',
      role:'Chitarra, voce',
      imageQuery:'george harrison guitarist',
      bio:'Chitarrista della band dal 1958 al 1970.',
      summary:'Chitarra elegante, sensibilità melodica e apertura verso la sperimentazione.',
      biography:'George Harold Harrison nacque a Liverpool nel 1943. Inizialmente il "quietissimo" Beatle, gradualmente emerse come songwriter principale durante la fine degli anni 60, contribuendo capolavori come "Here Comes the Sun" e "While My Guitar Gently Weeps". Specializzato nel raga indiano, influenzato dalla musica maharishi, portò una dimensione spirituale ai Beatles. Continuò la carriera solista fino alla sua morte nel 2001.'
    },
    {
      name:'Ringo Starr',
      role:'Batteria, voce',
      imageQuery:'ringo starr drummer',
      bio:'Batterista principale dal 1962 al 1970.',
      summary:'Timing impeccabile, stile essenziale e presenza scenica inconfondibile.',
      biography:'Richard Starkey (Ringo Starr) nacque a Liverpool nel 1940. Unì i Beatles come batterista nel 1962, sostituendo Pete Best. Dotato di un stile di batteria minimalista ma efficace, Ringo portò solidità ritmica alle canzoni della band. Conosciuto anche per la sua personalità carismatica e gli accenni vocali, continuò la carriera solista e televisiva dopo il 1970, pubblicando nel 2020 il suo 19° album.'
    },
    {
      name:'Pete Best',
      role:'Batteria (placeholder)',
      imageQuery:'pete best drummer',
      bio:'Membro iniziale della band (1960-1962).',
      summary:'Scheda segnaposto in grigio per il batterista originale della prima formazione.',
      biography:'Pete Best fu il batterista originale dei Beatles dal 1960 al 1962, periodo cruciale della loro evoluzione. Sebbene fosse una figura popolare tra i fan di Liverpool, venne rimpiazzato da Ringo Starr nel 1962. Successivamente suonò con vari gruppi e lavorò nelle industrie cinematografica e ferroviaria. La sua partecipazione ai dischi dei Beatles (anche se non accreditato) rimane parte della storia della band.',
      placeholder:true
    }
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
    fetchReleaseGroupsByArtistMbidType,
    fetchReleaseGroupById,
    fetchRecordingsByReleaseGroup,
    fetchRecordingsByArtistMbid,
    fetchArtistLogoByName,
    buildCoverArtUrl,
    buildSvgDataUri,
    buildMusicFetcherUrl,
    buildMusicFetcherLinks,
    resolveMemberPortrait,
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

