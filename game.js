window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let isGameOver = false;
    let gameSpeed = 1;
    let score = 0;

    // Player variables
    const playerWidth = 64;
    const playerHeight = 96;
    const playerSpeed = 5;
    const gravity = 0.5;
    const jumpPower = -10;
    let isJumping = false;
    let isMovingLeft = false;
    let isMovingRight = false;
    let yVelocity = 0;
    let currentPlayerImage = null;

    // Load images
    const playerImageL = new Image();
    const playerImageR = new Image();
    playerImageL.src = 'sprite_sheet_L.png';
    playerImageR.src = 'sprite_sheet_R.png';

    // Ensure images are loaded before starting the game loop
    let imagesLoaded = 0;
    playerImageL.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            currentPlayerImage = playerImageR; // Default to right-facing image
            resetGame();
            gameLoop();
        }
    };
    playerImageR.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            currentPlayerImage = playerImageR; // Default to right-facing image
            resetGame();
            gameLoop();
        }
    };

    // Player position
    let playerX, playerY;

    // Platforms
    const platforms = [];
    const platformWidth = 100;
    const platformHeight = 10;
    const platformCount = 10;
    const platformGap = 80;

    function generatePlatforms() {
        platforms.length = 0; // Clear existing platforms
        for (let i = 0; i < platformCount; i++) {
            platforms.push({
                x: Math.random() * (canvas.width - platformWidth),
                y: canvas.height - (i * platformGap) - platformHeight,
            });
        }
    }

    function resetGame() {
        isGameOver = false;
        gameSpeed = 1;
        score = 0;

        // Reset player position
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height - playerHeight - 10;
        yVelocity = 0;
        isJumping = false;

        // Generate platforms
        generatePlatforms();
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = true;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = true;
        }
        if (e.key === ' ' && !isJumping && !isGameOver) {
            isJumping = true;
            yVelocity = jumpPower;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = false;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = false;
        }
    });

    // Mobile touch controls
    const controls = {
        left: false,
        right: false,
        jump: false
    };

    document.addEventListener('touchstart', function (e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Simple touch control zones
        if (touchX < canvas.width / 3) {
            controls.left = true;
        } else if (touchX > canvas.width * 2 / 3) {
            controls.right = true;
        } else if (touchY < canvas.height / 2) {
            controls.jump = true;
        }
    });

    document.addEventListener('touchend', function () {
        controls.left = false;
        controls.right = false;
        controls.jump = false;
    });

    // Check collision with platforms
    function checkPlatformCollision() {
        platforms.forEach(platform => {
            if (playerX < platform.x + platformWidth &&
                playerX + playerWidth > platform.x &&
                playerY + playerHeight > platform.y &&
                playerY + playerHeight < platform.y + platformHeight + yVelocity) {
                // Collision detected - player lands on platform
                playerY = platform.y - playerHeight;
                yVelocity = jumpPower; // Bounce upwards
                isJumping = true;
                score += 1; // Increase score
                gameSpeed += 0.01; // Increase difficulty
            }
        });
    }

    // Check if the player falls below the screen or hits their head
    function checkGameOver() {
        if (playerY > canvas.height || playerY < 0) {
            isGameOver = true;
        }
    }

    // Game loop
    function gameLoop() {
        if (isGameOver) {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
            ctx.font = '20px Arial';
            ctx.fillText('Press Space to Restart', canvas.width / 2 - 100, canvas.height / 2 + 80);
            if (isJumping || controls.jump) { // Restart condition
                resetGame();
            }
            return; // Stop the game loop
        }

        // Update player position
        if (isMovingLeft || controls.left) {
            playerX -= playerSpeed;
            currentPlayerImage = playerImageL;
        }
        if (isMovingRight || controls.right) {
            playerX += playerSpeed;
            currentPlayerImage = playerImageR;
        }
        if (controls.jump && !isJumping) {
            isJumping = true;
            yVelocity = jumpPower;
        }

        // Apply gravity
        yVelocity += gravity;
        playerY += yVelocity;

        // Check for collisions
        checkPlatformCollision();
        checkGameOver();

        // Keep player within screen bounds
        if (playerX < 0) {
            playerX = 0;
        }
        if (playerX + playerWidth > canvas.width) {
            playerX = canvas.width - playerWidth;
        }

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw platforms
        ctx.fillStyle = '#8B4513';
        platforms.forEach(platform => {
            ctx.fillRect(platform.x, platform.y, platformWidth, platformHeight);
            platform.y += gameSpeed; // Move platforms down
            if (platform.y > canvas.height) { // Recycle platform
                platform.y = -platformHeight;
                platform.x = Math.random() * (canvas.width - platformWidth);
            }
        });

        // Draw player
        ctx.drawImage(currentPlayerImage, 0, 0, playerWidth, playerHeight, playerX, playerY, playerWidth, playerHeight);

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};




