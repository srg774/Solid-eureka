const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    jumping: false,
    flying: false,
    crouching: false
};

let platforms = [
    { x: 0, y: canvas.height - 30, width: canvas.width, height: 30 } // Ground
];

const gravity = 0.8;
const jumpStrength = -15;

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'black';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function updatePlayer() {
    // Apply gravity
    if (!player.flying) {
        player.velocityY += gravity;
    } else {
        player.velocityY = 0;
    }

    player.y += player.velocityY;

    // Platform collision detection
    platforms.forEach(platform => {
        if (player.y + player.height > platform.y && player.y + player.height < platform.y + platform.height &&
            player.x + player.width > platform.x && player.x < platform.x + platform.width) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.jumping = false;
        }
    });

    // Ensure player stays within canvas bounds
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
    }
}

function handleInput() {
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['Space'] && !player.jumping) {
        player.velocityY = jumpStrength;
        player.jumping = true;
    }
    if (keys['ArrowDown']) {
        player.crouching = true;
        player.height = 25; // Crouch height
    } else {
        player.crouching = false;
        player.height = 50; // Default height
    }
    if (keys['F']) {
        player.flying = true;
    } else {
        player.flying = false;
    }
}

let keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawPlatforms();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

gameLoop();

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
