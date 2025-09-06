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
  removeArrows();
});

menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');

  if(key==='exterior'){
    showScreen('scene');
    loadPanorama([
      'assets/photos/exterior/german_town_street_4k.jpg',
      'assets/photos/exterior/derelict_airfield_01_4k.jpg'
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
  document.getElementById('panorama-container').style.display='block';
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
  addArrows();
}

// Panah in-image
function addArrows(){
  removeArrows();
  const container = document.getElementById('panorama-container');
  const next = document.createElement('div');
  next.className = 'pano-arrow';
  next.style.right = '20px';
  next.style.top = '50%';
  next.innerHTML = '→';
  next.onclick = ()=>{ panoIndex = (panoIndex+1) % panoImages.length; loadCurrentPano();}
  container.appendChild(next);

  const prev = document.createElement('div');
  prev.className = 'pano-arrow';
  prev.style.left = '20px';
  prev.style.top = '50%';
  prev.innerHTML = '←';
  prev.onclick = ()=>{ panoIndex = (panoIndex-1+panoImages.length) % panoImages.length; loadCurrentPano();}
  container.appendChild(prev);
}

function removeArrows(){
  document.querySelectorAll('.pano-arrow').forEach(el=>el.remove());
}

// Init
showScreen('landing');
