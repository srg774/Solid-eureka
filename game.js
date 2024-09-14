window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 480;
    canvas.height = 800;

    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.1;
    let playerVelocityY = 2; // Start falling
    let playerVelocityX = 0;
    let isJumping = false;
    let canJump = false;

    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 2;
    const jumpStrength = 5;
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
        playerY = -playerHeight; // Start position off the top of the screen
        playerVelocityY = 2; // Start falling
        isJumping = false;
        canJump = false; // Initially not allowed to jump
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
        } else if (event.key === 'ArrowUp' || event.key === ' ') {
            jump();
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        }
    });

    function jump() {
        if (canJump) {
            playerVelocityY = -jumpStrength;
            isJumping = true;
            canJump = false;
        }
    }

    function checkBlockCollision() {
        let landed = false;
        canJump = false;
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY + playerHeight <= block.y + blockHeight + playerVelocityY
            ) {
                playerVelocityY = 0;
                playerY = block.y - playerHeight;
                isJumping = false;
                canJump = true;
                block.color = 'green';
                score += 1;
                gameSpeed += 0.05;
                landed = true;
                break;
            }
        }
        if (!landed) {
            canJump = false;
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

        playerVelocityY += gravity;
        if (playerVelocityY > maxSpeed) playerVelocityY = maxSpeed;

        playerY += playerVelocityY;
        playerX += playerVelocityX;

        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;

        blocks.forEach(block => {
            block.y += gameSpeed;
        });

        if (timestamp - lastBlockGenerationTime > blockGenerationInterval) {
            generateBlock();
            lastBlockGenerationTime = timestamp;
        }

        if (blocks.length > 0 && blocks[0].y > canvas.height) {
            blocks.shift();
        }

        checkBlockCollision();
        checkGameOver();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        blocks.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        ctx.drawImage(currentPlayerImage, playerX, playerY, playerWidth, playerHeight);

        requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        if (touchX < canvas.width / 2) {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        }
    });

    canvas.addEventListener('touchend', function(e) {
        playerVelocityX = 0;
    });

    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });
};
