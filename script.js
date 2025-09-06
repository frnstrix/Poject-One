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
  currentPhotoIndex = 0;
});

menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');

  if(key==='exterior'){
    showScreen('scene');
    currentPhotoIndex = 0;
    loadPanorama(currentPhotoIndex);
    showNavButtons();
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
let currentPhotoIndex = 0;

// Tambahkan semua foto 360° di sini
const exteriorPhotos = [
  'https://drive.google.com/uc?export=view&id=1kc3p6VXO64BrQkefu9ivENQSplOgWlLN',
  'https://drive.google.com/uc?export=view&id=18J6F5O3kLi0F9KtfM0AKhn91Frs-RSYv'
];

function loadPanorama(index){
  const imageUrl = exteriorPhotos[index];
  const panoContainer = document.getElementById('panorama-container');
  panoContainer.style.display='block';
  document.getElementById('scene-canvas').style.display='none';

  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }

  panoramaViewer = pannellum.viewer('panorama-container', {
    type: 'equirectangular',
    panorama: imageUrl,
    autoLoad: true,
    compass: false,
    showControls: true
  });
}

// Navigation Buttons
function showNavButtons(){
  let btnPrev = document.getElementById('btn-prev');
  let btnNext = document.getElementById('btn-next');

  if(!btnPrev){
    btnPrev = document.createElement('button');
    btnPrev.id = 'btn-prev';
    btnPrev.className = 'btn btn-primary btn-fab';
    btnPrev.innerText = 'Prev';
    btnPrev.style.position='fixed';
    btnPrev.style.left='16px';
    btnPrev.style.bottom='16px';
    document.body.appendChild(btnPrev);
    addPress(btnPrev, ()=>{ navigatePhoto(-1); });
  }

  if(!btnNext){
    btnNext = document.createElement('button');
    btnNext.id = 'btn-next';
    btnNext.className = 'btn btn-primary btn-fab';
    btnNext.innerText = 'Next';
    btnNext.style.position='fixed';
    btnNext.style.right='16px';
    btnNext.style.bottom='16px';
    document.body.appendChild(btnNext);
    addPress(btnNext, ()=>{ navigatePhoto(1); });
  }
}

function navigatePhoto(delta){
  currentPhotoIndex += delta;
  if(currentPhotoIndex < 0) currentPhotoIndex = exteriorPhotos.length - 1;
  if(currentPhotoIndex >= exteriorPhotos.length) currentPhotoIndex = 0;
  loadPanorama(currentPhotoIndex);
}

// Init
showScreen('landing');
