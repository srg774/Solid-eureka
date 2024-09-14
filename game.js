const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gravity = 0.8;
const jumpStrength = 15;
const playerSpeed = 5;

// Player object
const player = {
    x: 100,
    y: 100,
    width: 64,
    height: 96,
    dx: 0,
    dy: 0,
    isJumping: false,
    direction: 'right', // 'left' or 'right'
    frameX: 0,
    frameY: 0,
    speed: 5,
    jumping: false
};

// Load images for the player
const playerImageL = new Image();
playerImageL.src = 'sprite_sheet_L.png';
const playerImageR = new Image();
playerImageR.src = 'sprite_sheet_R.png';

// Load status for images
let imagesLoaded = 0;

playerImageL.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        startGame();
    }
};
playerImageR.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        startGame();
    }
};

// Keyboard controls
const keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
});

// Mobile controls
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

leftButton.addEventListener('mousedown', () => keys.left = true);
leftButton.addEventListener('mouseup', () => keys.left = false);
rightButton.addEventListener('mousedown', () => keys.right = true);
rightButton.addEventListener('mouseup', () => keys.right = false);
jumpButton.addEventListener('mousedown', () => keys.up = true);
jumpButton.addEventListener('mouseup', () => keys.up = false);

// Game loop
function startGame() {
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    updatePlayer();
    draw();
    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    // Horizontal movement
    if (keys.left) {
        player.dx = -playerSpeed;
        player.direction = 'left';
    } else if (keys.right) {
        player.dx = playerSpeed;
        player.direction = 'right';
    } else {
        player.dx = 0;
    }

    // Jumping
    if (keys.up && !player.jumping) {
        player.dy = -jumpStrength;
        player.jumping = true;
    }

    // Gravity
    player.dy += gravity;

    // Update position
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from falling through the floor
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.jumping = false;
    }

    // Update animation frame
    player.frameX = (player.frameX + 1) % 4; // Assuming 4 frames per row
}

function drawPlayer() {
    const spriteWidth = 64;
    const spriteHeight = 96;
    const frameY = 0; // Assuming the player always uses the first row

    if (player.direction === 'right') {
        ctx.drawImage(playerImageR, player.frameX * spriteWidth, frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
    } else {
        ctx.drawImage(playerImageL, player.frameX * spriteWidth, frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawPlayer();
}
