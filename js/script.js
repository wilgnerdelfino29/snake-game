class Themes {
  static availableThemes = () => [
    Themes.modern,
    Themes.monochrome,
    Themes.retro,
    Themes.blackAndWhite,
    Themes.funny,
    Themes.glass,
  ];

  static modern = {
    cell: "rgb(24, 24, 37)",
    cellBorder: "rgb(34, 39, 56)",
    snake: "rgb(255, 255, 255)",
    snakeBorder: "rgb(255, 255, 255)",
    food: "rgb(170, 68, 68)",
    foodBorder: "rgb(170, 68, 68)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(24, 24, 37)",
    background: "rgb(34, 39, 56)",
  };

  static monochrome = {
    cell: "rgb(0, 0, 0)",
    cellBorder: "rgb(0, 255, 0)",
    snake: "rgb(0, 255, 0)",
    snakeBorder: "rgb(0, 255, 0)",
    food: "rgb(0, 254, 0)",
    foodBorder: "rgb(0, 254, 0)",
    info: "rgb(0, 255, 0)",
    infoShadow: "rgb(0, 30, 0)",
    background: "rgb(0, 0, 0)",
  };

  static retro = {
    cell: "rgb(0, 0, 0)",
    cellBorder: "rgb(0, 0, 0)",
    snake: "rgb(0, 255, 0)",
    snakeBorder: "rgb(0, 0, 0)",
    food: "rgb(255, 0, 0)",
    foodBorder: "rgb(255, 0, 0)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(0, 60, 0)",
    background: "rgb(0, 60, 0)",
  };

  static blackAndWhite = {
    cell: "rgb(90, 90, 90)",
    cellBorder: "rgb(90, 90, 90)",
    snake: "rgb(30, 30, 30)",
    snakeBorder: "rgb(30, 30, 30)",
    food: "rgb(180, 180, 180)",
    foodBorder: "rgb(180, 180, 180)",
    info: "rgb(180, 180, 180)",
    infoShadow: "rgb(30, 30, 30)",
    background: "rgb(20, 20, 20)",
  };

  static funny = {
    cell: "rgb(120, 200, 68)",
    cellBorder: "rgb(140, 200, 68)",
    snake: "rgb(30, 80, 220)",
    snakeBorder: "rgb(30, 80, 220)",
    food: "rgb(240, 68, 68)",
    foodBorder: "rgb(240, 68, 68)",
    info: "rgb(221, 221, 221)",
    infoShadow: "rgb(30, 130, 150)",
    background: "rgb(30, 130, 150)",
  };

  static glass = {
    cell: "rgb(30, 200, 200)",
    cellBorder: "rgb(30, 190, 190)",
    snake: "rgb(221, 221, 221)",
    snakeBorder: "rgb(20, 20, 20)",
    food: "rgb(200, 80, 120)",
    foodBorder: "rgb(20, 20, 20)",
    info: "rgb(30, 150, 150)",
    infoShadow: "rgb(221, 221, 221)",
    background: "rgb(221, 221, 221)",
  };
}

//define theme
const defineTheme = () => {
  if (localStorage.getItem("snake-game-theme-index") !== null) {
    const nextThemeIndex = localStorage.getItem("snake-game-theme-index");
    currentTheme = Themes.availableThemes()[nextThemeIndex];
  }

  console.log("currentTheme: ");
  console.log(currentTheme);
};

const MOVE_AWAIT_TIME = 120; //in milliseconds

let cells = 20,
  cellSize = 20,
  map = [],
  gameOver = false,
  currentTheme = Themes.modern;

defineTheme();

class Colors {
  static cell = currentTheme["cell"];
  static cellBorder = currentTheme["cellBorder"];
  static snake = currentTheme["snake"];
  static snakeBorder = currentTheme["snakeBorder"];
  static food = currentTheme["food"];
  static foodBorder = currentTheme["foodBorder"];
  static info = currentTheme["info"];
  static infoShadow = currentTheme["infoShadow"];
  static background = currentTheme["background"];
}

//set initial style colors with Colors class
document.querySelector(".game-background").style.backgroundColor =
  Colors.background;

document.querySelectorAll(".info").forEach((e) => {
  e.style.color = Colors.info;
  e.style.textShadow = `5px 5px 2px ${Colors.infoShadow}`;
});

class Position {
  constructor(x, y, cell) {
    this.x = x;
    this.y = y;
    this.cell = cell;
  }

