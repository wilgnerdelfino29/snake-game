class Position {
  constructor(x, y, cell) {
    this.x = x;
    this.y = y;
    this.cell = cell;
  }

  isFood = () => Colors.food === this.cell.style.backgroundColor;
  isSnake = () => Colors.snake === this.cell.style.backgroundColor;
}
