const size = 15; // min 5
let snake = [[Math.floor(size / 2), Math.floor(size / 2)]];
let food = [Math.floor(size / 2), Math.floor(size / 2) + 2];
let dirChanges = 0;
let dir = [0,0];
const elements = [];
let canPlay = true;
let playing = false;
let score = 0;
let highScore = 0;
const msg = document.querySelector("#message");
const scoreElem = document.querySelector("#score");
const highScoreElem = document.querySelector("#highScore");
const keys = {
  w: [-1, 0],
  a: [0, -1],
  s: [1, 0],
  d: [0, 1],
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowRight: [0, 1],
  ArrowLeft: [0, -1]
};

function inSnake(coords) {
  for (const c of snake) {
    if (coords[0] == c[0] && coords[1] == c[1]) return true; 
  }
  return false;
}

function getNewFoodCoords() {
  const coords = [Math.floor(Math.random() * size), Math.floor(Math.random() * size)];
  if (inSnake(coords)) return getNewFoodCoords();
  else return coords;
}

function reset() {
  msg.innerHTML = "Start by pressing WASD or the arrow keys.";
  scoreElem.innerHTML = 0;
  score = 0;
  snake = [[Math.floor(size / 2), Math.floor(size / 2)]];
  food = [Math.floor(size / 2), Math.floor(size / 2) + 2];
  dir = [0, 0];
  dirChanges = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (snake[0][0] == i && snake[0][1] == j) {
        elements[i][j].id = "snakeHead";
        elements[i][j].classList.add("snake");
      } else if (food[0] == i && food[1] == j) {
        elements[i][j].id = "food";
        elements[i][j].classList.remove("snake");
      } else {
        elements[i][j].id = "";
        elements[i][j].classList.remove("snake");
      }
    }
  }
  msg.style.visibility = "visible";
  canPlay = true;
}

async function move(dirChange) {
  if (dirChange == dirChanges && playing) {
    const head = snake[snake.length - 1];
    const newRow = head[0] + dir[0], newCol = head[1] + dir[1]; 
    if (newRow < 0 || newCol < 0 || newRow >= size || newCol >= size || inSnake([newRow, newCol])) {
      playing = false;
      canPlay = false;
      highScore = Math.max(highScore, score);
      highScoreElem.innerHTML = highScore;
      setTimeout(reset, 1000);
      return;
    }
    else if (newRow == food[0] && newCol == food[1]) {
      elements[snake[snake.length - 1][0]][snake[snake.length - 1][1]].id = "";
      snake.push([newRow, newCol]);
      elements[food[0]][food[1]].classList.add("snake");
      elements[food[0]][food[1]].id = "snakeHead";
      score++;
      scoreElem.innerHTML = score;
      food = getNewFoodCoords();
      elements[food[0]][food[1]].id = "food";
    } else {
      elements[snake[0][0]][snake[0][1]].classList.remove("snake");
      elements[snake[0][0]][snake[0][1]].id = "";
      for (let i = 0; i < snake.length - 1; i++) {
        snake[i] = snake[i + 1];
      }
      elements[snake[snake.length - 1][0]][snake[snake.length - 1][1]].id = "";
      snake[snake.length - 1] = [newRow, newCol];
    }
    elements[newRow][newCol].classList.add("snake");
    elements[newRow][newCol].id = "snakeHead";
    setTimeout(move, 150, dirChange);
  }
}

window.addEventListener("load", () => {
  const grid = document.querySelector("#grid");
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const element = document.createElement("div");
      row.push(element);
      element.classList.add("element");
      grid.appendChild(element);
    }
    elements.push(row);
  }
  reset();
});

window.addEventListener("keydown", event => {
  if (canPlay && keys[event.key] && dir != keys[event.key] && !(dir[0] && keys[event.key][0]) && !(dir[1] && keys[event.key][1])) {
    if (!playing) {
      msg.style.visibility = "hidden";
      playing = true;
    }
    dir = keys[event.key];
    move(++dirChanges);
  }
});