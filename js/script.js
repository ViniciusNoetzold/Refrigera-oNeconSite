document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // 1. WHATSAPP E DATA
    // ==================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    function handleWhatsClick() {
        window.open('https://wa.me/5554984379019', '_blank');
    }

    const btnHero = document.getElementById('btn-whats-hero');
    if (btnHero) btnHero.addEventListener('click', handleWhatsClick);

    const btnFooter = document.getElementById('btn-whats-footer');
    if (btnFooter) btnFooter.addEventListener('click', handleWhatsClick);


    // ==================================================
    // 2. PINGUIM 3D (SEM CAMISA)
    // ==================================================
    if (typeof THREE === 'undefined') return;

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
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);

    // --- LUZES ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5);
    rim.position.set(-5, 5, -5);
    scene.add(rim);

    // --- MATERIAIS ---
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.5 });

    // --- MONTAGEM DO PINGUIM ---
    const penguin = new THREE.Group();
    scene.add(penguin);

    // 1. Corpo
    const bodyGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const body = new THREE.Mesh(bodyGeo, blackMat);
    body.scale.set(1.0, 1.8, 0.9);
    body.position.y = -0.3;
    penguin.add(body);

    // 2. Barriga (Restaurada)
    const bellyGeo = new THREE.SphereGeometry(0.95, 32, 32);
    const belly = new THREE.Mesh(bellyGeo, whiteMat);
    belly.scale.set(0.9, 1.3, 0.5);
    belly.position.set(0, -0.5, 0.55);
    penguin.add(belly);

    // 3. Cabeça
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), blackMat);
    head.position.y = 0.85; 
    penguin.add(head);

    // 4. Bico
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), yellowMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.75, 1.0); 
    penguin.add(beak);

    // 5. Olhos
    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const pupilGeo = new THREE.SphereGeometry(0.07, 12, 12);
    
    // Olho Esquerdo
    const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilL = new THREE.Mesh(pupilGeo, blackMat);
    pupilL.position.z = 0.18;
    const eyeGroupL = new THREE.Group();
    eyeGroupL.add(eyeL, pupilL);
    eyeGroupL.position.set(-0.25, 0.95, 0.75);
    penguin.add(eyeGroupL);

    // Olho Direito
    const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilR = new THREE.Mesh(pupilGeo, blackMat);
    pupilR.position.z = 0.18;
    const eyeGroupR = new THREE.Group();
    eyeGroupR.add(eyeR, pupilR);
    eyeGroupR.position.set(0.25, 0.95, 0.75);
    penguin.add(eyeGroupR);

    // 6. Asas (Sem mangas)
    const wingGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const restAngle = Math.PI / 18; 

    // Asa Esquerda
    const wingL = new THREE.Mesh(wingGeo, blackMat);
    wingL.scale.set(0.45, 2.5, 0.8);
    wingL.position.set(0, -0.8, 0); 

    const wingGroupL = new THREE.Group();
    wingGroupL.position.set(-1.1, 0.1, 0); 
    wingGroupL.add(wingL);
    wingGroupL.rotation.z = restAngle; 
    penguin.add(wingGroupL);

    // Asa Direita
    const wingR = wingL.clone();
    const wingGroupR = new THREE.Group();
    wingGroupR.position.set(1.1, 0.1, 0);
    wingGroupR.add(wingR);
    wingGroupR.rotation.z = -restAngle; 
    penguin.add(wingGroupR);

    // 7. Pés
    const footGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const footL = new THREE.Mesh(footGeo, yellowMat);
    footL.scale.set(1.2, 0.4, 1.5);
    footL.position.set(-0.5, -2.3, 0.3);
    penguin.add(footL);
    
    const footR = footL.clone();
    footR.position.x = 0.5;
    penguin.add(footR);

    // Tamanho final (Pequeno)
    penguin.scale.set(0.35, 0.35, 0.35);


    // --- CÁLCULO DE POSIÇÃO ---
    let mouseWorldX = 0; let mouseWorldY = 0;
    const vFOV = THREE.Math.degToRad(camera.fov); 
    const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraZ;
    let visibleWidth = visibleHeight * (window.innerWidth / window.innerHeight);

    function updatePosition() {
        const aspect = window.innerWidth / window.innerHeight;
        visibleWidth = visibleHeight * aspect;
        // Posiciona no canto superior esquerdo
        penguin.position.set(-(visibleWidth / 2) + 1.5, (visibleHeight / 2) - 1.2, 0);
    }
    updatePosition();

    document.addEventListener('mousemove', (e) => {
        mouseWorldX = (e.clientX / window.innerWidth) * visibleWidth - (visibleWidth / 2);
        mouseWorldY = -((e.clientY / window.innerHeight) * visibleHeight - (visibleHeight / 2));
    });


    // --- ANIMAÇÃO ---
    const clock = new THREE.Clock();
    let blinkTimer = 0; let flapTimer = 0; let isFlapping = false;

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Flutuar & Olhar
        penguin.position.y += Math.sin(time * 2) * 0.002;
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

        // Bater Asas
        flapTimer += delta;
        if (flapTimer > 10 && !isFlapping) {
            isFlapping = true; flapTimer = 0;
            setTimeout(() => { isFlapping = false; }, 1000);
        }

        if (isFlapping) {
            const flapAngle = Math.abs(Math.sin(time * 20)) * 0.6;
            wingGroupL.rotation.z = restAngle - flapAngle;
            wingGroupR.rotation.z = -restAngle + flapAngle;
        } else {
            wingGroupL.rotation.z += (restAngle - wingGroupL.rotation.z) * 0.1;
            wingGroupR.rotation.z += (-restAngle - wingGroupR.rotation.z) * 0.1;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        updatePosition();
    });
});