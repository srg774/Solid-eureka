window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Adjust canvas size for portrait mode
    canvas.width = 480;
    canvas.height = 800;

    // Game variables
    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.1;
    let playerVelocityY = 0;
    let playerVelocityX = 0;

    // Player variables
    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const maxSpeed = 2;
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
    const blockWidth = 50;
    const blockHeight = 15;
    const blockSpacing = 200;

    // Ensure the player images are loaded before starting the game loop
    let imagesLoaded = 0;
    playerImageRight.onload = playerImageLeft.onload = function() {
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
        playerY = -playerHeight;
        playerVelocityY = 1;
        blocks.length = 0;
        generateInitialBlocks();
    }

    // Generate initial blocks
    function generateInitialBlocks() {
        for (let i = 0; i < 5; i++) {
            generateBlock(canvas.height - i * blockSpacing);
        }
    }

    // Generate a new block when the last block is a certain distance from the top
    function generateBlock() {
        if (blocks.length === 0 || blocks[blocks.length - 1].y > blockSpacing) {
            const block = {
                x: Math.random() * (canvas.width - blockWidth),
                y: -blockHeight,
                width: blockWidth,
                height: blockHeight,
                color: 'blue'
            };
            blocks.push(block);
        }
    }

    // Event listeners for keyboard controls
    document.addEventListener('keydown', function(event) {
        console.log('Key down:', event.key); // Debugging output
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft; // Switch to left image
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight; // Switch to right image
        }
    });

    document.addEventListener('keyup', function(event) {
        console.log('Key up:', event.key); // Debugging output
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        }
    });

    // Check for collisions more efficiently
    function checkBlockCollision() {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY < block.y + blockHeight) {
                // Collision detected - land on the block
                playerVelocityY = 0;
                playerY = block.y - playerHeight;
                block.color = 'green';
                score += 1;
                gameSpeed += 0.05;
                break;
            }
        }
    }

    // Check if the player falls off the screen
    function checkGameOver() {
        if (playerY > canvas.height) {
            isGameOver = true;
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
        }
    }

    // Game loop
    function gameLoop() {
        if (isGameOver) {
            return;
        }

        // Apply gravity if not flying
        if (!isFlying) {
            playerVelocityY += gravity;
        } else {
            playerVelocityY -= 0.5;
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
        generateBlock();

        // Remove blocks that are out of view
        if (blocks.length > 0 && blocks[0].y > canvas.height) {
            blocks.shift();
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
