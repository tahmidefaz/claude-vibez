const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const startHighScoreElement = document.getElementById('startHighScore');
const gameOverHighScoreElement = document.getElementById('gameOverHighScore');

const BASE_GRAVITY = 0.15;
const BASE_JUMP_FORCE = -5;
const PIPE_WIDTH = 80;
const BASE_PIPE_GAP = 180;
const BASE_PIPE_SPEED = 1;
const BASE_PIPE_SPAWN_RATE = 200;

let currentGravity = BASE_GRAVITY;
let currentJumpForce = BASE_JUMP_FORCE;
let currentPipeGap = BASE_PIPE_GAP;
let currentPipeSpeed = BASE_PIPE_SPEED;
let currentPipeSpawnRate = BASE_PIPE_SPAWN_RATE;

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
            this.velocity += currentGravity;
            this.y += this.velocity;
        }
    },
    
    jump() {
        if (gameState === 'playing') {
            this.velocity = currentJumpForce;
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
        this.gap = currentPipeGap;
        this.topHeight = Math.random() * (canvas.height - this.gap - 100) + 50;
        this.bottomY = this.topHeight + this.gap;
        this.passed = false;
        this.difficultyLevel = this.getDifficultyLevel();
    }
    
    getDifficultyLevel() {
        if (score < 10) return 'easy';
        if (score < 30) return 'medium';
        return 'hard';
    }
    
    update() {
        this.x -= currentPipeSpeed;
    }
    
    draw() {
        let mainColor, capColor;
        
        switch(this.difficultyLevel) {
            case 'easy':
                mainColor = '#228B22';
                capColor = '#32CD32';
                break;
            case 'medium':
                mainColor = '#DAA520';
                capColor = '#FFD700';
                break;
            case 'hard':
                mainColor = '#DC143C';
                capColor = '#FF6B6B';
                break;
            default:
                mainColor = '#228B22';
                capColor = '#32CD32';
        }
        
        ctx.fillStyle = mainColor;
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        ctx.fillRect(this.x, this.bottomY, this.width, canvas.height - this.bottomY);
        
        ctx.fillStyle = capColor;
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
    if (frameCount % currentPipeSpawnRate === 0) {
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
            
            updateDifficulty();
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
    resetDifficulty();
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

function updateDifficulty() {
    if (score < 10) {
        return;
    }
    
    const difficultyLevel = Math.floor((score - 10) / 10);
    const difficultyMultiplier = difficultyLevel * 0.1;
    
    currentGravity = BASE_GRAVITY + (difficultyMultiplier * 0.1);
    currentJumpForce = BASE_JUMP_FORCE - (difficultyMultiplier * 0.5);
    currentPipeSpeed = BASE_PIPE_SPEED + (difficultyMultiplier * 0.3);
    currentPipeGap = Math.max(120, BASE_PIPE_GAP - (difficultyMultiplier * 15));
    currentPipeSpawnRate = Math.max(80, BASE_PIPE_SPAWN_RATE - (difficultyMultiplier * 20));
}

function resetDifficulty() {
    currentGravity = BASE_GRAVITY;
    currentJumpForce = BASE_JUMP_FORCE;
    currentPipeGap = BASE_PIPE_GAP;
    currentPipeSpeed = BASE_PIPE_SPEED;
    currentPipeSpawnRate = BASE_PIPE_SPAWN_RATE;
}

function updateHighScoreDisplay() {
    highScoreElement.textContent = `High Score: ${highScore}`;
    startHighScoreElement.textContent = highScore;
    gameOverHighScoreElement.textContent = highScore;
}

updateHighScoreDisplay();
gameLoop();