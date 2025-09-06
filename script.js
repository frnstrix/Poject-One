// ------ Helper toggle screen ------
const screens = {
  landing: document.getElementById('landing'),
  menu: document.getElementById('menu'),
  scene: document.getElementById('scene'),
};
const bg = document.getElementById('bg');

function showScreen(name){
  Object.entries(screens).forEach(([key, el])=>{
    el.classList.toggle('is-active', key === name);
  });
  // background hanya untuk landing & menu
  bg.style.opacity = (name === 'scene') ? '0' : '1';
  bg.style.pointerEvents = (name === 'scene') ? 'none' : 'auto';
}

// ------ Buttons ------
const btnStart = document.getElementById('btn-start');
const btnCloseMenu = document.getElementById('btn-close-menu');
const menuGrid = document.querySelector('.menu-grid');

addPress(btnStart, ()=> showScreen('menu'));
addPress(btnCloseMenu, ()=> showScreen('landing'));

// Delegasi klik untuk tombol model
menuGrid.addEventListener('click',(e)=>{
  const btn = e.target.closest('button[data-model]');
  if(!btn) return;
  const key = btn.getAttribute('data-model');
  loadModel(key);
});

// Utility untuk mobile (pointerup lebih stabil)
function addPress(el, fn){
  el.addEventListener('pointerup', (e)=>{ e.preventDefault(); fn(); }, {passive:false});
}

// ------ three.js setup ------
let scene, camera, renderer, controls, currentModel;
const canvasWrap = document.getElementById('scene-canvas');
const btnBack = document.getElementById('btn-back');
const loadingEl = document.getElementById('loading');

addPress(btnBack, ()=>{
  // kembali ke menu
  showScreen('menu');
  // hapus model dari scene
  if(currentModel){
    cleanupModel(currentModel);
    scene.remove(currentModel);
    currentModel = null;
  }
});

function initThree(){
  if(renderer) return; // prevent re-init
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0d0d);

  camera = new THREE.PerspectiveCamera(60, getW()/getH(), 0.1, 2000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(getW(), getH());
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;

  const ambient = new THREE.AmbientLight(0xffffff, .7);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, .9);
  dir.position.set(8, 16, 8);
  dir.castShadow = false;
  scene.add(dir);

  animate();
}
function animate(){
  requestAnimationFrame(animate);
  if(controls) controls.update();
  if(renderer && scene && camera) renderer.render(scene, camera);
}

function getW(){ return window.innerWidth; }
function getH(){ return Math.max(0, window.innerHeight - 56); } // minus topbar

window.addEventListener('resize', ()=>{
  if(!camera || !renderer) return;
  camera.aspect = getW()/getH();
  camera.updateProjectionMatrix();
  renderer.s
