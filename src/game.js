/**
 * @type {HTMLCanvasElement}
 */

const canvas = document.querySelector("#game");

const game = canvas.getContext("2d");

const playAgain = document.getElementById("playAgain");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const eatSound = new Audio("../assets/apple_eat-sound.mp3");
const gameplayMusic = new Audio("../assets/snakemusic.mp3");
const gameOverSound = new Audio("../assets/gameOver.mp3");

gameplayMusic.volume = 0.05;

eatSound.playbackRate = 2;

let speedSnake = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 1;

let appleY = 5;
let appleX = 5;

let x_Velocity = 0;
let y_Velocity = 0;

let score = 0;
//reset de game
playAgain.addEventListener("click", (event) => {
  event.preventDefault();
  speedSnake = 7;

  headX = 10;
  headY = 10;
  snakeParts = [];
  tailLength = 1;

  x_Velocity = 0;
  y_Velocity = 0;
  score = 0;

  startGame();
});

function startGame() {
  playAgain.disabled = true;
  gameplayMusic.play();
  changeSnakePosition();

  let resulst = isGameOver();
  if (resulst) return;

  clearScreen();

  checkAppleCollision();

  drawApple();
  drawSnake();
  drawScore();
  drawCurrentSpeed();

  if (score > 10) {
    speedSnake = 9;
  }
  if (score > 20) {
    speedSnake = 12;
  }
  if (score > 25) {
    speedSnake = 15;
  }

  setTimeout(startGame, 1000 / speedSnake);
}

function isGameOver() {
  let gameOver = false;
  if (y_Velocity === 0 && x_Velocity === 0) {
    return false;
  }
  //walls
  if (headX < 0 || headY < 0 || headX >= tileCount || headY >= tileCount) {
    gameOver = true;
  }
  //own body
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }
  if (gameOver) {
    game.fillStyle = "white";
    game.font = "50px sans-serif";

    let gradient = game.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    game.fillStyle = gradient;
    game.fillText(`Game Over!`, canvas.width / 6.5, canvas.height / 2);
    game.fillText(`Score: ${score}`, canvas.width / 3.5, canvas.height / 1.5);
    gameOverSound.play();
    gameplayMusic.pause();
    playAgain.disabled = false;
  }
  return gameOver;
}

function drawScore() {
  game.fillStyle = "white";
  game.font = "20px sans-serif";
  game.fillText(`Score: ${score}`, canvas.width - 90, 25);
}
function drawCurrentSpeed() {
  game.fillStyle = "white";
  game.font = "20px sans-serif";
  game.fillText(`Speed: ${speedSnake}`, canvas.width - 390, 25);
}
function clearScreen() {
  game.fillStyle = "black";
  game.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  game.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    game.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  // put an item at the end of the list next to the head
  snakeParts.push(new SnakePart(headX, headY));
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthers item from the snake parts if we have more than our tail size
  }
  game.fillStyle = "orange";
  game.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function changeSnakePosition() {
  headX = headX + x_Velocity;
  headY = headY + y_Velocity;
}

function drawApple() {
  game.fillStyle = "red";
  game.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);

    tailLength++;
    score++;
    eatSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //key up

  if (event.keyCode == 38) {
    if (y_Velocity == 1) return;
    y_Velocity = -1;
    x_Velocity = 0;
  }
  //key down
  if (event.keyCode == 40) {
    if (y_Velocity == -1) return;
    y_Velocity = 1;
    x_Velocity = 0;
  }
  //key left
  if (event.keyCode == 37) {
    if (x_Velocity == 1) return;
    y_Velocity = 0;
    x_Velocity = -1;
  }
  //key right
  if (event.keyCode == 39) {
    if (x_Velocity == -1) return;
    y_Velocity = 0;
    x_Velocity = 1;
  }
}

startGame();
