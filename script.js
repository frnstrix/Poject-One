// --- Screens & Background ---
const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene')
};
const bg = document.getElementById('bg');
const loadingEl = document.getElementById('loading');
const canvasWrap = document.getElementById('scene-canvas');
const btnBack = document.getElementById('btn-back');
const menuGrid = document.querySelector('.menu-grid');
const btnStart = document.getElementById('btn-start');
const btnCloseMenu = document.getElementById('btn-close-menu');

function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('is-active', key===name);
  });
  bg.style.opacity = (name==='scene')?'0':'1';
  bg.style.pointerEvents = (name==='scene')?'none':'auto';
}

// --- Button Actions ---
function addPress(el, fn){
  el.addEventListener('pointerup', e=>{ e.preventDefault(); fn(); }, {passive:false});
}

addPress(btnStart, ()=>showScreen('menu'));
addPress(btnCloseMenu, ()=>showScreen('landing'));
addPress(btnBack, ()=>{
  showScreen('menu');
  cleanupSphere();
});

// --- PhotoSphere ---
let scene, camera, renderer, controls, sphere=null;
let currentFolder='', photos=[], currentIndex=0;

function initThree(){
  if(renderer) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.set(0,0,0.01);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.4;
  controls.zoomSpeed = 0.6;

  animate();
}

function animate(){
  requestAnimationFrame(animate);
  if(controls) controls.update();
  if(renderer) renderer.render(scene,camera);
}

window.addEventListener('resize', ()=>{
  if(!camera||!renderer) return;
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- PhotoSphere Functions ---
function cleanupSphere(){
  if(sphere){
    scene.remove(sphere);
    sphere.geometry.dispose();
    sphere.material.dispose();
    sphere = null;
  }
}

function loadFolderPhotos(folderName){
  currentFolder = folderName;
  currentIndex = 0;
  photos = [];
  if(folderName==='exterior'){
    photos.push('assets/photos/exterior/PXL_20250906_031158762.PHOTOSPHERE.jpg');
  }
  // nanti bisa tambah otomatis scan folder
  showScreen('scene');
  loadCurrentPhoto();
}

function loadCurrentPhoto(){
  if(!photos.length) return;
  const url = photos[currentIndex];
  loadingEl.classList.remove('hidden');
  initThree();
  cleanupSphere();

  new THREE.TextureLoader().load(url,
    texture=>{
      loadingEl.classList.add('hidden');
      const geometry = new THREE.SphereGeometry(500,64,64);
      geometry.scale(-1,1,1); // Tekstur di dalam sphere
      const material = new THREE.MeshBasicMaterial({map:texture});
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      camera.position.set(0,0,0.01);
      controls.target.set(0,0,0);
      controls.update();
    },
    undefined,
    err=>{
      console.error('Gagal load foto:',err);
      loadingEl.classList.add('hidden');
    }
  );
}

// Menu klik photo
menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  loadFolderPhotos(btn.getAttribute('data-model'));
});

// Init Landing
showScreen('landing');
