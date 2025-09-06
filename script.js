// Screens
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
    loadPanoramaArray(exteriorPhotos);
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
const exteriorPhotos = [
  'assets/photos/exterior/derelict_airfield_01_4k.jpg',
  'assets/photos/exterior/german_town_street_4k.jpg'
];
let currentIndex = 0;

function loadPanoramaArray(arr){
  if(arr.length===0) return;
  currentIndex = 0;
  loadPanorama(arr, currentIndex);
}

function loadPanorama(arr, index){
  const container = document.getElementById('panorama-container');
  container.style.display='block';

  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }

  panoramaViewer = pannellum.viewer('panorama-container', {
    type: 'equirectangular',
    panorama: arr[index],
    autoLoad: true,
    compass: false,
    showControls: false
  });

  // hapus panah sebelumnya
  const oldArrows = container.querySelectorAll('.pano-arrow');
  oldArrows.forEach(el=>el.remove());

  // tambahkan panah in-image jika ada foto sebelumnya/selanjutnya
  if(index>0) createArrowOverlay(container,'left', ()=>loadPanorama(arr,index-1));
  if(index<arr.length-1) createArrowOverlay(container,'right', ()=>loadPanorama(arr,index+1));
}

function createArrowOverlay(container, direction, onClick){
  const arrow = document.createElement('div');
  arrow.className = 'pano-arrow ' + direction;
  arrow.innerHTML = direction==='left' ? '&#9664;' : '&#9654;'; // ◄ ►
  arrow.addEventListener('pointerup', onClick);
  container.appendChild(arrow);
}

// Init
showScreen('landing');
