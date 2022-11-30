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

  switchDirection = (event, callback) => {
    if (event.key === "ArrowUp" && this.goingVertical()) return;
    if (event.key === "ArrowDown" && this.goingVertical()) return;
    if (event.key === "ArrowLeft" && this.goingHorizontal()) return;
    if (event.key === "ArrowRight" && this.goingHorizontal()) return;

    switch (event.key) {
      case "ArrowUp":
        this.direction = "up";
        break;
      case "ArrowDown":
        this.direction = "down";
        break;
      case "ArrowLeft":
        this.direction = "left";
        break;
      case "ArrowRight":
        this.direction = "right";
        break;
      default:
        return;
    }

    callback();
  };
}
