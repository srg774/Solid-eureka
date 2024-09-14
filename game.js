window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let isGameOver = false;
    let gameSpeed = 2; // Initial scrolling speed
    let score = 0;

    // Player variables
    const playerWidth = 64;
    const playerHeight = 64;
    const playerSpeed = 5;
    let playerX, playerY;
    let isMovingUp = false;
    let isMovingDown = false;
    let isMovingLeft = false;
    let isMovingRight = false;

    // Load player image
    const playerImage = new Image();
    playerImage.src = 'sprite_sheet_R.png'; // Assume this image shows the character flying

    // Blocks
    const blocks = [];
    const blockSize = 50;

    // Ensure the player image is loaded before starting the game loop
    playerImage.onload = function () {
        resetGame();
        gameLoop();
    };

    // Reset game state
    function resetGame() {
        isGameOver = false;
        gameSpeed = 2;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height / 2 - playerHeight / 2;
        blocks.length = 0; // Clear existing blocks
        generateBlock(); // Add the first block
    }

    // Generate a new block at a random position
    function generateBlock() {
        const block = {
            x: canvas.width, // Start off-screen
            y: Math.random() * (canvas.height - blockSize),
            width: blockSize,
            height: blockSize,
            color: 'blue'
        };
        blocks.push(block);
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowUp') isMovingUp = true;
        if (e.key === 'ArrowDown') isMovingDown = true;
        if (e.key === 'ArrowLeft') isMovingLeft = true;
        if (e.key === 'ArrowRight') isMovingRight = true;
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowUp') isMovingUp = false;
        if (e.key === 'ArrowDown') isMovingDown = false;
        if (e.key === 'ArrowLeft') isMovingLeft = false;
        if (e.key === 'ArrowRight') isMovingRight = false;
    });

    // Mobile touch controls
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('touchmove', handleTouch);

    function handleTouch(e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Set directions based on touch position relative to the player
        isMovingUp = touchY < playerY;
        isMovingDown = touchY > playerY;
        isMovingLeft = touchX < playerX;
        isMovingRight = touchX > playerX;
    }

    document.addEventListener('touchend', function () {
        // Stop movement on touch end
        isMovingUp = isMovingDown = isMovingLeft = isMovingRight = false;
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
                gameSpeed += 0.1; // Increase difficulty
                generateBlock(); // Add a new block
                break;
            }
        }
    }

    // Check if the player flies off the screen
    function checkGameOver() {
        if (playerX < 0 || playerX + playerWidth > canvas.width || playerY < 0 || playerY + playerHeight > canvas.height) {
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
        if (isMovingUp) playerY -= playerSpeed;
        if (isMovingDown) playerY += playerSpeed;
        if (isMovingLeft) playerX -= playerSpeed;
        if (isMovingRight) playerX += playerSpeed;

        // Move blocks to the left to create the scrolling effect
        blocks.forEach(block => {
            block.x -= gameSpeed;
        });

        // Remove blocks that have moved off the screen
        blocks.forEach((block, index) => {
            if (block.x + block.width < 0) {
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
        ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};
