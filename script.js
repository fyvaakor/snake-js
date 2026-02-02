// board
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

var score = 0; // score
var highScore= localStorage.getItem("snakeHighScore") || 0; // high score

// head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;


var velocityX = 1;
var velocityY = 0;

var snakeBody = [];


// food
var foodX;
var foodY;

var gameOver = false;

window.onload = function() {
    board = this.document.getElementById("board");

    board.width = cols * blockSize;
    board.height = rows  * blockSize

    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1000/10);

    // mobile

    const btnMap = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0]
    };

    Object.keys(btnMap).forEach(id => {
        const [x, y] = btnMap[id];
        const btn = this.document.getElementById(id);

        // touch
        btn.addEventListener("touchstart", e => {
            e.preventDefault();
            setDirection(x, y);
        }, { passive: false });

        // pc fallback
        btn.addEventListener("click", () => {
            setDirection(x, y);
        });
    });

    // update();
};

function update() {
    if (gameOver) {
        return;
    }


    context.fillStyle="#242b25";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        score++;
        document.getElementById("score").innerText = "Score: " + score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            document.getElementById("highScore").innerText = "High Score: " + highScore
        }

        placeFood();
        
        document.getElementById("highScore").innerText = "High Score: " + highScore;
    }
    
    for (let i = snakeBody.length-1; i> 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle="lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

        // game over
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows * blockSize) {
        showGameOver();
        return;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            showGameOver();
            return;
        }
    }
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }

}

function setDirection(x, y) {
    if (velocityX === -x && velocityY === -y) return;
    velocityX = x;
    velocityY = y;
};

function showGameOver() {
    gameOver = true;
    document.getElementById("finalScore").innerText = "Score: " + score;
    document.getElementById("gameOverScreen").classList.remove("hidden")
}

function restartGame() {
    score = 0;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 1;
    velocityY = 0;
    snakeBody = [];
    gameOver = false;

    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("gameOverScreen").classList.add("hidden");

    placeFood();
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}