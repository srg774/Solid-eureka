window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 440; // Match with your HTML canvas width
    canvas.height = 800; // Match with your HTML canvas height

    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.2;
    let playerVelocityY = 0;
    let playerVelocityX = 0;

    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const jumpStrength = 4;
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
        playerY = canvas.height / 2 - playerHeight / 2;
        playerVelocityY = 0;
        playerVelocityX = 0;
        blocks.length = 0;
        generateInitialBlocks();
        document.getElementById('restartButton').style.display = 'none'; // Hide the restart button
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
                hit: false,
                missed: false
            };
            blocks.push(block);
        }
    }

    // Desktop Controls
    let jumpRequested = false; // Track if jump is requested

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        } else if (event.key === 'ArrowUp' || event.key === ' ') { // Jump on Up Arrow or Spacebar
            if (!jumpRequested) {
                jump();
                jumpRequested = true; // Set flag to prevent long presses
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        } else if (event.key === 'ArrowUp' || event.key === ' ') { // Reset jump request on key release
            jumpRequested = false;
        }
    });

    // Mobile Controls
    let isTouchingLeft = false;
    let isTouchingRight = false;
    let jumpRequestedTouch = false; // Track if jump is requested by touch

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch.clientX < canvas.width / 2) {
            isTouchingLeft = true;
        } else {
            isTouchingRight = true;
        }
        if (!jumpRequestedTouch) {
            jump();
            jumpRequestedTouch = true; // Set flag to prevent long presses
        }
    });

    canvas.addEventListener('touchend', function(e) {
        isTouchingLeft = false;
        isTouchingRight = false;
        playerVelocityX = 0;
        jumpRequestedTouch = false; // Reset jump request on touch end
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    function updateControls() {
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
        playerVelocityY = -jumpStrength;
    }

    function checkBlockCollision() {
        blocks.forEach(block => {
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY < block.y + blockHeight
            ) {
                playerVelocityY = -jumpStrength;
                playerY = block.y - playerHeight;
                block.color = 'green'; 
                block.hit = true; 
                score += 1;
                gameSpeed += 0.01;
            }
        });
    }

    function checkGameOver() {
        // Check if player has fallen below the screen
        if (playerY > canvas.height) {
            isGameOver = true;
        }

        // Check if any block has been missed
        blocks.forEach(block => {
            if (block.y > canvas.height && !block.hit) {
                block.missed = true; // Mark the block as missed
                isGameOver = true;
            }
        });
    }

    const blockGenerationInterval = 1000;
    let lastBlockGenerationTime = 0;

    function gameLoop(timestamp) {
        if (isGameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
            document.getElementById('restartButton').style.display = 'block'; // Show the restart button
            return;
        }

        updateControls();

        playerVelocityY += gravity;
        if (playerVelocityY > maxSpeed) playerVelocityY = maxSpeed;

        playerY += playerVelocityY;
        playerX += playerVelocityX;

        // Prevent pl
