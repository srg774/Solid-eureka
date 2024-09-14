// Ensure that the script runs after the DOM is fully loaded
window.onload = function() {
    // Get the canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Define player variables
    const playerWidth = 64;
    const playerHeight = 96;
    const playerSpeed = 5;
    const gravity = 0.5;
    const jumpPower = -10;
    let isJumping = false;
    let isMovingLeft = false;
    let isMovingRight = false;
    let yVelocity = 0;
    
    // Load images
    const playerImageL = new Image();
    const playerImageR = new Image();
    playerImageL.src = 'sprite_sheet_L.png'; // Update with the correct path if needed
    playerImageR.src = 'sprite_sheet_R.png'; // Update with the correct path if needed

    // Ensure images are loaded before starting the game loop
    playerImageL.onload = function() {
        playerImageR.onload = function() {
            // Start the game loop
            gameLoop();
        };
    };

    // Define player position
    let playerX = canvas.width / 2 - playerWidth / 2;
    let playerY = canvas.height - playerHeight;

    // Handle key presses
    document.addEventListener('keydown', function(e) {
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

    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = false;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = false;
        }
    });

    // Mobile controls
    const controls = {
        left: false,
        right: false,
        jump: false
    };

    document.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        // Example: simple control zones
        if (touchX < canvas.width / 2) {
            controls.left = true;
        } else {
            controls.right = true;
        }
        if (touchY < canvas.height / 2) {
            controls.jump = true;
        }
    });

    document.addEventListener('touchend', function(e) {
        controls.left = false;
        controls.right = false;
        controls.jump = false;
    });

    // Game loop
    function gameLoop() {
        // Update player position
        if (isMovingLeft) {
            playerX -= playerSpeed;
        }
        if (isMovingRight) {
            playerX += playerSpeed;
        }
        if (controls.left) {
            playerX -= playerSpeed;
        }
        if (controls.right) {
            playerX += playerSpeed;
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

        // Draw background and player
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(playerImageR, 0, 0, playerWidth, playerHeight, playerX, playerY, playerWidth, playerHeight);

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};

