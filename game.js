const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Load sprite sheets
const playerImageL = new Image();
const playerImageR = new Image();
playerImageL.src = 'assets/sprite_sheet_L.png';
playerImageR.src = 'assets/sprite_sheet_R.png';

playerImageL.onload = () => console.log('Left sprite loaded');
playerImageR.onload = () => console.log('Right sprite loaded');

// Player properties
const player = {
    x: 50,
    y: canvas.height - 150,
    width: 64,
    height: 96,
    frameX: 0,
    frameY: 0,
    speed: 5,
    velocityY: 0,
    jumping: false,
    facingRight: true
};

// Gravity and jump strength
const gravity = 0.5;
const jumpStrength = -12;

// Platform for player to stand on
const platform = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50
};

// Keys
const keys = {
    right: false,
    left: false,
    jump: false
};

// Draw player
function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platform
    ctx.fillStyle = '#654321'; // Brown color for the platform
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Determine which sprite sheet to use
    const sprite = player.facingRight ? playerImageR : playerImageL;
    ctx.drawImage(sprite, player.frameX * player.width, player.frameY * player.height, player.width, player.height, player.x, player.y, player.width, player.height);
}

// Update player
function updatePlayer() {
    // Horizontal movement
    if (keys.right) {
        player.x += player.speed;
        player.facingRight = true;
    } else if (keys.left) {
        player.x -= player.speed;
        player.facingRight = false;
    }

    // Jumping
    if (keys.jump && !player.jumping) {
        player.velocityY = jumpStrength;
        player.jumping = true;
    }

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Collision detection with platform
    if (player.y + player.height > platform.y) {
        player.y = platform.y - player.height;
        player.jumping = false;
    }

    // Animation logic (cycling through frames)
    if (keys.right || keys.left) {
        player.frameX = (player.frameX + 1) % 4; // Assuming 4 frames per row
    } else {
        player.frameX = 0; // Reset to the first frame when not moving
    }
}

// Game loop
function gameLoop() {
    drawPlayer();
    updatePlayer();
    requestAnimationFrame(gameLoop);
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === ' ') keys.jump = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === ' ') keys.jump = false;
});

// Event listeners for mobile controls
document.getElementById('leftBtn').addEventListener('touchstart', () => keys.left = true);
document.getElementById('leftBtn').addEventListener('touchend', () => keys.left = false);
document.getElementById('rightBtn').addEventListener('touchstart', () => keys.right = true);
document.getElementById('rightBtn').addEventListener('touchend', () => keys.right = false);
document.getElementById('jumpBtn').addEventListener('touchstart', () => keys.jump = true);
document.getElementById('jumpBtn').addEventListener('touchend', () => keys.jump = false);

// Start the game loop
gameLoop();

