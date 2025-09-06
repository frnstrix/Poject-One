function loadExteriorPhotoSphere() {
    initThree();  // pastikan scene Three.js sudah siap
    showScreen('scene');  // tampilkan canvas scene

    const url = 'https://drive.google.com/uc?export=view&id=1kc3p6VXO64BrQkefu9ivENQSplOgWlLN';

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1,1,1);  // balik ke dalam sphere

    const loader = new THREE.TextureLoader();
    loader.load(
        url,
        function(texture) {
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const sphere = new THREE.Mesh(geometry, material);

            // Hapus model lama jika ada
            if(currentModel) { cleanupModel(currentModel); scene.remove(currentModel); currentModel=null; }

            currentModel = sphere;
            scene.add(sphere);

            camera.position.set(0,0,0.1);  // posisi kamera di tengah sphere
            controls.target.set(0,0,0);
            controls.update();
        },
        undefined,
        function(err){ console.error('Gagal load photo sphere:', err); }
    );
}

// Ganti event klik menu tampak luar gedung
menuGrid.addEventListener('click',(e)=>{
    const btn = e.target.closest('button[data-model]');
    if(!btn) return;
    const modelKey = btn.getAttribute('data-model');

    if(modelKey==='exterior'){
        loadExteriorPhotoSphere();
    } else {
        loadModel(modelKey);  // tetap pakai GLB untuk lantai lain (sementara)
    }
});
