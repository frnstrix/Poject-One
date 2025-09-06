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
addPress(btnStart, ()=>showScreen('menu'));
addPress(btnCloseMenu, ()=>showScreen('landing'));
menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');
  startPhotoSphere(key);
});

function addPress(el,fn){
  el.addEventListener('pointerup',e=>{ e.preventDefault(); fn(); },{passive:false});
}

// Three.js
let scene,camera,renderer,controls,sphere;
const canvasWrap=document.getElementById('scene-canvas');
const btnBack=document.getElementById('btn-back');
const loadingEl=document.getElementById('loading');
addPress(btnBack, ()=>{
  showScreen('menu');
  if(sphere){ scene.remove(sphere); sphere=null; }
});

const sphereMap = {
  exterior:'assets/photos/exterior/PXL_20250906_031158762.PHOTOSPHERE.jpg'
};

function initThree(){
  if(renderer) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, getW()/getH(), 0.1, 1000);
  camera.position.set(0,0,0.1);
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(getW(), getH());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  canvasWrap.appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  animate();
}

function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); }
function getW(){ return window.innerWidth; }
function getH(){ return Math.max(0, window.innerHeight-56); }
window.addEventListener('resize', ()=>{
  if(!camera||!renderer)return;
  camera.aspect = getW()/getH();
  camera.updateProjectionMatrix();
  renderer.setSize(getW(), getH());
});

// Photo Sphere
function startPhotoSphere(key){
  initThree(); showScreen('scene'); loadingEl.classList.remove('hidden');
  if(sphere){ scene.remove(sphere); sphere=null; }
  const url = sphereMap[key];
  if(!url){ console.warn('Foto tidak tersedia'); loadingEl.classList.add('hidden'); return; }

  const texture = new THREE.TextureLoader().load(url, ()=>{
    loadingEl.classList.add('hidden');
  });
  const geometry = new THREE.SphereGeometry(500,60,40);
  geometry.scale(-1,1,1);
  const material = new THREE.MeshBasicMaterial({map:texture});
  sphere = new THREE.Mesh(geometry,material);
  scene.add(sphere);
  camera.position.set(0,0,0.1);
  controls.target.set(0,0,0);
  controls.update();
}

// Init awal
showScreen('landing');
