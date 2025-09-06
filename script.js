// ===== Landing Page "Mulai Tur" =====
// Landing "Mulai Tur"
const startButton = document.getElementById('start-tour');
const landing = document.getElementById('landing');
const sceneContainer = document.getElementById('scene-container');
@@ -8,10 +8,10 @@ startButton.addEventListener('click', () => {
landing.style.display = 'none';
sceneContainer.style.display = 'block';
tourMenu.style.display = 'block';
  initScene(); // mulai Three.js scene
  initScene();
});

// ===== Three.js Setup =====
// Three.js Setup (placeholder cube)
let scene, camera, renderer, controls;

function initScene() {
@@ -25,15 +25,12 @@ function initScene() {
renderer.setSize(window.innerWidth, window.innerHeight);
sceneContainer.appendChild(renderer.domElement);

  // Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,10,5);
scene.add(light);

  // Controls
controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Placeholder cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
@@ -42,20 +39,16 @@ function initScene() {
animate();
}

// Render Loop
function animate() {
requestAnimationFrame(animate);
if(controls) controls.update();
if(renderer && scene && camera) renderer.render(scene, camera);
}

// ===== Model switching (placeholder) =====
function showModel(modelName){
console.log("Load model:", modelName);
  // nanti load GLB sesuai model pilihan
}

// Resize
window.addEventListener('resize', () => {
if(camera && renderer){
camera.aspect = window.innerWidth/window.innerHeight;
