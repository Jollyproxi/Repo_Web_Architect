document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.split('/').pop();
  if(path === '' || path === 'index.html'){
    window.UIRenderer.renderGallery('#galleryGrid');
    return;
  }
  if(path === 'members.html'){
    window.UIRenderer.renderMembers('#membersGrid');
  }
  if(path === 'albums.html'){
    window.UIRenderer.renderAlbums('#albumsGrid');
  }
  if(path === 'member.html'){
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    window.UIRenderer.renderMemberDetail('#memberDetail', name);
  }
  if(path === 'album.html'){
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    window.UIRenderer.renderAlbumDetail('#albumDetail', id);
  }
});

