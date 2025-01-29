const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1100/600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg-container"), antialias: true });
renderer.setSize(1100, 600);
console.log(window.innerHeight)
console.log(window.innerWidth)

// Create a floating 3D Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Window Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
