import * as THREE from 'three';
import { MiniGame } from './minigame.js';

// Variáveis de Controle
let scene, camera, renderer;
let penguinGroup;
let eyeGroupL, eyeGroupR, wingGroupL, wingGroupR; 
let isPlaying = false;
let targetPosition = null;
let state = 'IDLE'; 
let gameInstance = null;

// Variáveis de Animação
let blinkTimer = 0;
let flapTimer = 0;
let isFlapping = false;
const restAngle = Math.PI / 18;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const planeIntersectPoint = new THREE.Vector3();

// Função global para PARAR tudo
function stopPenguinMode() {
    const playBtn = document.getElementById('btn-play-penguin');
    const container = document.getElementById('penguin-container');

    if (!isPlaying) return;

    isPlaying = false;
    
    if (container) container.classList.remove('active');
    
    if (playBtn) {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play Pinguim';
        playBtn.classList.remove('active-btn');
    }
    
    window.removeEventListener('pointerdown', onDocumentClick);
    
    if (gameInstance) {
        gameInstance.stop();
        gameInstance = null;
    }
}

export function initPenguin(containerId) {
    const playBtn = document.getElementById('btn-play-penguin');
    const container = document.getElementById('penguin-container');
    
    if (playBtn && container) {
        playBtn.addEventListener('click', () => {
            if (!isPlaying) {
                // --- INICIAR ---
                isPlaying = true;
                container.classList.add('active');
                playBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Parar Jogo';
                playBtn.classList.add('active-btn');
                
                setupScene(container);
                createOriginalPenguin();
                
                gameInstance = new MiniGame(scene, stopPenguinMode);
                gameInstance.start();

                animate();
                window.addEventListener('pointerdown', onDocumentClick);
            } else {
                stopPenguinMode();
            }
        });
    }
}

function setupScene(container) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    
    // [RESPONSIVIDADE] Ajusta a distância da câmera baseada na largura da tela
    const isMobile = width < 768;
    const cameraZ = isMobile ? 55 : 30; // Afasta mais no celular para ver as laterais

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 20, cameraZ);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(5, 5, 5);
    scene.add(key);

    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Atualiza Câmera ao girar a tela
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        const isMobileResize = newWidth < 768;
        const newZ = isMobileResize ? 55 : 30;
        camera.position.setZ(newZ);

        renderer.setSize(newWidth, newHeight);
    });
}

function createOriginalPenguin() {
    penguinGroup = new THREE.Group();
    scene.add(penguinGroup);

    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffa500, roughness: 0.5 });

    // Corpo
    const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), blackMat);
    body.scale.set(1.0, 1.8, 0.9);
    body.position.y = -0.3;
    penguinGroup.add(body);
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 32), whiteMat);
    belly.scale.set(0.9, 1.3, 0.5);
    belly.position.set(0, -0.5, 0.55);
    penguinGroup.add(belly);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), blackMat);
    head.position.y = 0.85;
    penguinGroup.add(head);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 16), yellowMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.75, 1.0);
    penguinGroup.add(beak);

    const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const pupilGeo = new THREE.SphereGeometry(0.07, 12, 12);
    const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilL = new THREE.Mesh(pupilGeo, blackMat); pupilL.position.z = 0.18;
    eyeGroupL = new THREE.Group(); eyeGroupL.add(eyeL, pupilL); eyeGroupL.position.set(-0.25, 0.95, 0.75); penguinGroup.add(eyeGroupL);
    const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
    const pupilR = new THREE.Mesh(pupilGeo, blackMat); pupilR.position.z = 0.18;
    eyeGroupR = new THREE.Group(); eyeGroupR.add(eyeR, pupilR); eyeGroupR.position.set(0.25, 0.95, 0.75); penguinGroup.add(eyeGroupR);

    const wingGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const wingL = new THREE.Mesh(wingGeo, blackMat); wingL.scale.set(0.45, 2.5, 0.8); wingL.position.set(0, -0.8, 0);
    wingGroupL = new THREE.Group(); wingGroupL.position.set(-1.1, 0.1, 0); wingGroupL.add(wingL); wingGroupL.rotation.z = restAngle; penguinGroup.add(wingGroupL);
    const wingR = wingL.clone(); wingGroupR = new THREE.Group(); wingGroupR.position.set(1.1, 0.1, 0); wingGroupR.add(wingR); wingGroupR.rotation.z = -restAngle; penguinGroup.add(wingGroupR);

    const footGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const footL = new THREE.Mesh(footGeo, yellowMat); footL.scale.set(1.2, 0.4, 1.5); footL.position.set(-0.5, -2.3, 0.3); penguinGroup.add(footL);
    const footR = footL.clone(); footR.position.x = 0.5; penguinGroup.add(footR);
    
    penguinGroup.scale.set(1.5, 1.5, 1.5);
    penguinGroup.position.set(0, 2, 0);
}

