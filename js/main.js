let scene, camera, renderer, controls;
let clock, velocity, moveSpeed, keyboard;

function init() {
    // 1. Create the scene
    scene = new THREE.Scene();

    // 2. Create a camera
    camera = new THREE.PerspectiveCamera(75, 1100/600, 0.1, 1000);

    // 3. Set up the renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg-container"), antialias: false });
    renderer.setSize(1100, 600);
    document.body.appendChild(renderer.domElement);

    // 4. Create a basic ground (e.g., a plane)
    const geometry = new THREE.PlaneGeometry(500, 500);
    const material = new THREE.MeshBasicMaterial({ color: 0x7cfc00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // 5. Add simple lighting
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    // 6. Set up the camera position
    camera.position.y = 2;
    camera.position.z = 10;

    // 7. Add interaction controls
    controls = new THREE.PointerLockControls(camera, document.body);

    // 8. Create a floating Torus 3D Shape
    const tgeom = new THREE.TorusGeometry(10, 3, 16, 100);
    const tmaterial = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
    const torus = new THREE.Mesh(tgeom, tmaterial);
    scene.add(torus);

    // 9. Set up Light effect on the Torus
    const ptLight = new THREE.PointLight(0xffffff);
    ptLight.position.set(20, 20, 20);
    const ambLight = new THREE.AmbientLight(0xffffff);
    scene.add(ptLight, ambLight);

    // 10. Creating Helpers
    const ptLightHelper = new THREE.PointLightHelper(ptLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(ptLightHelper, gridHelper);

    // 11. Add some walls or objects to explore
    const wallGeometry = new THREE.BoxGeometry(10, 5, 0.5);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(5, 2.5, 0);
    scene.add(wall1);

    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(-5, 2.5, 0);
    scene.add(wall2);

    // 12. Create the background texture for the scene
    const bg = new THREE.TextureLoader().load('./assets/images/scifi2.jpg');
    scene.background = bg;

    // 13. Create a floating 3D Cube
    const heroBg = new THREE.TextureLoader().load('./assets/images/hero-bg.jpg');
    const cgeom = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshBasicMaterial({ map: heroBg })
    );
    scene.add(cgeom);

    // 14. Add some stars to the scene
    function addStar() {
        const sgeom = new THREE.SphereGeometry(0.25, 24, 24);
        const smaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(sgeom, smaterial);

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        scene.add(star);
    }
    Array(200).fill().forEach(addStar);

    // 15. Set up basic clock, velocity, and movement speed
    clock = new THREE.Clock();
    velocity = new THREE.Vector3();
    moveSpeed = 10; // Adjust as necessary

    // 16. Set up basic keyboard controls
    keyboard = new KeyboardState();

    // Add event listeners for starting and exiting pointer lock
    document.addEventListener('click', () => {
        controls.lock();
    });

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === document.body)
            { console.log('Pointer locked'); } else {
              console.log('Pointer unlocked'); } });

    // Handle resizing
    window.addEventListener('resize', onWindowResize, false);

    // Start the animation loop
    requestAnimationFrame(animate);
}

// Handle window resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Keyboard state class (simplified)
class KeyboardState {
    constructor() {
        this.keys = {};
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    pressed(key) {
        return !!this.keys[key];
    }
}

// Animation loop
function animate() {
    const delta = clock.getDelta(); // Time between frames
    const speed = moveSpeed * delta; // Speed based on delta time

    // Move the player forward and backward
    if (keyboard.pressed('KeyW')) {
        velocity.z = -speed;
    } else if (keyboard.pressed('KeyS')) {
        velocity.z = speed;
    } else {
        velocity.z = 0;
    }

    // Move the player left and right
    if (keyboard.pressed('KeyA')) {
        velocity.x = -speed;
    } else if (keyboard.pressed('KeyD')) {
        velocity.x = speed;
    } else {
        velocity.x = 0;
    }

    // Apply the movement
    camera.position.add(velocity);

    // Rotate the torus
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            child.rotation.z += 0.01;
        }
    });

    // Render the scene
    renderer.render(scene, camera);

    // Request the next frame
    requestAnimationFrame(animate);
}

init();
