const startButton = document.getElementById('start-tour');
const landing = document.getElementById('landing');
const sceneContainer = document.getElementById('scene-container');
const tourMenu = document.getElementById('tour-menu');

startButton.addEventListener('click', () => {
  landing.style.display = 'none';
  sceneContainer.style.display = 'block';
  tourMenu.style.display = 'block';
  initScene();
});

let scene, camera, renderer, controls;

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0,2,5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneContainer.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,10,5);
  scene.add(light);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Placeholder cube
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if(controls) controls.update();
  if(renderer && scene && camera) renderer.render(scene, camera);
}

function showModel(modelName){
  console.log("Load model:", modelName);
}

window.addEventListener('resize', () => {
  if(camera && renderer){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});
