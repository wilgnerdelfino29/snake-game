const FPS = 12;
const CELLS = 20; // Number of cells on each row and column (e.g., 20 means a square of 20x20 cells)
const CELL_SIZE = 20;

let map = [];

const gameBackground = document.querySelector(".game-background");
const currentScore = document.querySelector("#current-score");
const bestScore = document.querySelector("#best-score");
const restartButton = document.querySelector("#restart");
const gameBoard = document.querySelector(".game-board");
const infoTexts = document.querySelectorAll(".info");

//styling elements
gameBoard.style.maxWidth = `${CELLS * CELL_SIZE}px`;
gameBoard.style.maxHeight = `${CELLS * CELL_SIZE}px`;
bestScore.innerHTML = localStorage.getItem("snake-game-best-score") ?? "0";
gameBackground.style.backgroundColor = Colors.background;
infoTexts.forEach((e) => {
  e.style.color = Colors.info;
  e.style.textShadow = `5px 5px 2px ${Colors.infoShadow}`;
});

//creating cells and positions, then adding positions to map
for (let i = 0; i < CELLS; i++) {
  for (let j = 0; j < CELLS; j++) {
    let cell = document.createElement("canvas");
    cell.style.width = `${CELL_SIZE}px`;
    cell.style.height = `${CELL_SIZE}px`;
    cell.style.backgroundColor = Colors.cell;
    cell.style.border = `1px solid ${Colors.cellBorder}`;

    gameBoard.appendChild(cell);
    map.push(new Position(j, i, cell));
  }
}

//return a position from the map based on the coordinates
const getPosition = (x, y) => map[x + y * CELLS];

//define a new position as food
const createFood = () => {
  let newFoodPosition;

  while (newFoodPosition === undefined) {
    const foodX = Math.floor(Math.random() * CELLS);
    const foodY = Math.floor(Math.random() * CELLS);

    if (!getPosition(foodX, foodY).isSnake()) {
      newFoodPosition = getPosition(foodX, foodY);
    }
  }

  newFoodPosition.cell.style.backgroundColor = Colors.food;
  newFoodPosition.cell.style.borderColor = Colors.foodBorder;
};

//creating player and food
let snake = new Snake([getPosition(9, 10)]);
createFood();

//restart the game
const restartGame = () => {
  window.location.reload();
};

//adding listener to restart button to restart game
const addEvent = (element, evnt, funct) => {
  if (element.attachEvent) return element.attachEvent("on" + evnt, funct);
  else return element.addEventListener(evnt, funct, false);
};

addEvent(restartButton, "click", restartGame);

//adding listener on keydown and keyup
const keydownHandler = (event) => {
  switch (event.key) {
    default:
      snake.switchDirection(event, play);
      return;
  }
};

const keyupHandler = (event) => {
  switch (event.key) {
    case " ":
      Themes.changeTheme(restartGame);
      break;
    default:
      return;
  }
};

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

//move snake, test if got food and if snake hit itself
const play = () => {
  const headPosition = snake.headPosition();
  const maxXY = CELLS - 1;

  let newPosition;

  switch (snake.direction) {
    case "up":
      newPosition = getPosition(
        headPosition.x,
        headPosition.y === 0 ? maxXY : headPosition.y - 1
      );
      break;
    case "down":
      newPosition = getPosition(
        headPosition.x,
        headPosition.y === maxXY ? 0 : headPosition.y + 1
      );
      break;
    case "left":
      newPosition = getPosition(
        headPosition.x === 0 ? maxXY : headPosition.x - 1,
        headPosition.y
      );
      break;
    case "right":
      newPosition = getPosition(
        headPosition.x === maxXY ? 0 : headPosition.x + 1,
        headPosition.y
      );
      break;
    default:
      return;
  }

  const gotFood = newPosition.isFood();
  const hitItself = newPosition.isSnake();

  snake.createNewPosition(newPosition);

  if (hitItself) {
    if (+currentScore.innerHTML > +bestScore.innerHTML) {
      bestScore.innerHTML = currentScore.innerHTML;
      localStorage.setItem("snake-game-best-score", bestScore.innerHTML);
    }
    restartButton.style.display = "inline";
    clearInterval(loop);
  } else if (gotFood) {
    createFood();
    currentScore.innerHTML++;
  } else {
    snake.removePosition();
  }
};

//starting play loop
let loop = setInterval(play, 1000 / FPS);
