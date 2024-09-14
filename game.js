window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Adjust canvas size for portrait mode
    canvas.width = 480; // Adjust width for portrait mode
    canvas.height = 800; // Adjust height for portrait mode

    // Game variables
    let isGameOver = false;
    let gameSpeed = 0.5; // Initial scrolling speed
    let score = 0;
    let gravity = 0.1; // Gravity to pull the player down
    let playerVelocityY = 0; // Player's vertical velocity
    let playerVelocityX = 0; // Player's horizontal velocity

    // Player variables
    const playerWidth = 30; // Smaller player sprite for mobile
    const playerHeight = 30;
    const playerSpeed = 2; // Speed of horizontal movement
    const maxSpeed = 2; // Max speed for the player
    let playerX, playerY;
    let isFlying = false;

    // Load player images for left and right movement
    const playerImageRight = new Image();
    playerImageRight.src = 'sprite_sheet_R.png';
    const playerImageLeft = new Image();
    playerImageLeft.src = 'sprite_sheet_L.png';
    let currentPlayerImage = playerImageRight;

    // Blocks
    const blocks = [];
    const blockWidth = 50; // Adjust block size for mobile
    const blockHeight = 15;
    const blockSpacing = 200; // Space between blocks to make it easier

    // Ensure the player images are loaded before starting the game loop
    let imagesLoaded = 0;
    playerImageRight.onload = playerImageLeft.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            resetGame();
            gameLoop();
        }
    };

    // Reset game state
    function resetGame() {
        isGameOver = false;
        gameSpeed = 0.5;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = -playerHeight; // Start from above the canvas
        playerVelocityY = 1; // Initial gentle falling speed
        blocks.length = 0; // Clear existing blocks
        generateInitialBlocks();
    }

    // Generate initial blocks
    function generateInitialBlocks() {
        for (let i = 0; i < 5; i++) {
            generateBlock(canvas.height - i * blockSpacing);
        }
    }

    // Generate a new block at a specified y position
    function generateBlock(y) {
        if (y > -blockHeight) {
            const block = {
                x: Math.random() * (canvas.width - blockWidth),
                y: y,
                width: blockWidth,
                height: blockHeight,
                color: 'blue'
            };
            blocks.push(block);
        }
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            isFlying = true; // Start flying
        }
        if (e.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        }
        if (e.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            isFlying = false; // Stop flying
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            playerVelocityX = 0; // Stop horizontal movement
        }
    });

    // Mobile touch controls
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);
    document.addEventListener('touchend', function () {
        // Stop movement on touch end
        playerVelocityX = 0;
        isFlying = false;
    });

    function handleTouch(e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Determine if the touch is in the upper half or lower half for flying
        if (touchY < canvas.height / 2) {
            isFlying = true;
        } else {
            isFlying = false;
        }

        // Move player to the left or right based on touch position
        if (touchX < canvas.width / 2) {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        }
    }

    // Check collision with blocks
    function checkBlockCollision() {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (playerX < block.x + block.width &&
                playerX + playerWidth > block.x &&
                playerY + playerHeight > block.y &&
                playerY < block.y + block.height) {
                // Collision detected - land on the block
                playerVelocityY = 0; // Stop falling
                playerY = block.y - playerHeight; // Place player on top of the block
                block.color = 'green'; // Change color to indicate success
                score += 1; // Increase score
                gameSpeed += 0.05; // Gradually increase scrolling speed
                break;
            }
        }
    }

    // Check if the player falls off the screen
    function checkGameOver() {
        if (playerY > canvas.height) {
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
            return; // Stop the game loop
        }

        // Apply gravity if not flying
        if (!isFlying) {
            playerVelocityY += gravity;
        } else {
            playerVelocityY -= 0.5; // Fly upward
        }

        // Cap the player's speed
        if (playerVelocityY > maxSpeed) playerVelocityY = maxSpeed;
        if (playerVelocityY < -maxSpeed) playerVelocityY = -maxSpeed;

        // Move the player
        playerY += playerVelocityY;
        playerX += playerVelocityX;

        // Prevent player from moving out of bounds
        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;

        // Move blocks and scroll screen
        blocks.forEach(block => {
            block.y += gameSpeed;
        });

        // Generate new blocks as needed
        if (blocks.length === 0 || blocks[blocks.length - 1].y > canvas.height - blockSpacing) {
            generateBlock(-blockHeight); // Generate a new block at the top
        }

        // Remove blocks that are out of view
        if (blocks.length > 0 && blocks[0].y > canvas.height) {
            blocks.shift(); // Remove the first block
        }

        // Check for collisions
        checkBlockCollision();
        checkGameOver();

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw blocks
        blocks.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        // Draw player
        ctx.drawImage(currentPlayerImage, playerX, playerY, playerWidth, playerHeight);

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};

