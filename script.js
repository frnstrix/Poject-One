document.addEventListener("DOMContentLoaded", () => {

  const startButton = document.getElementById('start-tour');
  const tourMenu = document.getElementById('tour-menu');
  const landing = document.getElementById('landing');
  const sceneContainer = document.getElementById('scene-container');
  const closeMenuBtn = document.getElementById('close-menu');

  let scene, camera, renderer, controls, currentModel;
  const loader = new THREE.GLTFLoader();

  // ----- Start Tour: tampilkan menu overlay -----
  startButton.addEventListener('click', () => {
    tourMenu.style.display = 'flex'; // overlay + menu muncul
  });

  // ----- Close Menu: balik ke landing -----
  closeMenuBtn.addEventListener('click', () => {
    tourMenu.style.display = 'none';
    landing.style.display = 'flex';
    sceneContainer.style.display = 'none';
  });

  // ----- Inisialisasi Three.js -----
  function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // ----- Load GLTF Model -----
  window.showModel = function(lantai) {
    if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse((child)=>{
        if(child.isMesh){
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      currentModel = null;
    }

    sceneContainer.style.display = 'block';
    landing.style.display = 'none';
    tourMenu.style.display = 'none';

    let path = '';
    switch(lantai){
      case 'exterior': path='assets/models/exterior.glb'; break;
      case 'ground': path='assets/models/ground.glb'; break;
      case 'floor1': path='assets/models/floor1.glb'; break;
      case 'floor2': path='assets/models/floor2.glb'; break;
      case 'floor3': path='assets/models/floor3.glb'; break;
      case 'rooftop': path='assets/models/rooftop.glb'; break;
      default: console.log('Model tidak tersedia'); return;
    }

    loader.load(
      path,
      (gltf)=>{ currentModel=gltf.scene; scene.add(currentModel); currentModel.position.set(0,0,0); currentModel.scale.set(1,1,1); },
      undefined,
      (err)=>{ console.error('Error load model:',err); }
    );
  };

  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  initThree();
});
