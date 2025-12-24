import * as THREE from 'three';

export class Fish {
    constructor(scene) {
        this.scene = scene;
        this.mesh = new THREE.Group();
        this.active = false;
        this.wobbleOffset = Math.random() * 100;
        this.isBlinking = false; // [NOVO] Controle de piscar

        // --- MATERIAIS ---
        const bodyColor = 0x00a8ff; 
        const bellyColor = 0x80d8ff;
        const finColor = 0x0097e6;   

        const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.1 });
        const bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, roughness: 0.5 });
        const finMat = new THREE.MeshStandardMaterial({ color: finColor, roughness: 0.6, side: THREE.DoubleSide });
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

        // --- GEOMETRIA (Igual ao anterior) ---
        // Corpo
        const bodyGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.scale.set(1.5, 1.0, 0.6);
        this.mesh.add(body);

        // Barriga
        const bellyGeo = new THREE.SphereGeometry(0.48, 32, 32);
        const belly = new THREE.Mesh(bellyGeo, bellyMat);
        belly.scale.set(1.4, 0.6, 0.55);
        belly.position.y = -0.25;
        this.mesh.add(belly);

        // Cauda
        const tailShape = new THREE.Shape();
        tailShape.moveTo(0, 0);
        tailShape.lineTo(0.5, 0.4);
        tailShape.quadraticCurveTo(0.3, 0, 0.5, -0.4);
        tailShape.lineTo(0, 0);
        const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
        tailGeo.center();
        this.tail = new THREE.Mesh(tailGeo, finMat);
        this.tail.rotation.z = -Math.PI / 2;
        this.tail.rotation.y = Math.PI / 2;
        this.tail.position.set(-0.8, 0, 0);
        this.mesh.add(this.tail);

        // Nadadeiras Laterais
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.quadraticCurveTo(0.2, 0.2, 0.4, 0);
        finShape.quadraticCurveTo(0.2, -0.1, 0, 0);
        const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });

        this.finR = new THREE.Mesh(finGeo, finMat);
        this.finR.position.set(0.2, -0.1, 0.25);
        this.finR.rotation.x = Math.PI / 2;
        this.finR.rotation.y = -0.3;
        this.mesh.add(this.finR);

        this.finL = this.finR.clone();
        this.finL.position.set(0.2, -0.1, -0.3);
        this.finL.rotation.x = -Math.PI / 2;
        this.finL.rotation.y = 0.3;
        this.mesh.add(this.finL);

        // Nadadeira Dorsal
        const dorsalGeo = new THREE.ConeGeometry(0.3, 0.5, 4);
        const dorsal = new THREE.Mesh(dorsalGeo, finMat);
        dorsal.scale.set(1, 0.5, 0.2);
        dorsal.position.set(-0.1, 0.5, 0);
        dorsal.rotation.z = -0.5;
        this.mesh.add(dorsal);

        // Olhos
        const eyeGroup = new THREE.Group();
        const eyeBallGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const pupilGeo = new THREE.SphereGeometry(0.06, 12, 12);

        const eyeR = new THREE.Mesh(eyeBallGeo, whiteMat);
        const pupilR = new THREE.Mesh(pupilGeo, blackMat);
        pupilR.position.z = 0.12; pupilR.position.x = 0.05;
        const eyeRGroup = new THREE.Group(); eyeRGroup.add(eyeR, pupilR); eyeRGroup.position.set(0.4, 0.1, 0.25);
        this.mesh.add(eyeRGroup);

        const eyeLGroup = eyeRGroup.clone(); eyeLGroup.position.z = -0.25;
        this.mesh.add(eyeLGroup);

        this.scene.add(this.mesh);
        this.mesh.visible = false;
    }

    spawn(x, z) {
        this.mesh.position.set(x, 1.5, z);
        this.mesh.visible = true;
        this.active = true;
        this.mesh.scale.set(0,0,0);
        this.mesh.rotation.y = Math.random() * Math.PI * 2;
        
        // [NOVO] Resetar estado de piscar
        this.isBlinking = false;
        this.mesh.traverse((child) => {
            if (child.isMesh) child.visible = true;
        });
    }

    remove() {
        this.active = false;
        this.mesh.visible = false;
    }

    // [NOVO] Função para ativar o pisca-pisca
    setBlinking(state) {
        this.isBlinking = state;
        if (!state) {
            this.mesh.visible = true; // Garante que fica visível se parar de piscar
        }
    }

    update(time) {
        if (!this.active) return;

        // Animação de entrada
        if (this.mesh.scale.x < 0.8) {
            this.mesh.scale.addScalar(0.05);
        }

        // Flutuar e Girar
        this.mesh.position.y = 1.5 + Math.sin(time * 2 + this.wobbleOffset) * 0.2;
        this.mesh.rotation.y += 0.01;

        // Animação das nadadeiras
        const swimSpeed = 15;
        this.tail.rotation.y = (Math.PI / 2) + Math.sin(time * swimSpeed) * 0.3;
        this.finR.rotation.z = Math.sin(time * swimSpeed) * 0.3;
        this.finL.rotation.z = -Math.sin(time * swimSpeed) * 0.3;

        // [NOVO] Efeito de Piscar (Desaparecendo)
        if (this.isBlinking) {
            // Pisca rápido (a cada 0.1s aproximadamente)
            this.mesh.visible = Math.floor(time * 15) % 2 === 0;
        } else {
            this.mesh.visible = true;
        }
    }
}