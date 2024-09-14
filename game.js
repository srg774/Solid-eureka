window.onload = function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game variables
    let isGameOver = false;
    let gameSpeed = 1;
    let score = 0;

    // Player variables
    const playerWidth = 64;
    const playerHeight = 64; // Adjust the player's size for flying
    const playerSpeed = 5;
    let playerX, playerY;
    let isMovingUp = false;
    let isMovingDown = false;
    let isMovingLeft = false;
    let isMovingRight = false;

    // Load player images
    const playerImage = new Image();
    playerImage.src = 'sprite_sheet_R.png'; // Assume this image shows the character flying

    // Icons for collection
    const emailIcon = new Image();
    const messageIcon = new Image();
    emailIcon.src = 'email_icon.png'; // Replace with the path to your email icon
    messageIcon.src = 'message_icon.png'; // Replace with the path to your message icon

    const icons = []; // Array to hold the collectible icons

    // Ensure images are loaded before starting the game loop
    let imagesLoaded = 0;
    playerImage.onload = checkAllImagesLoaded;
    emailIcon.onload = checkAllImagesLoaded;
    messageIcon.onload = checkAllImagesLoaded;

    function checkAllImagesLoaded() {
        imagesLoaded++;
        if (imagesLoaded === 3) {
            resetGame();
            gameLoop();
        }
    }

    // Reset game state
    function resetGame() {
        isGameOver = false;
        gameSpeed = 1;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height / 2 - playerHeight / 2;
        icons.length = 0; // Clear existing icons
        generateIcons(); // Add new icons
    }

    // Generate random icons
    function generateIcons() {
        for (let i = 0; i < 5; i++) {
            addNewIcon();
        }
    }

    // Add a new icon at a random position
    function addNewIcon() {
        const iconType = Math.random() > 0.5 ? emailIcon : messageIcon; // Randomly select the icon
        icons.push({
            image: iconType,
            x: Math.random() * (canvas.width - 32),
            y: Math.random() * (canvas.height - 32),
            width: 32,
            height: 32,
        });
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

    // Check collision with icons
    function checkIconCollision() {
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i];
            if (playerX < icon.x + icon.width &&
                playerX + playerWidth > icon.x &&
                playerY < icon.y + icon.height &&
                playerY + playerHeight > icon.y) {
                // Collision detected
                icons.splice(i, 1); // Remove the icon
                score += 1; // Increase score
                gameSpeed += 0.05; // Increase difficulty
                addNewIcon(); // Add a new icon
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
        if (isMovingUp) playerY -= playerSpeed * gameSpeed;
        if (isMovingDown) playerY += playerSpeed * gameSpeed;
        if (isMovingLeft) playerX -= playerSpeed * gameSpeed;
        if (isMovingRight) playerX += playerSpeed * gameSpeed;

        // Check for collisions
        checkIconCollision();
        checkGameOver();

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw icons
        icons.forEach(icon => {
            ctx.drawImage(icon.image, icon.x, icon.y, icon.width, icon.height);
        });

        // Draw player
        ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);

        // Request next frame
        requestAnimationFrame(gameLoop);
    }
};
