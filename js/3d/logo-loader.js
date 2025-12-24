import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function initHeaderLogo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- 1. CENA BÁSICA ---
    const scene = new THREE.Scene();

    // Câmera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // --- 2. ILUMINAÇÃO (Essencial para materiais sólidos ficarem bonitos) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 10, 15);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-10, -5, 5);
    scene.add(fillLight);

    // --- 3. O SEGREDO: CRIAR O MATERIAL NO CÓDIGO ---
    // Em vez de carregar imagens, criamos o "plástico vermelho" aqui:
    const solidRedMaterial = new THREE.MeshStandardMaterial({
        color: 0xD32F2F,    // Vermelho NECON
        roughness: 0.2,     // 0 = Espelho, 1 = Fosco. 0.2 é bem liso.
        metalness: 0.1,     // Um toque de metal para refletir a luz
        flatShading: false  // Deixe 'false' para curvas suaves
    });

    // --- 4. CARREGAR O ARQUIVO .GLB ---
    const loader = new GLTFLoader();
    let loadedObject = null;
    const alturaBase = -9;

    // Certifique-se que o arquivo na pasta é 'logo.glb'
    loader.load('assets/models/logo3d/logo.glb',
        function (gltf) {
            loadedObject = gltf.scene;

            // AQUI APLICAMOS A COR SÓLIDA
            // Percorre todas as partes do modelo e troca a textura antiga pelo nosso material vermelho
            loadedObject.traverse((child) => {
                if (child.isMesh) {
                    child.material = solidRedMaterial;
                }
            });

            // Ajustes de Tamanho e Posição
            const escala = 25.0;
            loadedObject.scale.set(escala, escala, escala);
            loadedObject.position.set(0, alturaBase, 0);

            scene.add(loadedObject);
        },
        undefined,
        (error) => console.error('Erro:', error)
    );

    // --- 5. ANIMAÇÃO SUAVE ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        if (loadedObject) {
            const time = clock.getElapsedTime();

            // Balanço leve
            loadedObject.rotation.y = Math.sin(time * 1.5) * 0.2;
            // Flutuação
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