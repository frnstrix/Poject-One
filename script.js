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
  loadModel(btn.getAttribute('data-model'));
});

function addPress(el,fn){
  el.addEventListener('pointerup',e=>{ e.preventDefault(); fn(); },{passive:false});
}

// Three.js
let scene,camera,renderer,controls,currentModel;
const canvasWrap=document.getElementById('scene-canvas');
const btnBack=document.getElementById('btn-back');
const loadingEl=document.getElementById('loading');
addPress(btnBack, ()=>{
  showScreen('menu');
  if(currentModel){ cleanupModel(currentModel); scene.remove(currentModel); currentModel=null; }
});

function initThree(){
  if(renderer) return;
  scene=new THREE.Scene(); scene.background=new THREE.Color(0x0d0d0d);
  camera=new THREE.PerspectiveCamera(60,getW()/getH(),0.1,2000); camera.position.set(0,2,5);
  renderer=new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); renderer.setSize(getW(),getH());
  canvasWrap.appendChild(renderer.domElement);
  controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true; controls.dampingFactor=0.08; controls.enablePan=false;
  scene.add(new THREE.AmbientLight(0xffffff,.7));
  const dir=new THREE.DirectionalLight(0xffffff,.9); dir.position.set(8,16,8); scene.add(dir);
  animate();
}
function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); }
function getW(){ return window.innerWidth; }
function getH(){ return Math.max(0, window.innerHeight-56); }
window.addEventListener('resize',()=>{
  if(!camera||!renderer)return;
  camera.aspect=getW()/getH(); camera.updateProjectionMatrix();
  renderer.setSize(getW(),getH());
});

const loader = new THREE.GLTFLoader();
function cleanupModel(root){
  root.traverse(obj=>{
    if(obj.isMesh){
      obj.geometry?.dispose?.();
      if(Array.isArray(obj.material)){
        obj.material.forEach(m=>m?.dispose?.());
      } else obj.material?.dispose?.();
    }
  });
}

function loadModel(key){
  initThree(); showScreen('scene'); loadingEl.classList.remove('hidden');
  const map={
    exterior:'https://drive.google.com/uc?export=download&id=1qKcLI61PORdAKXi7Lj_HnmHVR20Vh3Fu',
    ground:'assets/models/ground.glb',
    floor1:'assets/models/floor1.glb',
    floor2:'assets/models/floor2.glb',
    floor3:'assets/models/floor3.glb',
    rooftop:'assets/models/rooftop.glb'
  };
  const url=map[key];
  if(!url){ console.warn('Model tidak tersedia'); loadingEl.classList.add('hidden'); return; }
  if(currentModel){ cleanupModel(currentModel); scene.remove(currentModel); currentModel=null; }
  loader.load(url,(gltf)=>{
    currentModel=gltf.scene;
    currentModel.position.set(0,0,0); currentModel.scale.set(1,1,1); scene.add(currentModel);
    try{
      const box=new THREE.Box3().setFromObject(currentModel);
      const size=box.getSize(new THREE.Vector3()).length();
      const center=box.getCenter(new THREE.Vector3());
      controls.target.copy(center);
      camera.position.copy(center).add(new THREE.Vector3(size*0.2,size*0.25,size*0.35));
      camera.near=Math.max(0.1,size/500); camera.far=Math.max(1000,size*5);
      camera.updateProjectionMatrix(); controls.update();
    }catch(e){}
    loadingEl.classList.add('hidden');
  },undefined,(err)=>{ console.error('Gagal load model:',err); loadingEl.classList.add('hidden'); });
}

// Init awal
showScreen('landing');
