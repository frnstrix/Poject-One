// Screens
const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene')
};
const bg = document.getElementById('bg');

// Tombol
const btnStart = document.getElementById('btn-start');
const btnCloseMenu = document.getElementById('btn-close-menu');
const menuGrid = document.querySelector('.menu-grid');
const btnBack = document.getElementById('btn-back');

addPress(btnStart, ()=>showScreen('menu'));
addPress(btnCloseMenu, ()=>showScreen('landing'));
addPress(btnBack, ()=>{
  showScreen('menu');
  document.getElementById('scene-canvas').style.display='block';
  document.getElementById('panorama-container').style.display='none';
  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; currentPanoramaIndex=0; }
});

// Event menu
menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');

  if(key==='exterior'){
    showScreen('scene');
    loadPanoramaArray(exteriorPhotos);
  } else {
    alert('Foto 360° belum tersedia untuk menu ini.');
  }
});

// Function show screen
function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('is-active', key===name);
  });
  bg.style.opacity = (name==='scene')?'0':'1';
  bg.style.pointerEvents = (name==='scene')?'none':'auto';
}

// Helper tombol
function addPress(el, fn){
  el.addEventListener('pointerup', e=>{
    e.preventDefault(); fn();
  }, {passive:false});
}

// Panorama
let panoramaViewer = null;
let currentPanoramaIndex = 0;
const exteriorPhotos = [
  'assets/photos/exterior/derelict_airfield_01_4k.hdr',
  'assets/photos/exterior/plac_wolnosci_4k.hdr'
];

function loadPanoramaArray(photos){
  currentPanoramaIndex = 0;
  loadPanorama(photos[currentPanoramaIndex]);

  // Tambahkan tombol navigasi jika belum ada
  let container = document.getElementById('scene');
  if(!document.getElementById('btn-prev')){
    const btnPrev = document.createElement('button');
    btnPrev.id = 'btn-prev';
    btnPrev.innerText = 'Prev';
    btnPrev.className = 'btn btn-primary btn-fab';
    btnPrev.style.position = 'fixed';
    btnPrev.style.left = '16px';
    btnPrev.style.bottom = '16px';
    btnPrev.addEventListener('pointerup', ()=>{
      currentPanoramaIndex = (currentPanoramaIndex-1+photos.length)%photos.length;
      loadPanorama(photos[currentPanoramaIndex]);
    });
    container.appendChild(btnPrev);

    const btnNext = document.createElement('button');
    btnNext.id = 'btn-next';
    btnNext.innerText = 'Next';
    btnNext.className = 'btn btn-primary btn-fab';
    btnNext.style.position = 'fixed';
    btnNext.style.right = '16px';
    btnNext.style.bottom = '16px';
    btnNext.addEventListener('pointerup', ()=>{
      currentPanoramaIndex = (currentPanoramaIndex+1)%photos.length;
      loadPanorama(photos[currentPanoramaIndex]);
    });
    container.appendChild(btnNext);
  }
}

function loadPanorama(imageUrl){
  // Hide 3D canvas
  document.getElementById('scene-canvas').style.display='none';

  // Tambahkan container panorama jika belum ada
  let panoContainer = document.getElementById('panorama-container');
  if(!panoContainer){
    panoContainer = document.createElement('div');
    panoContainer.id = 'panorama-container';
    panoContainer.style.width = '100%';
    panoContainer.style.height = '100%';
    panoContainer.style.position = 'absolute';
    panoContainer.style.top = '56px'; // offset topbar
    document.getElementById('scene').appendChild(panoContainer);
  }
  panoContainer.style.display='block';

  // Destroy viewer lama
  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }

  // Load foto 360°
  panoramaViewer = pannellum.viewer('panorama-container', {
    type: 'equirectangular',
    panorama: imageUrl,
    autoLoad: true,
    compass: false,
    showControls: true
  });
}

// Init
showScreen('landing');
