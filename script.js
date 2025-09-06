const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene')
};
const bg = document.getElementById('bg');

function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('is-active', key===name);
  });
  bg.style.opacity = (name==='scene')?'0':'1';
  bg.style.pointerEvents = (name==='scene')?'none':'auto';
}

// Buttons
const btnStart = document.getElementById('btn-start');
const btnCloseMenu = document.getElementById('btn-close-menu');
const menuGrid = document.querySelector('.menu-grid');
const btnBack = document.getElementById('btn-back');

addPress(btnStart, ()=>showScreen('menu'));
addPress(btnCloseMenu, ()=>showScreen('landing'));
addPress(btnBack, ()=>{
  showScreen('menu');
  document.getElementById('panorama-container').style.display='none';
  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }
});

menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');

  if(key==='exterior'){
    showScreen('scene');
    loadPanorama([
      'assets/photos/exterior/derelict_airfield_01_4k.hdr',
      'assets/photos/exterior/plac_wolnosci_4k.hdr'
    ]);
  } else {
    alert('Foto 360° belum tersedia untuk menu ini.');
  }
});

function addPress(el, fn){
  el.addEventListener('pointerup', e=>{
    e.preventDefault(); fn();
  }, {passive:false});
}

// Panorama
let panoramaViewer = null;
let panoIndex = 0;
let panoImages = [];

function loadPanorama(images){
  document.getElementById('scene-canvas').style.display='none';
  const panoContainer = document.getElementById('panorama-container');
  panoContainer.style.display='block';
  panoImages = images;
  panoIndex = 0;
  loadCurrentPano();
}

function loadCurrentPano(){
  const panoContainer = document.getElementById('panorama-container');
  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }
  panoramaViewer = pannellum.viewer('panorama-container', {
    type: 'equirectangular',
    panorama: panoImages[panoIndex],
    autoLoad: true,
    showControls: true
  });
}

// Next/Prev in-image arrows (keyboard)
document.addEventListener('keydown', (e)=>{
  if(!panoramaViewer) return;
  if(e.key==='ArrowRight'){
    panoIndex = (panoIndex + 1) % panoImages.length;
    loadCurrentPano();
  }
  if(e.key==='ArrowLeft'){
    panoIndex = (panoIndex - 1 + panoImages.length) % panoImages.length;
    loadCurrentPano();
  }
});

// Init
showScreen('landing');
