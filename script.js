let scene, camera, renderer, controls, sphere;

// DOM Elements
const startButton = document.getElementById('start-tour');
const landing = document.getElementById('landing');
const tourMenu = document.getElementById('tour-menu');
const sceneContainer = document.getElementById('scene-container');
const infoCard = document.getElementById('info-card');
const tourButtons = document.querySelectorAll('.tour-btn');

// Start Tour
startButton.addEventListener('click', () => {
  tourMenu.style.display = 'block';
  landing.style.display = 'flex';
});

// Close Menu
function closeMenu() {
  tourMenu.style.display = 'none';
  landing.style.display = 'flex';
  if(sphere) sceneContainer.style.display = 'none';
}

// Load scene when menu clicked
tourButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const sceneName = btn.dataset.scene;
    startPhotoSphere(sceneName);
  });
});

// Photo Sphere images
const photoScenes = {
  exterior: ['assets/photos/exterior/PXL_20250906_031158762.PHOTOSPHERE.jpg'],
  ground: [], // nanti ditambah
  floor1: [],
  floor2: [],
  floor3: [],
  rooftop: []
};

let currentScene = 'exterior';
let currentIndex = 0;

// Initialize Three.js
function startPhotoSphere(sceneName) {
  currentScene = sceneName;
  currentIndex = 0;
  landing.style.display = 'none';
  tourMenu.style.display = 'none';
  sceneContainer.style.display = 'block';

  if(!scene) initThree();
  loadPhotoSphere(photoScenes[currentScene][currentIndex]);
}

// Three.js setup
function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight, 0.1, 1000
  );
  camera.position.set(0,0,0.1);

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  sceneContainer.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  animate();

  // Hotspot contoh
  addHotspot(0,0,"Logo Gedung","Ini adalah logo gedung Telkom University Surabaya.");
}

// Load Photo Sphere
let sphere;
function loadPhotoSphere(path) {
  if(sphere) scene.remove(sphere);
  const texture = new THREE.TextureLoader().load(path);
  const geometry = new THREE.SphereGeometry(500,60,40);
  geometry.scale(-1,1,1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);
}

// Hotspot
function addHotspot(x,y,title,text) {
  const div = document.createElement('div');
  div.className = 'hotspot';
  div.style.position = 'absolute';
  div.style.width = '20px';
  div.style.height = '20px';
  div.style.background = 'red';
  div.style.borderRadius = '50%';
  div.style.cursor = 'pointer';
  document.body.appendChild(div);

  div.addEventListener('click', () => {
    infoCard.style.display = 'block';
    infoCard.querySelector('.title').innerText = title;
    infoCard.querySelector('.text').innerText = text;
  });
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
}

// Resize
window.addEventListener('resize', () => {
  if(!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
