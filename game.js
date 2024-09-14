window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

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
            gameLoop();
        }
    };
    playerImageR.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            currentPlayerImage = playerImageR; // Default to right-facing image
            gameLoop();
        }
    };

    // Player position
    let playerX = canvas.width / 2 - playerWidth / 2;
    let playerY = canvas.height - playerHeight - 10;

    // Platforms
    const platforms = [];
    const platformWidth = 100;
    const platformHeight = 10;
    const platformCount = 10;
    const platformGap = 80;
    const platformSpeed = 2;

    function generatePlatforms() {
        for (let i = 0; i < platformCount; i++) {
            platforms.push({
                x: Math.random() * (canvas.width - platformWidth),
                y: canvas.height - (i * platformGap) - platformHeight,
            });
        }
    }

    // Generate platforms at the start
    generatePlatforms();

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = true;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = true;
        }
        if (e.key === ' ' && !isJumping) {
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

    document.addEventListener('touchend', function (e) {
        controls.left = false;
        controls.right = false;
        controls.jump = false;
    });

    // Game loop
    function gameLoop() {
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

        // Gravity
        yVelocity += gravity;
        playerY += yVelocity;

        // Check for ground collision
        if (playerY > canvas.height - playerHeight) {
            playerY = canvas.height - playerHeight;
            yVelocity = 0;
            isJumping = false;
        }

        // Check for platform collision
        platforms.forEach(platform => {
            if (playerX < platform.x + platformWidth &&
                playerX + playerWidth > platform.x &&
                playerY + playerHeight > platform.y &&
                playerY + playerHeight < platform.y + platformHeight + yVelocity) {
                playerY = platform.y - playerHeight;
                yVelocity = jumpPower; // Bounce upwards
                isJumping = true;
            }
        });

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
        });

        // Draw player
        ctx.drawImage(currentPlayerImage, 0, 0, playerWidth, playerHeight, playerX, playerY, playerWidth, playerHeight);

        // Scroll platforms downward to create a jumping effect
        platforms.forEach(platform => {
            platform.y += platformSpeed;
            if (platform.y > canvas.height) {
                platform.y = -platformHeight;
                platform.x = Math.random() * (canvas.width - platformWidth);
            }
        });

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};



