const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene')
};
const bg = document.getElementById('bg');
const loadingEl = document.getElementById('loading');
const canvasWrap = document.getElementById('scene-canvas');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

let scene, camera, renderer, controls;
let sphere = null;
let currentFolder = '';
let photos = [];
let currentIndex = 0;

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
addPress(btnStart, ()=>showScreen('menu'));
addPress(btnCloseMenu, ()=>showScreen('landing'));

menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  loadFolderPhotos(btn.getAttribute('data-model'));
});

addPress(btnBack, ()=>{
  showScreen('menu');
  cleanupSphere();
});
addPress(btnNext, ()=>nextPhoto());
addPress(btnPrev, ()=>prevPhoto());

function addPress(el,fn){
  el.addEventListener('pointerup', e=>{ e.preventDefault(); fn(); }, {passive:false});
}

// --- Three.js Init ---
function initThree(){
  if(renderer) return;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d0d);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 2000);
  camera.position.set(0,0,0.1);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.enablePan = false;

  scene.add(new THREE.AmbientLight(0xffffff,0.7));
  const dir = new THREE.DirectionalLight(0xffffff,0.9);
  dir.position.set(8,16,8); scene.add(dir);

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

// --- Sphere Photo ---
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
  // Sementara manual 1 foto dulu
  photos.push(`assets/photos/${folderName}/PXL_20250906_031158762.PHOTOSPHERE.jpg`);
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
      geometry.scale(-1,1,1);
      const material = new THREE.MeshBasicMaterial({map:texture});
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      camera.position.set(0,0,0.1);
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

function nextPhoto(){
  if(!photos.length) return;
  currentIndex = (currentIndex+1)%photos.length;
  loadCurrentPhoto();
}
function prevPhoto(){
  if(!photos.length) return;
  currentIndex = (currentIndex-1+photos.length)%photos.length;
  loadCurrentPhoto();
}

// Arrow keys support
document.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight') nextPhoto();
  if(e.key==='ArrowLeft') prevPhoto();
});

// Init Landing
showScreen('landing');
