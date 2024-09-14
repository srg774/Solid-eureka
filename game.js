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
    let isJumping = false; // Track if the player is jumping
    let canJump = false; // Track if the player can jump

    // Player variables
    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const jumpStrength = 5; // Strength of the jump
    const maxSpeed = 5;
    let playerX, playerY;

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
            requestAnimationFrame(gameLoop);
        }
    };

    // Reset game state
    function resetGame() {
        isGameOver = false;
        gameSpeed = 0.5;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height - playerHeight - 100; // Starting position
        playerVelocityY = 0;
        isJumping = false;
        canJump = true; // Allow jumping at the start
        blocks.length = 0;
        generateInitialBlocks();
    }

    // Generate initial blocks
    function generateInitialBlocks() {
        for (let i = 0; i < 5; i++) {
            generateBlock(canvas.height - i * blockSpacing);
        }
    }

    // Generate a new block
    function generateBlock() {
        // Create a new block only if the last block is a certain distance away
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

    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        } else if (event.key === 'ArrowUp' || event.key === ' ') { // ArrowUp or spacebar for jump
            jump();
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        }
    });

    // Jump function
    function jump() {
        // Allow jumping if the player is in the air or on the ground
        if (!isJumping || canJump) {
            playerVelocityY = -jumpStrength; // Jumping gives an upward force
            isJumping = true; // Set jumping state to true
            canJump = false; // Prevent continuous jumping
        }
    }

    // Check for collisions and update jumping state
    function checkBlockCollision() {
        let landed = false; // Track if the player lands on any block
        canJump = false; // Reset the jump flag initially
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            // Check if the player is landing on the block
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight >= block.y &&
                playerY + playerHeight <= block.y + blockHeight + playerVelocityY // Adjust collision for landing
            ) {
                // Collision detected - land on the block
                playerVelocityY = 0; // Stop downward movement
                playerY = block.y - playerHeight; // Set player on top of the block
                isJumping = false; // Allow jumping again
                canJump = true; // Allow the player to jump again
                block.color = 'green'; // Change block color
                score += 1;
                gameSpeed += 0.05;
                landed = true;
                break;
            }
        }
        if (!landed) {
            canJump = false; // If no block collision, player cannot jump
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

    // Adjust block generation rate
    const blockGenerationInterval = 1000; // Time in milliseconds
    let lastBlockGenerationTime = 0;

    // Game loop
    function gameLoop(timestamp) {
        if (isGameOver) {
            return;
        }

        // Apply gravity
        playerVelocityY += gravity;

        // Cap the player's falling speed
        if (playerVelocityY > maxSpeed) playerVelocityY = maxSpeed;

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
        if (timestamp - lastBlockGenerationTime > blockGenerationInterval) {
            generateBlock();
            lastBlockGenerationTime = timestamp;
        }

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