function onDocumentClick(event) {
    // Suporte melhorado para Toque vs Mouse
    let clientX = event.clientX;
    let clientY = event.clientY;

    // Se for toque e não tiver clientX direto (alguns navegadores antigos)
    if (event.changedTouches && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    }

    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(floorPlane, planeIntersectPoint);
    
    if (planeIntersectPoint) {
        targetPosition = planeIntersectPoint.clone();
        if (targetPosition.z > 12) targetPosition.z = 12;
        if (targetPosition.z < -20) targetPosition.z = -20;
        
        // Limites Laterais maiores no celular (para usar a tela toda)
        const maxSide = window.innerWidth < 768 ? 15 : 25; 
        if (targetPosition.x > maxSide) targetPosition.x = maxSide;
        if (targetPosition.x < -maxSide) targetPosition.x = -maxSide;
        
        targetPosition.y = 2.0; 
        state = 'WALKING';
    }
}

const clock = new THREE.Clock();

function animate() {
    if (!isPlaying) return;
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (gameInstance && penguinGroup) {
        gameInstance.update(time, delta, penguinGroup.position);
    }

    blinkTimer += delta;
    if (blinkTimer > 3 + Math.random() * 2) {
        if(eyeGroupL) eyeGroupL.scale.y = 0.1; if(eyeGroupR) eyeGroupR.scale.y = 0.1;
        setTimeout(() => { if(eyeGroupL) eyeGroupL.scale.y = 1; if(eyeGroupR) eyeGroupR.scale.y = 1; }, 150);
        blinkTimer = 0;
    }
    flapTimer += delta;
    if (flapTimer > 7 && !isFlapping && state === 'IDLE') { isFlapping = true; flapTimer = 0; setTimeout(() => { isFlapping = false; }, 1000); }

    if (isFlapping || state === 'WALKING') {
        const speed = state === 'WALKING' ? 20 : 20; 
        const flapAngle = Math.abs(Math.sin(time * speed)) * 0.6;
        if(wingGroupL) wingGroupL.rotation.z = restAngle - flapAngle;
        if(wingGroupR) wingGroupR.rotation.z = -restAngle + flapAngle;
    } else {
        if(wingGroupL) wingGroupL.rotation.z += (restAngle - wingGroupL.rotation.z) * 0.1;
        if(wingGroupR) wingGroupR.rotation.z += (-restAngle - wingGroupR.rotation.z) * 0.1;
    }

    if (state === 'WALKING' && targetPosition) {
        const dx = targetPosition.x - penguinGroup.position.x;
        const dz = targetPosition.z - penguinGroup.position.z;
        const angle = Math.atan2(dx, dz); 
        penguinGroup.rotation.y = angle; 
        penguinGroup.rotation.x = 0;     

        const currentPos = new THREE.Vector3(penguinGroup.position.x, 0, penguinGroup.position.z);
        const targetPosFloor = new THREE.Vector3(targetPosition.x, 0, targetPosition.z);
        const distance = currentPos.distanceTo(targetPosFloor);

        if (distance > 0.5) {
            const direction = new THREE.Vector3().subVectors(targetPosition, penguinGroup.position);
            direction.y = 0; direction.normalize();
            const speed = 15.0 * delta;
            penguinGroup.position.add(direction.multiplyScalar(speed));
            penguinGroup.rotation.z = Math.sin(time * 15) * 0.15; 
            penguinGroup.position.y = 2.0 + Math.abs(Math.sin(time * 20)) * 0.5;
        } else {
            state = 'IDLE'; penguinGroup.rotation.z = 0; penguinGroup.position.y = 2.0;
        }
    } else {
        penguinGroup.position.y = 2.0 + Math.sin(time * 2) * 0.1;
    }

    renderer.render(scene, camera);
}