window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 480;
    canvas.height = 800;

    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.2;
    let playerVelocityY = 0;
    let playerVelocityX = 0;

    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const jumpStrength = 4; // Reduced bounce strength
    const maxSpeed = 5;
    let playerX, playerY;
    let canJump = true; // Flag to track if jumping is allowed
    let jumpRequested = false; // Flag to track if jump is requested

    const playerImageRight = new Image();
    playerImageRight.src = 'sprite_sheet_R.png';
    const playerImageLeft = new Image();
    playerImageLeft.src = 'sprite_sheet_L.png';
    let currentPlayerImage = playerImageRight;

    const blocks = [];
    const blockWidth = 50;
    const blockHeight = 15;
    const blockSpacing = 200;

    let imagesLoaded = 0;
    playerImageRight.onload = playerImageLeft.onload = function() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            resetGame();
            requestAnimationFrame(gameLoop);
        }
    };

    function resetGame() {
        isGameOver = false;
        gameSpeed = 0.5;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height / 2 - playerHeight / 2;
        playerVelocityY = 0;
        playerVelocityX = 0;
        blocks.length = 0;
        generateInitialBlocks();
        canJump = true; // Reset the jump flag
    }

    function generateInitialBlocks() {
        for (let i = 0; i < 5; i++) {
            generateBlock(canvas.height - i * blockSpacing);
        }
    }

    function generateBlock() {
        if (blocks.length === 0 || blocks[blocks.length - 1].y > blockSpacing) {
            const block = {
                x: Math.random() * (canvas.width - blockWidth),
                y: -blockHeight,
                width: blockWidth,
                height: blockHeight,
                color: 'blue',
                hit: false // Initialize as not hit
            };
            blocks.push(block);
        }
    }

    // Desktop Controls
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        } else if ((event.key === 'ArrowUp' || event.key === ' ') && canJump) { // Jump on Up Arrow or Spacebar
            if (!jumpRequested) {
                jumpRequested = true;
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        }
    });

    // Mobile Controls
    let isTouchingLeft = false;
    let isTouchingRight = false;

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch.clientX < canvas.width / 2) {
            isTouchingLeft = true;
        } else {
            isTouchingRight = true;
        }
        if (canJump && !jumpRequested) {
            jumpRequested = true;
        }
    });

    canvas.addEventListener('touchend', function(e) {
        isTouchingLeft = false;
        isTouchingRight = false;
        playerVelocityX = 0;
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    function updateControls() {
        // Update mobile controls if no keyboard input is active
        if (playerVelocityX === 0) {
            if (isTouchingLeft) {
                playerVelocityX = -playerSpeed;
                currentPlayerImage = playerImageLeft;
            } else if (isTouchingRight) {
                playerVelocityX = playerSpeed;
                currentPlayerImage = playerImageRight;
            }
        }
    }

    function jump() {
        if (canJump) {
            playerVelocityY = -jumpStrength;
            playerY += playerVelocityY; // Adjust player position immediately for a jump
            canJump = false; // Prevent continuous jumping
        }
    }

    function checkBlockCollision() {
        blocks.forEach(block => {
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY < block.y + blockHeight
            ) {
                // Bounce off the block
                playerVelocityY = -jumpStrength;
                playerY = block.y - playerHeight;
                block.color = 'green'; // Change color to indicate it was hit
                block.hit = true; // Mark block as hit
                score += 1;
                // Gradually increase game speed
                gameSpeed += 0.01;
                canJump = true; // Allow jump again after hitting a block
            }
        });
    }

    function checkGameOver() {
        blocks.forEach(block => {
            if (block.y > canvas.height && !block.hit) {
                isGameOver = true;
                ctx.fillStyle = 'black';
                ctx.font = '30px Arial';
                ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
                ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
            }
        });
    }

    const blockGenerationInterval = 1000;
    let lastBlockGenerationTime = 0;

    function gameLoop(timestamp) {
        if (isGameOver) {
            return;
        }

        // Update mobile controls
        updateControls();

        // Apply gravity
        playerVelocityY += gravity;
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
        if (blocks.length > 0 && blocks[blocks.length - 1].y > canvas.height) {
            blocks.shift();
        }

        // Handle jump request
        if (jumpRequested) {
            jump();
            jumpRequested = false; // Reset jump request
        }

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
