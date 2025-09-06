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
    loadPanorama('assets/photos/exterior/german_town_street_4k.jpg');
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

// Panorama list & hotspots
const panoramas = [
  {
    url: 'assets/photos/exterior/german_town_street_4k.jpg',
    hotspots: [
      {pitch: 0, yaw: 90, type:'scene', text:'Menuju Derelict Airfield', target:1}
    ]
  },
  {
    url: 'assets/photos/exterior/derelict_airfield_01_4k.jpg',
    hotspots: [
      {pitch: 0, yaw: -90, type:'scene', text:'Kembali ke German Town Street', target:0}
    ]
  }
];

let currentPano = 0;

function loadPanorama(urlOrIndex){
  const panoContainer = document.getElementById('panorama-container');
  panoContainer.style.display='block';
  if(panoramaViewer){ panoramaViewer.destroy(); panoramaViewer=null; }

  if(typeof urlOrIndex==='number') currentPano = urlOrIndex;
  const panoData = (typeof urlOrIndex==='number') ? panoramas[urlOrIndex] : panoramas[0];

  panoramaViewer = pannellum.viewer('panorama-container', {
    type: 'equirectangular',
    panorama: panoData.url,
    autoLoad: true,
    compass: false,
    showControls: true,
    hotSpots: panoData.hotspots.map(h=>{
      return {
        pitch: h.pitch,
        yaw: h.yaw,
        type: h.type,
        text: h.text,
        clickHandlerFunc: ()=>{
          loadPanorama(h.target);
        }
      }
    })
  });
}

// Init
showScreen('landing');
