import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// FUNÇÃO 1: LOGO DO HEADER (ANIMADO)
// ==========================================
export function initHeaderLogo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Mantivemos a câmera em 40 (seguro para não cortar)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 10, 15);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-10, -5, 5);
    scene.add(fillLight);

    // Material
    const solidRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xD32F2F, roughness: 0.2, metalness: 0.1, flatShading: false
    });

    const loader = new GLTFLoader();
    let loadedObject = null;
    const alturaBase = -9;

    loader.load('assets/models/logo3d/logo.glb', function (gltf) {
        loadedObject = gltf.scene;
        loadedObject.traverse((child) => {
            if (child.isMesh) child.material = solidRedMaterial;
        });
        
        // --- AQUI ESTÁ O AUMENTO ---
        // Aumentado de 25.0 para 35.0 para compensar a distância da câmera
        loadedObject.scale.set(35.0, 35.0, 35.0);
        
        loadedObject.position.set(0, alturaBase, 0);
        scene.add(loadedObject);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        if (loadedObject) {
            const time = clock.getElapsedTime();
            loadedObject.rotation.y = Math.sin(time * 1.5) * 0.2; 
            loadedObject.position.y = alturaBase + Math.sin(time * 2) * 0.3; 
        }
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// ==========================================
// FUNÇÃO 2: LOGO DO FOOTER (ESTÁTICO)
// ==========================================
export function initFooterLogo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Câmera ajustada para o footer
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 10, 15);
    scene.add(dirLight);

    const solidRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xD32F2F, roughness: 0.2, metalness: 0.1, flatShading: false
    });

    const loader = new GLTFLoader();
    let loadedObject = null;

    loader.load('assets/models/logo3d/logo.glb', function (gltf) {
        loadedObject = gltf.scene;
        loadedObject.traverse((child) => {
            if (child.isMesh) child.material = solidRedMaterial;
        });

        // Escala para o rodapé
        const escala = 30.0;
        loadedObject.scale.set(escala, escala, escala);
        
        // Posição fixa e centralizada
        loadedObject.position.set(0, -6, 0);
        
        // Reto (rotação zerada)
        loadedObject.rotation.y = 0.0; 

        scene.add(loadedObject);
    });

    function animate() {
        requestAnimationFrame(animate);
        // --- SEM CÁLCULOS DE MOVIMENTO AQUI ---
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}