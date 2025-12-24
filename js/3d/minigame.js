import { Fish } from './fish.js';

export class MiniGame {
    constructor(scene, onExit) {
        this.scene = scene;
        this.onExit = onExit; 
        this.score = 0;
        this.startTime = 0;
        this.fish = new Fish(scene);
        this.timeLeft = 0;
        this.isGameOver = false;

        // Placar
        this.scoreElement = document.createElement('div');
        Object.assign(this.scoreElement.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#0d121d',
            padding: '10px 20px',
            borderRadius: '30px',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: '900',
            fontSize: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: '10000',
            pointerEvents: 'none',
            display: 'none',
            transition: 'transform 0.2s'
        });
        this.scoreElement.innerHTML = `<i class="fa-solid fa-fish" style="color: #00a8ff; margin-right: 8px;"></i> 0`;
        document.body.appendChild(this.scoreElement);

        // Tela de Game Over (Responsiva)
        this.gameOverElement = document.createElement('div');
        Object.assign(this.gameOverElement.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(13, 18, 29, 0.95)',
            color: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            zIndex: '10001',
            display: 'none',
            border: '2px solid #D32F2F',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
            minWidth: '300px',
            maxWidth: '90%', // [IMPORTANTE] Garante que cabe no celular
            fontFamily: "'Roboto', sans-serif"
        });
        
        this.gameOverElement.innerHTML = `
            <h2 style="margin-bottom: 20px; color: #D32F2F; font-size: 2.5rem; text-transform: uppercase; font-weight: 900;">Fim de Jogo!</h2>
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 25px;">
                <p style="font-size: 1.4rem; margin-bottom: 10px;">Peixes Pegos: <br><span id="go-score" style="color: #00a8ff; font-weight: bold; font-size: 2rem;">0</span></p>
                <p style="font-size: 1.1rem; color: #ccc;">Tempo Jogado: <span id="go-time" style="color: #fff; font-weight: bold;">0s</span></p>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"> <button id="go-restart" style="padding: 12px 25px; background: #00a8ff; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.3s;">
                    <i class="fa-solid fa-rotate-right"></i> Jogar Denovo
                </button>
                <button id="go-exit" style="padding: 12px 25px; background: transparent; border: 2px solid #D32F2F; border-radius: 8px; color: #D32F2F; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.3s;">
                    <i class="fa-solid fa-door-open"></i> Sair
                </button>
            </div>
        `;
        document.body.appendChild(this.gameOverElement);

        const btnRestart = this.gameOverElement.querySelector('#go-restart');
        const btnExit = this.gameOverElement.querySelector('#go-exit');

        btnRestart.addEventListener('click', () => this.restart());
        btnExit.addEventListener('click', () => {
            this.hideGameOver();
            if (this.onExit) this.onExit();
        });

        // Touchstart para feedback visual rápido no celular
        btnRestart.addEventListener('touchstart', () => btnRestart.style.transform = 'scale(0.95)');
        btnRestart.addEventListener('touchend', () => btnRestart.style.transform = 'scale(1)');
    }

    start() {
        this.isGameOver = false;
        this.score = 0;
        this.startTime = Date.now();
        this.updateScoreUI();
        this.scoreElement.style.display = 'block';
        this.hideGameOver();
        this.spawnNewFish();
    }

    restart() {
        this.start();
    }

    stop() {
        this.scoreElement.style.display = 'none';
        this.hideGameOver();
        this.fish.remove();
        this.isGameOver = true;
    }

    gameOver() {
        this.isGameOver = true;
        this.fish.remove();
        const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
        this.gameOverElement.querySelector('#go-score').innerText = this.score;
        this.gameOverElement.querySelector('#go-time').innerText = totalTime + 's';
        this.scoreElement.style.display = 'none';
        this.gameOverElement.style.display = 'block';
    }

    hideGameOver() {
        this.gameOverElement.style.display = 'none';
    }

    spawnNewFish() {
        // Área de spawn menor no celular para facilitar encontrar o peixe
        const isMobile = window.innerWidth < 768;
        const rangeX = isMobile ? 15 : 30; // 15 no celular, 30 no PC
        
        const x = (Math.random() - 0.5) * rangeX;
        const z = (Math.random() - 0.5) * 20;
        this.fish.spawn(x, z);
        this.timeLeft = 6.0;
    }

    update(time, delta, penguinPosition) {
        if (this.isGameOver) return;

        this.fish.update(time);

        if (this.fish.active) {
            this.timeLeft -= delta;
            
            if (this.timeLeft <= 3.0 && this.timeLeft > 0) {
                this.fish.setBlinking(true);
            } else {
                this.fish.setBlinking(false);
            }

            if (this.timeLeft <= 0) {
                this.gameOver();
                return;
            }

            if (penguinPosition) {
                const dist = Math.sqrt(
                    Math.pow(this.fish.mesh.position.x - penguinPosition.x, 2) + 
                    Math.pow(this.fish.mesh.position.z - penguinPosition.z, 2)
                );

                if (dist < 2.0) {
                    this.addPoint();
                }
            }
        }
    }

    addPoint() {
        this.score++;
        this.updateScoreUI();
        this.fish.remove();
        this.scoreElement.style.transform = 'scale(1.4)';
        setTimeout(() => this.scoreElement.style.transform = 'scale(1)', 200);
        setTimeout(() => this.spawnNewFish(), 500);
    }

    updateScoreUI() {
        this.scoreElement.innerHTML = `<i class="fa-solid fa-fish" style="color: #00a8ff; margin-right: 8px;"></i> ${this.score}`;
    }
}