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
  if(key==='exterior'){
    startPhotoSphere(key);
  } else {
    loadModel(key);
  }
});

function addPress(el,fn){
  el.addEventListener('pointerup',e=>{ e.preventDefault(); fn(); },{passive:false});
}

// Three.js
let scene,camera,renderer,controls,currentModel,sphere;
const canvasWrap=document.getElementById('scene-canvas');
const btnBack=document.getElementById('btn-back');
const loadingEl=document.getElementById('loading');
addPress(btnBack, ()=>{
  showScreen('menu');
  cleanupModel();
  cleanupSphere();
});

function cleanupModel(){
  if(currentModel){
    scene.remove(currentModel);
    currentModel.traverse(obj=>{
      if(obj.isMesh){
        obj.geometry?.dispose?.();
        if(Array.isArray(obj.material)){
          obj.material.forEach(m=>m?.dispose?.());
        } else obj.material?.dispose?.();
      }
    });
    currentModel = null;
  }
}

function cleanupSphere(){
  if(sphere){
    scene.remove(sphere);
    sphere.geometry.dispose();
    sphere.material.dispose();
    sphere = null;
  }
}

// Init Three.js
function initThree(){
  if(renderer) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, getW()/getH(), 0.1, 1500);
  camera.position.set(0,0,0.1);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(getW(), getH());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  canvasWrap.innerHTML = '';
  canvasWrap.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = -0.25;

  scene.add(new THREE.AmbientLight(0xffffff,0.5));

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

// GLTF Loader untuk lantai lain
const loader = new THREE.GLTFLoader();
function loadModel(key){
  initThree(); showScreen('scene'); loadingEl.classList.remove('hidden');
  const map={
    ground:'assets/models/ground.glb',
    floor1:'assets/models/floor1.glb',
    floor2:'assets/models/floor2.glb',
    floor3:'assets/models/floor3.glb',
    rooftop:'assets/models/rooftop.glb'
  };
  const url=map[key];
  if(!url){ console.warn('Model tidak tersedia'); loadingEl.classList.add('hidden'); return; }
  cleanupModel();
  loader.load(url,(gltf)=>{
    currentModel=gltf.scene;
    currentModel.position.set(0,0,0); currentModel.scale.set(1,1,1);
    scene.add(currentModel);

    const box=new THREE.Box3().setFromObject(currentModel);
    const size=box.getSize(new THREE.Vector3()).length();
    const center=box.getCenter(new THREE.Vector3());
    controls.target.copy(center);
    camera.position.copy(center).add(new THREE.Vector3(size*0.2,size*0.25,size*0.35));
    camera.near=Math.max(0.1,size/500); camera.far=Math.max(1000,size*5);
    camera.updateProjectionMatrix(); controls.update();
    loadingEl.classList.add('hidden');
  },undefined,(err)=>{
    console.error('Gagal load model:',err); loadingEl.classList.add('hidden');
  });
}

// Photo Sphere map
const sphereMap = {
  exterior:'assets/photos/exterior/PXL_20250906_031158762.PHOTOSPHERE.jpg'
};

// Photo Sphere loader
function startPhotoSphere(key){
  const url = sphereMap[key];
  if(!url){ console.warn('Foto tidak tersedia'); return; }

  showScreen('scene');
  loadingEl.classList.remove('hidden');
  initThree();
  cleanupSphere();
  cleanupModel();

  new THREE.TextureLoader().load(url,
    texture=>{
      loadingEl.classList.add('hidden');

      const geometry = new THREE.SphereGeometry(500, 64, 64);
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
      console.error('Gagal load foto:', err);
      loadingEl.classList.add('hidden');
    }
  );
}

// Init awal
showScreen('landing');
