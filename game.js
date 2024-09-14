window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let isGameOver = false;
    let gameSpeed = 1; // Initial scrolling speed
    let score = 0;

    // Player variables
    const playerWidth = 64;
    const playerHeight = 64;
    const playerSpeed = 5;
    let playerX, playerY;
    let isMovingLeft = false;
    let isMovingRight = false;

    // Load player images for left and right movement
    const playerImageRight = new Image();
    playerImageRight.src = 'sprite_sheet_R.png';
    const playerImageLeft = new Image();
    playerImageLeft.src = 'sprite_sheet_L.png';
    let currentPlayerImage = playerImageRight;

    // Blocks
    const blocks = [];
    const blockSize = 50;
    const blockSpacing = 200; // Distance between blocks

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
        gameSpeed = 1;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height - playerHeight;
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
        const block = {
            x: Math.random() * (canvas.width - blockSize),
            y: y,
            width: blockSize,
            height: blockSize,
            color: 'blue'
        };
        blocks.push(block);
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = true;
            currentPlayerImage = playerImageLeft;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = true;
            currentPlayerImage = playerImageRight;
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowLeft') isMovingLeft = false;
        if (e.key === 'ArrowRight') isMovingRight = false;
    });

    // Mobile touch controls
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);

    function handleTouch(e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;

        // Move player to the left or right based on touch position
        if (touchX < canvas.width / 2) {
            isMovingLeft = true;
            isMovingRight = false;
            currentPlayerImage = playerImageLeft;
        } else {
            isMovingRight = true;
            isMovingLeft = false;
            currentPlayerImage = playerImageRight;
        }
    }

    document.addEventListener('touchend', function () {
        // Stop movement on touch end
        isMovingLeft = isMovingRight = false;
    });

    // Check collision with blocks
    function checkBlockCollision() {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (playerX < block.x + block.width &&
                playerX + playerWidth > block.x &&
                playerY < block.y + block.height &&
                playerY + playerHeight > block.y) {
                // Collision detected
                block.color = 'green'; // Change color to indicate success
                score += 1; // Increase score
                gameSpeed += 0.1; // Gradually increase scrolling speed
                generateBlock(block.y - blockSpacing); // Add a new block above
                break;
            }
        }
    }

    // Check if the player falls off the screen
    function checkGameOver() {
        if (playerY > canvas.height || playerY + playerHeight < 0) {
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

        // Move the player
        if (isMovingLeft) playerX -= playerSpeed;
        if (isMovingRight) playerX += playerSpeed;

        // Prevent player from moving out of bounds
        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;

        // Move blocks and scroll screen
        blocks.forEach(block => {
            block.y += gameSpeed;
        });

        // Remove blocks that have moved off the screen
        blocks.forEach((block, index) => {
            if (block.y > canvas.height) {
                blocks.splice(index, 1);
            }
        });

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
