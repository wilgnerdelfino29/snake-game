class Colors {
  static cell = "rgb(24, 24, 37)"; //#181825
  static cellBorder = "rgb(34, 39, 56)"; //#222738
  static snake = "rgb(255, 255, 255)"; //#fff
  static food = "rgb(170, 68, 68)"; //#a44
}

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
    position.cell.style.borderColor = Colors.snake;
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
const MOVE_AWAIT_TIME = 150; //in milliseconds

let cells = 20,
  cellSize = 20,
  map = [],
  gameOver = false;

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

//remove food and snake positions
const clearPositions = () => {
  map.forEach((position) => {
    position.cell.style.backgroundColor = Colors.cell;
    position.cell.style.borderColor = Colors.cellBorder;
  });
};

//setup a new game
const restartGame = () => {
  restartButton.style = originalStyle.restartButton;
  currentScore.innerHTML = 0;
  clearPositions();
  createFood();
  snake = new Snake([getPosition(9, 10)]);
  loop = setInterval(play, MOVE_AWAIT_TIME);
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

//adding listener on keydown to control snake direction
document.addEventListener("keydown", switchDirection);
