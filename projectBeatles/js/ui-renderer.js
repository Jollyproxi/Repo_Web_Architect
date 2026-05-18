// ui-renderer.js
// Usa DataManager esposto globalmente
var UIRenderer = (function(){
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

  function renderMembers(target){
    const container = document.querySelector(target);
    if(!container) return;

    container.innerHTML = '';
    DataManager.localMembers.forEach(member => {
      const links = MusicFetcher.member(member.name);
      const card = document.createElement('article');
      card.className = `member-card${member.placeholder ? ' placeholder' : ''}`;

      card.innerHTML = `
        <img class="thumb" src="${DataManager.memberImage(member)}" alt="${member.name}">
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
      container.appendChild(card);
    });
  }

  async function renderAlbums(target){
    const container = document.querySelector(target);
    if(!container) return;
    container.innerHTML = '<p>Caricamento in corso…</p>';

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
        <p>${release.summary || 'Album della discografia dei Beatles.'}</p>
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
    container.innerHTML = '<p>Caricamento galleria…</p>';

    let items = DataManager.localGallery;
    const artist = await DataManager.fetchArtistByName('The Beatles');
    if(artist && artist.id){
      const releases = await DataManager.fetchReleaseGroupsByArtistMbid(artist.id);
      const liveCovers = (releases || []).slice(0, 4).map(release => ({
        title: release.title,
        src: DataManager.buildCoverArtUrl(release.id),
        fallback: DataManager.buildSvgDataUri(release.title, '#c62828')
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

  function renderMemberDetail(target, name){
    const member = DataManager.localMembers.find(m => m.name === name);
    const container = document.querySelector(target);
    if(!container) return;

    if(!member){
      container.innerHTML = `<p>Membro non trovato: ${name}</p>`;
      return;
    }

    const links = MusicFetcher.member(member.name);
    container.innerHTML = `
      <article class="member-card detail">
        <img class="thumb" src="${DataManager.memberImage(member)}" alt="${member.name}">
        <div class="info">
          <h2>${member.name}</h2>
          <div class="role">${member.role}</div>
          <p>${member.bio}</p>
          <p>${member.summary}</p>
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
    container.innerHTML = '<p>Caricamento informazioni…</p>';

    const release = await DataManager.fetchReleaseGroupById(id);
    const fallback = DataManager.localAlbums.find(album => album.id === id) || DataManager.localAlbums[0];
    const title = release?.title || fallback.title || 'Album';
    const year = release?.['first-release-date'] ? new Date(release['first-release-date']).getFullYear() : fallback.year || 'n.d.';
    const links = MusicFetcher.album(title);

    container.innerHTML = `
      <article class="album-card detail">
        <img class="cover" src="${release?.id ? DataManager.buildCoverArtUrl(release.id) : DataManager.buildSvgDataUri(title, '#c62828')}" alt="${title}">
        <div class="info">
          <h2>${title}</h2>
          <div class="meta">${year}</div>
          <p>${release?.disambiguation || fallback.summary || 'Scheda album della discografia dei Beatles.'}</p>
          <div class="actions">
            ${createButton('Torna alla discografia', 'albums.html', 'btn')}
            ${createButton('Ascolta album', links.album, 'btn ghost', true)}
          </div>
        </div>
      </article>
    `;
    const img = container.querySelector('img');
    applyFallbackImage(img, title, '#c62828');
  }

  return {renderMembers, renderAlbums, renderGallery, renderMemberDetail, renderAlbumDetail};
})();

// Espone funzioni globali per uso da script classici
window.UIRenderer = UIRenderer;
