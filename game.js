// game.js

// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 800;
canvas.height = 400;

// Player properties
const player = {
    x: 50,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
};

// Platforms
const platforms = [
    { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 }, // ground
    { x: 200, y: canvas.height - 80, width: 100, height: 10 }, // platform 1
    { x: 400, y: canvas.height - 150, width: 100, height: 10 }, // platform 2
];

// Key press handlers
const keys = {
    right: false,
    left: false,
    up: false,
};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowUp' && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowLeft') keys.left = false;
});

// Update player position
function update() {
    // Horizontal movement
    if (keys.right) player.dx = player.speed;
    else if (keys.left) player.dx = -player.speed;
    else player.dx = 0;

    player.x += player.dx;

    // Vertical movement (gravity)
    player.dy += player.gravity;
    player.y += player.dy;

    // Collision detection with platforms
    player.grounded = false;
    for (let platform of platforms) {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        ) {
            // Collision detected
            player.grounded = true;
            player.dy = 0;
            player.y = platform.y - player.height;
        }
    }

    // Prevent falling off the canvas
    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // Prevent moving off the canvas horizontally
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw player and platforms
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = 'green';
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start the game
loop();
