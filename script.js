const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const startHighScoreElement = document.getElementById('startHighScore');
const gameOverHighScoreElement = document.getElementById('gameOverHighScore');

const GRAVITY = 0.25;
const JUMP_FORCE = -6;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
const PIPE_SPEED = 1.5;

let gameState = 'start';
let score = 0;
let highScore = 0;
let pipes = [];
let frameCount = 0;

const bird = {
    x: 80,
    y: canvas.height / 2,
    width: 30,
    height: 25,
    velocity: 0,
    
    update() {
        if (gameState === 'playing') {
            this.velocity += GRAVITY;
            this.y += this.velocity;
        }
    },
    
    jump() {
        if (gameState === 'playing') {
            this.velocity = JUMP_FORCE;
        }
    },
    
    draw() {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(this.x + 20, this.y + 5, 8, 6);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 5, this.y + 5, 3, 3);
    },
    
    reset() {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }
};

class Pipe {
    constructor(x) {
        this.x = x;
        this.width = PIPE_WIDTH;
        this.gap = PIPE_GAP;
        this.topHeight = Math.random() * (canvas.height - this.gap - 100) + 50;
        this.bottomY = this.topHeight + this.gap;
        this.passed = false;
    }
    
    update() {
        this.x -= PIPE_SPEED;
    }
    
    draw() {
        ctx.fillStyle = '#228B22';
        
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.fillRect(this.x, this.bottomY, this.width, canvas.height - this.bottomY);
        
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(this.x, this.topHeight - 30, this.width + 10, 30);
        ctx.fillRect(this.x, this.bottomY, this.width + 10, 30);
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
    
    collidesWith(bird) {
        if (bird.x < this.x + this.width &&
            bird.x + bird.width > this.x) {
            if (bird.y < this.topHeight ||
                bird.y + bird.height > this.bottomY) {
                return true;
            }
        }
        return false;
    }
}

function spawnPipe() {
    pipes.push(new Pipe(canvas.width));
}

function updatePipes() {
    if (frameCount % 150 === 0) {
        spawnPipe();
    }
    
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        
        if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
            pipes[i].passed = true;
            score++;
            scoreElement.textContent = score;
            
            if (score > highScore) {
                highScore = score;
                updateHighScoreDisplay();
            }
        }
        
        if (pipes[i].isOffScreen()) {
            pipes.splice(i, 1);
        }
    }
}

function checkCollisions() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
        return;
    }
    
    for (let pipe of pipes) {
        if (pipe.collidesWith(bird)) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameState = 'gameOver';
    finalScoreElement.textContent = score;
    gameOverHighScoreElement.textContent = highScore;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameState = 'playing';
    score = 0;
    frameCount = 0;
    pipes = [];
    bird.reset();
    scoreElement.textContent = score;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function startGame() {
    if (gameState === 'start') {
        resetGame();
    } else if (gameState === 'gameOver') {
        resetGame();
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#87CEEB');
    gradient.addColorStop(0.7, '#90EE90');
    gradient.addColorStop(1, '#90EE90');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    if (gameState === 'playing') {
        frameCount++;
        
        bird.update();
        updatePipes();
        checkCollisions();
    }
    
    for (let pipe of pipes) {
        pipe.draw();
    }
    
    bird.draw();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'gameOver') {
            startGame();
        } else {
            bird.jump();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'start' || gameState === 'gameOver') {
        startGame();
    } else {
        bird.jump();
    }
});

function updateHighScoreDisplay() {
    highScoreElement.textContent = `High Score: ${highScore}`;
    startHighScoreElement.textContent = highScore;
    gameOverHighScoreElement.textContent = highScore;
}

updateHighScoreDisplay();
gameLoop();