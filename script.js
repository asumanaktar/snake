const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let direction = "right";
let nextDirection = "right";
let gameOver = false;
let score = 0;
let gameSpeed = 200;
let highScore = Number(localStorage.getItem("highScore")) || 0;

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#highScore");

highScoreElement.textContent = highScore;

let food = {
    x: 180,
    y: 200
};

let snake = [
    {
        x: 40,
        y: 200
    },
    {
        x: 20,
        y: 200
    }
];

function drawSnake() {
    ctx.fillStyle = "#1f3805";

    for (let i = 0; i < snake.length; i++) {

        ctx.fillRect(
            snake[i].x,
            snake[i].y,
            gridSize,
            gridSize
        );
    }
}

function drawFood() {
    ctx.fillStyle = "#8b0000";

    ctx.fillRect(
        food.x + 4,
        food.y + 4,
        12,
        12
    );

    ctx.fillStyle = "#1f3805";

    ctx.fillRect(
        food.x + 8,
        food.y + 1,
        4,
        4
    );
}

function generateFood() {
    let newX =
        Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;

    let newY =
        Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

    let onSnake = snake.some(
        part => part.x === newX && part.y === newY
    );

    if (onSnake) {
        generateFood();
    } else {
        food.x = newX;
        food.y = newY;
    }
}

function gameLoop() {

    direction = nextDirection;

    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let newHead = {
        x: snake[0].x,
        y: snake[0].y
    };

    if (direction === "right") {
        newHead.x += gridSize;
    }

    if (direction === "left") {
        newHead.x -= gridSize;
    }

    if (direction === "up") {
        newHead.y -= gridSize;
    }

    if (direction === "down") {
        newHead.y += gridSize;
    }

    if (
        newHead.x < 0 ||
        newHead.x >= canvas.width ||
        newHead.y < 0 ||
        newHead.y >= canvas.height
    ) {
        gameOver = true;
        drawGameOver();
        return;
    }

    let hitSelf = snake
        .slice(1)
        .some(
            part => part.x === newHead.x && part.y === newHead.y
        );

    if (hitSelf) {
        gameOver = true;
        drawGameOver();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreElement.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.textContent = highScore;
        }

        gameSpeed = Math.max(80, gameSpeed - 5);
        generateFood();
    } else {
        snake.pop();
    }

    drawSnake();
    drawFood();

    setTimeout(gameLoop, gameSpeed);
}

gameLoop();

function drawGameOver() {
    ctx.fillStyle = "#1f3805";
    ctx.font = "30px monospace";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 20
    );

    ctx.font = "20px monospace";

    ctx.fillText(
        `SCORE: ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 20
    );

    ctx.font = "16px monospace";

    const restartText = window.innerWidth <= 500
    ? "TAP TO RESTART"
    : "PRESS ENTER";

    ctx.fillText(
        restartText,
        canvas.width / 2,
        canvas.height / 2 + 55
    );
}

function restartGame() {
    snake = [
        {
            x: 40,
            y: 200
        },
        {
            x: 20,
            y: 200
        }
    ];

    direction = "right";
    nextDirection = "right";
    score = 0;
    gameSpeed = 200;
    gameOver = false;

    food.x = 180;
    food.y = 200;

    scoreElement.textContent = score;

    gameLoop();
}

document.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && gameOver) {
        restartGame();
        return;
    }

    if (event.key === "ArrowRight" && direction !== "left") {
        nextDirection = "right";
    }

    if (event.key === "ArrowUp" && direction !== "down") {
        nextDirection = "up";
    }

    if (event.key === "ArrowLeft" && direction !== "right") {
        nextDirection = "left";
    }

    if (event.key === "ArrowDown" && direction !== "up") {
        nextDirection = "down";
    }
});

const controlButtons = document.querySelectorAll(".controls button");

controlButtons.forEach(button => {

    button.addEventListener("click", () => {

        const newDirection = button.dataset.direction;

        if (newDirection === "right" && direction !== "left") {
            nextDirection = "right";
        }

        if (newDirection === "left" && direction !== "right") {
            nextDirection = "left";
        }

        if (newDirection === "up" && direction !== "down") {
            nextDirection = "up";
        }

        if (newDirection === "down" && direction !== "up") {
            nextDirection = "down";
        }
    });
});

canvas.addEventListener("click", () => {
    if (gameOver) {
        restartGame();
    }
});
