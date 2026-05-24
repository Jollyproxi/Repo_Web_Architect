// ui-renderer.js
// Usa DataManager esposto globalmente
var UIRenderer = (function(){
  function showLoadingSpinner(container){
    container.innerHTML = `
      <div class="state-message state-message--loading" role="status" aria-live="polite">
        <p class="state-message__title">⏳ Caricamento in corso…</p>
      </div>
    `;
  }

  function showError(container, message){
    container.innerHTML = `
      <div class="state-message state-message--error" role="alert">
        <p class="state-message__title">⚠️ ${message}</p>
        <p class="state-message__note">Utilizziamo dati offline come fallback.</p>
      </div>
    `;
  }

  function createButton(label, href, className, external){
    const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `<a class="${className}" href="${href}"${target}>${label}</a>`;
  }

  function applyFallbackImage(img, fallbackLabel, accent){
    img.addEventListener('error', function onError(){
      if(img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = '1';
      img.src = DataManager.buildSvgDataUri(fallbackLabel, accent);
    });
  }

  async function renderMembers(target){
    const container = document.querySelector(target);
    if(!container) return;

    showLoadingSpinner(container);
    const cards = await Promise.all(DataManager.localMembers.map(async member => {
      const links = MusicFetcher.member(member.name);
      const card = document.createElement('article');
      card.className = `member-card${member.placeholder ? ' placeholder' : ''}`;
      const portrait = await DataManager.resolveMemberPortrait(member);

      card.innerHTML = `
        <img class="thumb" src="${portrait}" alt="Ritratto di ${member.name}">
        <div class="info">
          <h4>${member.name}</h4>
          <div class="role">${member.role}</div>
          <p>${member.bio}</p>
          <div class="actions">
            ${createButton('Scheda', `member.html?name=${encodeURIComponent(member.name)}`, 'btn')}
            ${createButton('Ascolta brani', links.tracks, 'btn ghost', true)}
          </div>
        </div>
        <div class="member-overlay"><div><strong>${member.name}</strong><div>${member.summary}</div></div></div>
      `;

      const img = card.querySelector('img');
      applyFallbackImage(img, member.name, member.placeholder ? '#666' : '#1b5e20');
      card.addEventListener('click', event => {
        if(event.target.closest('a')) return;
        window.location.href = `member.html?name=${encodeURIComponent(member.name)}`;
      });
      return card;
    }));

    container.innerHTML = '';
    cards.forEach(card => container.appendChild(card));
  }

  async function renderAlbums(target){
    const container = document.querySelector(target);
    if(!container) return;
    showLoadingSpinner(container);

    const artist = await DataManager.fetchArtistByName('The Beatles');
    let releases = [];
    if(artist && artist.id){
      releases = await DataManager.fetchReleaseGroupsByArtistMbid(artist.id);
    }

    if(!releases || releases.length === 0){
      releases = DataManager.localAlbums;
    }

    container.innerHTML = '';
    releases.slice(0, 12).forEach(release => {
      const title = release.title || release.name;
      const year = release['first-release-date'] ? new Date(release['first-release-date']).getFullYear() : (release.year || 'n.d.');
      const links = MusicFetcher.album(title);
      const card = document.createElement('article');
      card.className = 'album-card';
      card.innerHTML = `
        <img class="cover" src="${release.id && release['first-release-date'] !== undefined ? DataManager.buildCoverArtUrl(release.id) : DataManager.buildSvgDataUri(title, '#c62828')}" alt="${title}">
        <h4>${title}</h4>
        <div class="meta">${year}</div>
         <p>${release.disambiguation || release.summary || 'Album della discografia dei Beatles.'}</p>
        <div class="actions">
          ${createButton('Dettagli', `album.html?id=${encodeURIComponent(release.id)}`, 'btn')}
          ${createButton('Ascolta album', links.album, 'btn ghost', true)}
        </div>
      `;

      const img = card.querySelector('img');
      applyFallbackImage(img, title, '#c62828');
      card.addEventListener('click', event => {
        if(event.target.closest('a')) return;
        window.location.href = `album.html?id=${encodeURIComponent(release.id)}`;
      });
      container.appendChild(card);
    });
  }

  async function renderGallery(target){
    const container = document.querySelector(target);
    if(!container) return;
    showLoadingSpinner(container);

    let items = DataManager.localGallery;
    const artist = await DataManager.fetchArtistByName('The Beatles');
    if(artist && artist.id){
      const releases = await DataManager.fetchReleaseGroupsByArtistMbid(artist.id);
      const liveCovers = (releases || []).slice(0, 4).map(release => ({
        title: release.title,
        src: DataManager.buildCoverArtUrl(release.id)
      }));
      items = [...liveCovers, ...DataManager.localGallery.slice(0, 2)];
    }

    container.innerHTML = '';
    items.forEach(item => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.innerHTML = `
        <img src="${item.src}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>
      `;
      const img = figure.querySelector('img');
      applyFallbackImage(img, item.title, '#666');
      container.appendChild(figure);
    });
  }

  async function renderMemberDetail(target, name){
    const member = DataManager.localMembers.find(m => m.name === name);
    const container = document.querySelector(target);
    if(!container) return;

    showLoadingSpinner(container);

    if(!member){
      showError(container, `Membro "${name}" non trovato in archivio.`);
      return;
    }

    const links = MusicFetcher.member(member.name);
    const portrait = await DataManager.resolveMemberPortrait(member);
    container.innerHTML = `
      <article class="member-card detail">
        <img class="thumb" src="${portrait}" alt="Ritratto di ${member.name}">
        <div class="info">
          <h2>${member.name}</h2>
          <div class="role">${member.role}</div>
          <p>${member.bio}</p>
          <p>${member.summary}</p>
          <p>${member.biography || ''}</p>
          <div class="actions">
            ${createButton('Torna ai membri', 'members.html', 'btn')}
            ${createButton('Ascolta canzoni', links.tracks, 'btn ghost', true)}
          </div>
        </div>
      </article>
    `;
    const img = container.querySelector('img');
    applyFallbackImage(img, member.name, member.placeholder ? '#666' : '#1b5e20');
  }

  async function renderAlbumDetail(target, id){
    const container = document.querySelector(target);
    if(!container) return;
    showLoadingSpinner(container);

    const release = await DataManager.fetchReleaseGroupById(id);
    const fallback = DataManager.localAlbums.find(album => album.id === id) || DataManager.localAlbums[0];
    const title = release?.title || fallback.title || 'Album';
    const year = release?.['first-release-date'] ? new Date(release['first-release-date']).getFullYear() : fallback.year || 'n.d.';
    const links = MusicFetcher.album(title);

    // render basic album info
    container.innerHTML = `
      <article class="album-card detail">
        <img class="cover" src="${release?.id ? DataManager.buildCoverArtUrl(release.id) : DataManager.buildSvgDataUri(title, '#c62828')}" alt="${title}">
        <div class="info">
          <h2>${title}</h2>
          <div class="meta">${year}</div>
           <p>${release?.disambiguation || release?.summary || fallback.summary || 'Scheda album della discografia dei Beatles.'}</p>
          <div class="actions">
            ${createButton('Torna alla discografia', 'albums.html', 'btn')}
            ${createButton('Ascolta album', links.album, 'btn ghost', true)}
          </div>
        </div>
      </article>
    `;
    const img = container.querySelector('img');
    applyFallbackImage(img, title, '#c62828');

    // fetch and render tracks for this album (release-group)
    const tracks = await DataManager.fetchRecordingsByReleaseGroup(id);
    const tracksSection = document.createElement('section');
    tracksSection.className = 'tracks container';
    tracksSection.innerHTML = `<h3>Tracce</h3>`;
    if(!tracks || tracks.length === 0){
      tracksSection.innerHTML += `<p>Tracce non disponibili.</p>`;
    }else{
      const ul = document.createElement('ol');
      ul.style.paddingLeft = '1.1rem';
      tracks.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.position ? t.position + '. ' : ''}${t.title}${t.length ? ' (' + Math.round((t.length/1000)) + 's)' : ''}`;
        ul.appendChild(li);
      });
      tracksSection.appendChild(ul);
    }
    container.appendChild(tracksSection);
  }

  // Render a full songs page with search and filters
  async function renderSongs(target){
    const container = document.querySelector(target);
    if(!container) return;
    showLoadingSpinner(container);

    const artist = await DataManager.fetchArtistByName('The Beatles');
    let recordings = [];
    if(artist && artist.id){
      recordings = await DataManager.fetchRecordingsByArtistMbid(artist.id, 1000);
    }
    // map minimal metadata and fallbacks
    recordings = (recordings || []).map(r => ({
      id: r.id,
      title: r.title,
      length: r.length,
      releases: r.releases || [],
      firstRelease: (r.releases && r.releases[0]) ? r.releases[0].title : ''
    }));

    container.innerHTML = `
      <div class="container">
        <h2>All Songs</h2>
        <div class="song-controls">
          <input id="songSearch" placeholder="Cerca titolo, album...">
          <select id="albumFilter"><option value="">Tutti gli album</option></select>
        </div>
        <div id="songsList" class="songs-grid"></div>
      </div>
    `;

    const listEl = container.querySelector('#songsList');
    const searchEl = container.querySelector('#songSearch');
    const albumFilter = container.querySelector('#albumFilter');

    // helper: format length ms -> mm:ss
    function fmtLen(ms){
      if(!ms) return '';
      const s = Math.round(ms/1000);
      const mm = Math.floor(s/60); const ss = s%60;
      return `${mm}:${ss.toString().padStart(2,'0')}`;
    }

    // build album dropdown
    const albumsSet = new Map();
    recordings.forEach(r => {
      const name = (r.releases && r.releases[0] && r.releases[0].title) ? r.releases[0].title : r.firstRelease || '';
      if(name) albumsSet.set(name, true);
    });
    Array.from(albumsSet.keys()).sort().forEach(a => {
      const opt = document.createElement('option'); opt.value = a; opt.textContent = a; albumFilter.appendChild(opt);
    });

    function renderCards(items){
      listEl.innerHTML = '';
      if(!items || items.length === 0){
        listEl.innerHTML = '<p>Nessun brano trovato.</p>';
        return;
      }
      items.forEach(it => {
        const card = document.createElement('article');
        card.className = 'song-card';
        const album = (it.releases && it.releases[0]) ? it.releases[0].title : it.firstRelease || '';
        const releaseDate = (it.releases && it.releases[0] && it.releases[0]['date']) ? it.releases[0]['date'] : '';
        card.innerHTML = `
          <h4>${it.title}</h4>
          <div class="song-meta">
            <div class="meta-row">
              ${album ? '<span class="badge">Album: ' + album + '</span>' : ''}
              ${releaseDate ? '<span class="badge">Anno: ' + (new Date(releaseDate).getFullYear() || releaseDate) + '</span>' : ''}
              ${it.length ? '<span class="badge">Durata: ' + fmtLen(it.length) + '</span>' : ''}
            </div>
            <div class="meta-row" style="margin-top:.45rem;">
              ${it.id ? '<span class="badge">ID: ' + it.id + '</span>' : ''}
            </div>
          </div>
          <div class="song-actions">
            ${createButton('Cerca su MusicBrainz', MusicFetcher.link('track', it.title + ' ' + (album || 'The Beatles')), 'btn ghost', true)}
          </div>
        `;
        listEl.appendChild(card);
      });
    }

    renderCards(recordings);

    function applyFilters(){
      const q = (searchEl.value || '').toLowerCase().trim();
      const albumVal = albumFilter.value;
      const filtered = recordings.filter(r => {
        const title = (r.title||'').toLowerCase();
        const albumName = ((r.releases && r.releases[0] && r.releases[0].title) || r.firstRelease || '').toLowerCase();
        const matchesQ = !q || title.includes(q) || albumName.includes(q);
        const matchesAlbum = !albumVal || albumName === albumVal.toLowerCase();
        return matchesQ && matchesAlbum;
      });
      renderCards(filtered);
    }

    searchEl.addEventListener('input', applyFilters);
    albumFilter.addEventListener('change', applyFilters);
  }

  // Render singles (release-groups type single)
  async function renderSingles(target){
    const container = document.querySelector(target);
    if(!container) return;
    showLoadingSpinner(container);
    const artist = await DataManager.fetchArtistByName('The Beatles');
    let singles = [];
    if(artist && artist.id){
      singles = await DataManager.fetchReleaseGroupsByArtistMbidType(artist.id, 'single');
    }
    if(!singles || singles.length === 0){
      container.innerHTML = '<p>Nessun singolo disponibile.</p>';
      return;
    }
    container.innerHTML = '<div class="container"><h2>Singles</h2><div class="albums-grid" id="singlesGrid"></div></div>';
    const grid = container.querySelector('#singlesGrid');
    singles.slice(0, 200).forEach(sg => {
      const card = document.createElement('article');
      card.className = 'album-card';
      const title = sg.title || sg.name || 'Singolo';
       card.innerHTML = `
         <img class="cover" src="${sg.id ? DataManager.buildCoverArtUrl(sg.id) : DataManager.buildSvgDataUri(title, '#6a1b9a')}" alt="${title}">
         <h4>${title}</h4>
         <div class="meta">${sg['first-release-date'] ? new Date(sg['first-release-date']).getFullYear() : ''}</div>
         <p>${sg.disambiguation || 'Singolo della discografia dei Beatles.'}</p>
         <div class="actions">
           ${createButton('Dettagli', `album.html?id=${encodeURIComponent(sg.id)}`, 'btn')}
         </div>
       `;
      const img = card.querySelector('img');
      applyFallbackImage(img, title, '#6a1b9a');
      grid.appendChild(card);
    });
  }

  return {renderMembers, renderAlbums, renderGallery, renderMemberDetail, renderAlbumDetail, renderSongs, renderSingles};
})();

// Espone funzioni globali per uso da script classici
window.UIRenderer = UIRenderer;
