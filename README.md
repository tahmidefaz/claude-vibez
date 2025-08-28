# Flappy Bird Game

A browser-based recreation of the classic Flappy Bird game built with HTML5 Canvas, CSS, and JavaScript. Features progressive difficulty, visual difficulty indicators, and audio support.

## Features

### Core Gameplay
- **Smooth Physics**: Realistic gravity and jump mechanics
- **Collision Detection**: Precise bird-to-pipe and bird-to-ground collision system
- **Score Tracking**: Points awarded for successfully passing through pipes
- **High Score**: Session-based high score tracking (resets on page refresh)

### Progressive Difficulty System
The game starts easy and gradually increases in difficulty based on your score:

- **Easy Mode (Score 0-9)**: Green pipes, slow movement, wide gaps
- **Medium Mode (Score 10-29)**: Yellow pipes, moderate speed, smaller gaps  
- **Hard Mode (Score 30+)**: Red pipes, fast movement, challenging gaps

Difficulty increases every 10 points after reaching score 10, affecting:
- Bird gravity and jump force
- Pipe movement speed
- Gap size between pipes
- Pipe spawn frequency

### Visual Features
- **Difficulty Color Coding**: Pipe colors indicate current difficulty level
- **Gradient Background**: Sky-to-ground visual transition
- **Game States**: Start screen, active gameplay, and game over screens
- **Real-time UI**: Live score and high score display

### Audio System
- **Background Music**: Loops `music.mp3` during gameplay
- **Game Over Sound**: Plays `gameover.mp3` when bird dies
- **Smart Audio Management**: Music stops on death, resumes on restart

## Controls

- **Spacebar**: Jump (during game) / Start or restart game (on screens)
- **Mouse Click**: Jump (during game) / Start or restart game (on screens)

## File Structure

```
flappy-bird/
├── index.html          # Main HTML structure
├── style.css           # Game styling and layout
├── script.js           # Game logic and mechanics
├── music.mp3           # Background music (user-provided)
├── gameover.mp3        # Game over sound effect (user-provided)
└── README.md           # This file
```

## Setup

1. **Clone or download** all files to a directory
2. **Add audio files**: Place `music.mp3` and `gameover.mp3` in the same directory
3. **Open in browser**: Launch `index.html` in any modern web browser
4. **Start playing**: Press spacebar or click to begin!

## Technical Details

### Game Constants (Easy Mode)
- **Gravity**: 0.15 (bird fall speed)
- **Jump Force**: -5 (upward velocity on jump)
- **Pipe Speed**: 1 (horizontal movement speed)
- **Pipe Gap**: 180 pixels (space between top and bottom pipes)
- **Spawn Rate**: Every 200 frames (~3.3 seconds at 60fps)

### Difficulty Scaling
Each difficulty level (every 10 points after score 10) increases:
- Gravity by 0.01
- Jump force by 0.05
- Pipe speed by 0.03
- Reduces gap by 1.5 pixels (minimum 120px)
- Reduces spawn rate by 2 frames (minimum 80 frames)

### Browser Compatibility
- **Modern browsers** with HTML5 Canvas support
- **Audio autoplay** may be blocked by browser policies (handled gracefully)
- **No external dependencies** - runs entirely in the browser

## Game Mechanics

1. **Physics Engine**: Custom gravity and velocity system
2. **Collision System**: Rectangle-based collision detection
3. **Difficulty Progression**: Dynamic scaling based on current score
4. **Audio Management**: Context-aware music and sound effects
5. **State Management**: Clean transitions between game states

## Customization

To modify game difficulty, edit the constants in `script.js`:

```javascript
const BASE_GRAVITY = 0.15;        // Bird fall speed
const BASE_JUMP_FORCE = -5;       // Jump strength  
const BASE_PIPE_SPEED = 1;        // Pipe movement speed
const BASE_PIPE_GAP = 180;        // Gap between pipes
const BASE_PIPE_SPAWN_RATE = 200; // Frames between pipes
```

## Development

Built with:
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic
- **CSS3** for styling and layout
- **Web Audio API** for sound management

No build process or external libraries required - just open and play!

---

**Enjoy the game!** 🐦