  isFood = () => Colors.food === this.cell.style.backgroundColor;
  isSnake = () => Colors.snake === this.cell.style.backgroundColor;
}

class Snake {
  constructor(positions, direction = null) {
    this.positions = [];
    this.direction = direction;
    positions.forEach((position) => this.createNewPosition(position));
  }

  goingVertical = () => this.direction === "up" || this.direction === "down";

  goingHorizontal = () =>
    this.direction === "left" || this.direction === "right";

  headPosition = () => this.positions[this.positions.length - 1];

  createNewPosition = (position) => {
    position.cell.style.backgroundColor = Colors.snake;
    position.cell.style.borderColor = Colors.snakeBorder;
    this.positions = [...this.positions, position];
  };

  removePosition = () => {
    const removedPosition = this.positions.shift();
    removedPosition.cell.style.backgroundColor = Colors.cell;
    removedPosition.cell.style.borderColor = Colors.cellBorder;
  };
}

const currentScore = document.querySelector("#current-score");
const bestScore = document.querySelector("#best-score");
const restartButton = document.querySelector("#restart");

if (localStorage.getItem("snake-game-best-score") !== null) {
  bestScore.innerHTML = localStorage.getItem("snake-game-best-score");
}

const originalStyle = {
  restartButton: restartButton.style,
};

const gameBoard = document.querySelector(".game-board");
gameBoard.style.maxWidth = `${cells * cellSize}px`;
gameBoard.style.maxHeight = `${cells * cellSize}px`;

const addEvent = (element, evnt, funct) => {
  if (element.attachEvent) return element.attachEvent("on" + evnt, funct);
  else return element.addEventListener(evnt, funct, false);
};

const getPosition = (x, y) => map[x + y * cells];

//define a new position as food
const createFood = () => {
  let newFoodPosition;

  while (newFoodPosition === undefined) {
    const foodX = Math.floor(Math.random() * cells);
    const foodY = Math.floor(Math.random() * cells);

    if (!getPosition(foodX, foodY).isSnake()) {
      newFoodPosition = getPosition(foodX, foodY);
    }
  }

  newFoodPosition.cell.style.backgroundColor = Colors.food;
  newFoodPosition.cell.style.borderColor = Colors.foodBorder;
};

//handle keydown
const keydownHandler = (event) => {
  switch (event.key) {
    default:
      switchDirection(event);
      return;
  }
};

//handle keyup
const keyupHandler = (event) => {
  switch (event.key) {
    case " ":
      changeTheme(event);
      break;
    default:
      return;
  }
};

//change theme
const changeTheme = () => {
  const themes = Themes.availableThemes();
  let nextThemeIndex = themes.indexOf(currentTheme) + 1;

  if (nextThemeIndex === themes.length) {
    nextThemeIndex = 0;
  }

  localStorage.setItem("snake-game-theme-index", nextThemeIndex);
  restartGame();
};

//control snake direction
const switchDirection = (event) => {
  if (event.key === "ArrowUp" && snake.goingVertical()) return;
  if (event.key === "ArrowDown" && snake.goingVertical()) return;
  if (event.key === "ArrowLeft" && snake.goingHorizontal()) return;
  if (event.key === "ArrowRight" && snake.goingHorizontal()) return;

  switch (event.key) {
    case "ArrowUp":
      snake.direction = "up";
      break;
    case "ArrowDown":
      snake.direction = "down";
      break;
    case "ArrowLeft":
      snake.direction = "left";
      break;
    case "ArrowRight":
      snake.direction = "right";
      break;
    default:
      return;
  }
};

//move snake, test if got food and if snake hit itself
const play = () => {
  const headPosition = snake.headPosition();
  const maxXY = cells - 1;

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
    gameOver = true;
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

//restart game refreshing the page
const restartGame = () => {
  window.location.reload();
};

//creating cells and positions, then adding positions to map
for (let i = 0; i < cells; i++) {
  for (let j = 0; j < cells; j++) {
    let cell = document.createElement("canvas");
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    cell.style.backgroundColor = Colors.cell;
    cell.style.border = `1px solid ${Colors.cellBorder}`;

    document.querySelector(".game-board").appendChild(cell);
    map.push(new Position(j, i, cell));
  }
}

//defining food and player
createFood();
let snake = new Snake([getPosition(9, 10)]);

//starting play loop
let loop = setInterval(play, MOVE_AWAIT_TIME);

//adding listener to restart button to restart game
addEvent(restartButton, "click", restartGame);

//adding listener on keydown and keyup
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
