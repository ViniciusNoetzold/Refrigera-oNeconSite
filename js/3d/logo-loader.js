import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export function initHeaderLogo(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. CENA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 25); // Distância da câmera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. LUZES
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(10, 10, 15);
    scene.add(dirLight);

    // 3. MATERIAIS
    const texLoader = new THREE.TextureLoader();
    const basePath = 'assets/models/logo3d/';

    const mapDiffuse = texLoader.load(basePath + 'map.png', (tex) => { tex.colorSpace = THREE.SRGBColorSpace; });

    const pbrMaterial = new THREE.MeshStandardMaterial({
        map: mapDiffuse,
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.3
    });

    texLoader.load(basePath + 'normalMap.png', (t) => pbrMaterial.normalMap = t);
    texLoader.load(basePath + 'metalnessMap.png', (t) => pbrMaterial.metalnessMap = t);
    texLoader.load(basePath + 'roughnessMap.png', (t) => pbrMaterial.roughnessMap = t);

    // 4. CARREGAR O OBJETO
    const loader = new OBJLoader();
    let loadedObject = null;

    // === SEUS AJUSTES DE POSIÇÃO ===
    const alturaBase = -9; // Posição Y que você definiu

    loader.load(basePath + 'logo.obj',
        function (object) {
            loadedObject = object;
            object.traverse((child) => {
                if (child.isMesh) child.material = pbrMaterial;
            });

            // === SEUS AJUSTES DE ESCALA ===
            const escala = 24.0; // Escala que você definiu
            object.scale.set(escala, escala, escala);

            // Define a posição inicial
            object.position.set(0, alturaBase, 0);

            scene.add(object);
        },
        undefined,
        (error) => console.error('Erro ao carregar:', error)
    );

    // 5. ANIMAÇÃO (BALANÇO SUAVE)
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        if (loadedObject) {
            const time = clock.getElapsedTime();

            // Configuração do Balanço
            // Se o texto estiver espelhado ("NOCEN"), troque 0 por Math.PI
            const rotacaoInicial = 0;

            // Balanço Esquerda/Direita (Tipo pêndulo, sem girar tudo)
            loadedObject.rotation.y = rotacaoInicial + Math.sin(time * 1.5) * 0.2;

            // Flutuação Cima/Baixo suave (Respeitando sua altura de -9)
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