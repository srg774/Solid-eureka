window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 480;
    canvas.height = 800;

    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.2; // Adjusted for a more noticeable gravity effect
    let playerVelocityY = 0;
    let playerVelocityX = 0;

    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const jumpStrength = 8; // Higher value for a more noticeable flap
    const maxSpeed = 5;
    let playerX, playerY;

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
        playerY = canvas.height / 2 - playerHeight / 2; // Start position in the center
        playerVelocityY = 0;
        blocks.length = 0;
        generateInitialBlocks();
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
                color: 'blue'
            };
            blocks.push(block);
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        } else if (event.key === 'ArrowUp' || event.key === ' ') { // Jump on Up Arrow or Spacebar
            jump();
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        }
    });

    function jump() {
        // Apply an upward force to mimic flapping
        playerVelocityY = -jumpStrength;
    }

    function checkBlockCollision() {
        let landed = false;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY + playerHeight <= block.y + blockHeight + playerVelocityY
            ) {
                playerVelocityY = 0; // Stop vertical movement
                playerY = block.y - playerHeight; // Place player on top of block
                block.color = 'green'; // Change block color
                score += 1;
                gameSpeed += 0.05;
                landed = true;
                break;
            }
        }
        if (!landed && playerY + playerHeight < canvas.height) {
            // Ensure the player can still jump if falling
        }
    }

    function checkGameOver() {
        if (playerY > canvas.height) {
            isGameOver = true;
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
        }
    }

    const blockGenerationInterval = 1000;
    let lastBlockGenerationTime = 0;

    function gameLoop(timestamp) {
        if (isGameOver) {
            return;
        }

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
        if (blocks.length > 0 && blocks[0].y > canvas.height) {
            blocks.shift();
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

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        jump(); // Trigger jump on touch start
    });

    canvas.addEventListener('touchend', function(e) {
        playerVelocityX = 0;
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault(); // Prevent default scrolling
    });
};
