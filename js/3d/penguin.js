document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // PINGUIM 3D 100% RESPONSIVO
    // ==================================================
    if (typeof THREE === 'undefined') return;

    // --- REMOVIDO: O código que forçava a viewport ---
    // Agora o site usa o zoom nativo do celular.

    // --- BOTÃO DE MINIMIZAR ---
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '−';

    Object.assign(toggleBtn.style, {
        position: 'fixed',
        zIndex: '10000',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#1d4ed8',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        touchAction: 'manipulation' // Importante para celular
    });
    document.body.appendChild(toggleBtn);


    // --- SETUP DA CENA ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    const cameraZ = 8;
    camera.position.set(0, 0, cameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '9999';
    renderer.domElement.style.pointerEvents = 'none'; // Permite clicar no site "através" do pinguim
    renderer.domElement.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(renderer.domElement);

    // --- BOTÃO ACTION ---
    let isVisible = true;
    toggleBtn.addEventListener('click', () => {
        isVisible = !isVisible;
        if (isVisible) {
            renderer.domElement.style.opacity = '1';
            toggleBtn.innerHTML = '−';
            toggleBtn.style.backgroundColor = '#1d4ed8';
        } else {
            renderer.domElement.style.opacity = '0';
            toggleBtn.innerHTML = '🐧';
            toggleBtn.style.backgroundColor = '#333';
        }
    });

    // --- LUZES & MATERIAIS ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    scene.add(key);

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.5 });

    // --- MONTAGEM DO PINGUIM ---
    const penguin = new THREE.Group();
    scene.add(penguin);

    // Corpo
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), blackMat);
    body.scale.set(1.0, 1.8, 0.9);
    body.position.y = -0.3;
    penguin.add(body);
    // Barriga
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), whiteMat);
    belly.scale.set(0.9, 1.3, 0.5);
    belly.position.set(0, -0.5, 0.55);
    penguin.add(belly);
    // Cabeça
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), blackMat);
    head.position.y = 0.85;
    penguin.add(head);
    // Bico
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), yellowMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.75, 1.0);
    penguin.add(beak);
    // Olhos
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const pupilGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilL = new THREE.Mesh(pupilGeo, blackMat); pupilL.position.z = 0.18;
    const eyeGroupL = new THREE.Group(); eyeGroupL.add(eyeL, pupilL); eyeGroupL.position.set(-0.25, 0.95, 0.75); penguin.add(eyeGroupL);
    const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilR = new THREE.Mesh(pupilGeo, blackMat); pupilR.position.z = 0.18;
    const eyeGroupR = new THREE.Group(); eyeGroupR.add(eyeR, pupilR); eyeGroupR.position.set(0.25, 0.95, 0.75); penguin.add(eyeGroupR);
    // Asas
    const wingGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const restAngle = Math.PI / 18;
    const wingL = new THREE.Mesh(wingGeo, blackMat); wingL.scale.set(0.45, 2.5, 0.8); wingL.position.set(0, -0.8, 0);
    const wingGroupL = new THREE.Group(); wingGroupL.position.set(-1.1, 0.1, 0); wingGroupL.add(wingL); wingGroupL.rotation.z = restAngle; penguin.add(wingGroupL);
    const wingR = wingL.clone(); const wingGroupR = new THREE.Group(); wingGroupR.position.set(1.1, 0.1, 0); wingGroupR.add(wingR); wingGroupR.rotation.z = -restAngle; penguin.add(wingGroupR);
    // Pés
    const footGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const footL = new THREE.Mesh(footGeo, yellowMat); footL.scale.set(1.2, 0.4, 1.5); footL.position.set(-0.5, -2.3, 0.3); penguin.add(footL);
    const footR = footL.clone(); footR.position.x = 0.5; penguin.add(footR);


    // --- SISTEMA INTELIGENTE DE POSICIONAMENTO ---
    let mouseWorldX = 0; let mouseWorldY = 0;
    const vFOV = THREE.Math.degToRad(camera.fov);
    const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraZ;
    let visibleWidth = visibleHeight * (window.innerWidth / window.innerHeight);
    let isMobile = false;

    function updatePosition() {
        const aspect = window.innerWidth / window.innerHeight;
        visibleWidth = visibleHeight * aspect;

        // Ponto de quebra: 768px (Tablets e Celulares)
        isMobile = window.innerWidth < 768;

        if (isMobile) {
            // === MODO CELULAR ===
            // Pinguim vai para o canto INFERIOR DIREITO (Estilo Chat)
            // Escala menor para não atrapalhar
            penguin.scale.set(0.22, 0.22, 0.22);

            // X positivo = Direita | Y negativo = Baixo
            const posX = (visibleWidth / 2) - 1.0;
            const posY = -(visibleHeight / 2) + 1.2;
            penguin.position.set(posX, posY, 0);

            // Botão fica logo acima dele
            toggleBtn.style.width = '45px';
            toggleBtn.style.height = '45px';
            toggleBtn.style.fontSize = '20px';
            toggleBtn.style.bottom = '120px'; // Acima do pinguim
            toggleBtn.style.right = '20px';
            toggleBtn.style.top = 'auto';
            toggleBtn.style.left = 'auto';

        } else {
            // === MODO COMPUTADOR ===
            // Pinguim no canto SUPERIOR ESQUERDO (Original)
            penguin.scale.set(0.35, 0.35, 0.35);

            const posX = -(visibleWidth / 2) + 1.5;
            const posY = (visibleHeight / 2) - 1.2;
            penguin.position.set(posX, posY, 0);

            // Botão ao lado dele
            toggleBtn.style.width = '40px';
            toggleBtn.style.height = '40px';
            toggleBtn.style.fontSize = '20px';
            toggleBtn.style.top = '20px';
            toggleBtn.style.left = '20px';
            toggleBtn.style.bottom = 'auto';
            toggleBtn.style.right = 'auto';
        }
    }
    updatePosition(); // Executa ao carregar

    // --- INTERAÇÃO (Mouse e Toque) ---
    function updateLookTarget(clientX, clientY) {
        mouseWorldX = (clientX / window.innerWidth) * visibleWidth - (visibleWidth / 2);
        mouseWorldY = -((clientY / window.innerHeight) * visibleHeight - (visibleHeight / 2));
    }
    document.addEventListener('mousemove', (e) => updateLookTarget(e.clientX, e.clientY));
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) updateLookTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) updateLookTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });


    // --- LOOP DE ANIMAÇÃO ---
    const clock = new THREE.Clock();
    let blinkTimer = 0; let flapTimer = 0; let isFlapping = false;

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Movimento Suave
        penguin.position.y += Math.sin(time * 2) * 0.002;

        // Olhar
        const dx = mouseWorldX - penguin.position.x;
        const dy = mouseWorldY - penguin.position.y;
        penguin.rotation.y += (Math.atan2(dx, 3) - penguin.rotation.y) * 0.1;
        penguin.rotation.x += (-Math.atan2(dy, 3) - penguin.rotation.x) * 0.1;

        // Piscar
        blinkTimer += delta;
        if (blinkTimer > 3 + Math.random() * 2) {
            eyeGroupL.scale.y = 0.1; eyeGroupR.scale.y = 0.1;
            setTimeout(() => { eyeGroupL.scale.y = 1; eyeGroupR.scale.y = 1; }, 150);
            blinkTimer = 0;
        }
        // Asas
        flapTimer += delta;
        if (flapTimer > 10 && !isFlapping) { isFlapping = true; flapTimer = 0; setTimeout(() => { isFlapping = false; }, 1000); }
        if (isFlapping) {
            const flapAngle = Math.abs(Math.sin(time * 20)) * 0.6;
            wingGroupL.rotation.z = restAngle - flapAngle; wingGroupR.rotation.z = -restAngle + flapAngle;
        } else {
            wingGroupL.rotation.z += (restAngle - wingGroupL.rotation.z) * 0.1;
            wingGroupR.rotation.z += (-restAngle - wingGroupR.rotation.z) * 0.1;
        }

        renderer.render(scene, camera);
    }
    animate();

    // Resize Inteligente
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updatePosition();
    });
});