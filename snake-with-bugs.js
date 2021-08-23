class SnakeGame {
  constructor(
    canvasElement,
    scoreElement,
    gameSpeed,
    pixelsPerGrid,
    growthIncrement
  ) {
    this.canvasElement = canvasElement;
    this.scoreElement = scoreElement;
    this.growthIncrement = growthIncrement;
    this.ctx = canvasElement.getContext("2d");
    this.gameSpeed = gameSpeed;
    this.boardPixelDimensions = [canvasElement.width, canvasElement.height];
    this.boardGridDimensions = [
      canvasElement.width / pixelsPerGrid,
      canvasElement.height / pixelsPerGrid,
    ];
    this.pixelsPerGrid = pixelsPerGrid;
    const startingPosition = [
      Math.round(this.boardGridDimensions[0] / 2),
      Math.round(this.boardGridDimensions[1] / 2),
    ];
    this.snakeState = [startingPosition];
    this.drawRect(
      startingPosition[0] * pixelsPerGrid,
      startingPosition[1] * pixelsPerGrid,
      pixelsPerGrid,
      pixelsPerGrid,
      "blue"
    );

    this.currentDirection = 0;
    this.newDirections = [];
    this.lastGridTime = null;

    this.growthSpurt = 0;
    this.score = 0;
    this.appleCoordinates = [];
    this.generateApple();
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => {
      const lastDirection =
        this.newDirections.length > 0
          ? this.newDirections[this.newDirections.length - 1]
          : this.currentDirection;
      switch (event.key) {
        case "ArrowLeft":
          if (
            lastDirection === 3 ||
            lastDirection === 4 ||
            lastDirection === 0
          ) {
            this.newDirections.push(1);
          }
          event.preventDefault();
          break;
        case "ArrowUp":
          if (
            lastDirection === 1 ||
            lastDirection === 2 ||
            lastDirection === 0
          ) {
            this.newDirections.push(3);
          }
          event.preventDefault();
          break;
        case "ArrowRight":
          if (
            lastDirection === 3 ||
            lastDirection === 4 ||
            lastDirection === 0
          ) {
            this.newDirections.push(2);
          }
          event.preventDefault();
          break;
        case "ArrowDown":
          if (
            lastDirection === 1 ||
            lastDirection === 2 ||
            lastDirection === 0
          ) {
            this.newDirections.push(4);
          }
          event.preventDefault();
          break;
        default:
          null;
      }
      if (this.currentDirection === 0) {
        this.lastGridTime = performance.now();
        this.render(this.lastGridTime);
      }
    });
  }

  generateApple() {
    const newApple = [
      Math.round(Math.random() * (this.boardGridDimensions[0] - 1)),
      Math.round(Math.random() * (this.boardGridDimensions[1] - 1)),
    ];
    const appleTouchesSnake = this.snakeState.find(function (grid) {
      return grid[0] === newApple[0] && grid[1] === newApple[1];
    });

    if (appleTouchesSnake) {
      this.generateApple();
    } else {
      this.appleCoordinates = newApple;
      this.drawRect(
        newApple[0] * this.pixelsPerGrid,
        newApple[1] * this.pixelsPerGrid,
        this.pixelsPerGrid,
        this.pixelsPerGrid,
        "red"
      );
    }
  }

  eatApple() {
    const headGrid = this.snakeState[this.snakeState.length - 1];
    if (
      headGrid[0] === this.appleCoordinates[0] &&
      headGrid[1] === this.appleCoordinates[1]
    ) {
      this.score++;
      this.scoreElement.innerHTML = this.score;
      this.growthSpurt += this.growthIncrement;
      this.generateApple();
    }
  }

  isTouching() {
    const lastGrid = this.snakeState[this.snakeState.length - 1];
    if (
      lastGrid[0] > this.boardGridDimensions[0] - 1 ||
      lastGrid[0] < 0 ||
      lastGrid[1] > this.boardGridDimensions[1] - 1 ||
      lastGrid[1] < 0
    ) {
      return true;
    }
    return false;
  }

  calculateMovement(newTimestamp) {
    return Math.round(
      (10 * this.pixelsPerGrid * (newTimestamp - this.lastGridTime)) / 1000
    );
  }

  drawRect(x, y, width, height, color) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  repaint(movementPixels) {
    if (this.growthSpurt < 1) {
      var tailDirection = this.currentDirection;
      const tailGrid = this.snakeState[0];
      if (this.snakeState.length > 1) {
        const secondTailGrid = this.snakeState[1];
        if (tailGrid[0] - 1 === secondTailGrid[0]) {
          tailDirection = 1;
        } else if (tailGrid[0] + 1 === secondTailGrid[0]) {
          tailDirection = 2;
        } else if (tailGrid[1] - 1 === secondTailGrid[1]) {
          tailDirection = 3;
        } else if (tailGrid[1] + 1 === secondTailGrid[1]) {
          tailDirection = 4;
        }
      }

      if (tailDirection === 1) {
        this.drawRect(
          tailGrid[0] * this.pixelsPerGrid +
            this.pixelsPerGrid -
            movementPixels,
          tailGrid[1] * this.pixelsPerGrid,
          movementPixels,
          this.pixelsPerGrid,
          "white"
        );
      } else if (tailDirection === 2) {
        this.drawRect(
          tailGrid[0] * this.pixelsPerGrid,
          tailGrid[1] * this.pixelsPerGrid,
          movementPixels,
          this.pixelsPerGrid,
          "white"
        );
      } else if (tailDirection === 3) {
        this.drawRect(
          tailGrid[0] * this.pixelsPerGrid,
          tailGrid[1] * this.pixelsPerGrid +
            this.pixelsPerGrid -
            movementPixels,
          this.pixelsPerGrid,
          movementPixels,
          "white"
        );
      } else if (tailDirection === 4) {
        this.drawRect(
          tailGrid[0] * this.pixelsPerGrid,
          tailGrid[1] * this.pixelsPerGrid,
          this.pixelsPerGrid,
          movementPixels,
          "white"
        );
      }
    }

    var headDirection = this.currentDirection;
    const headGrid = this.snakeState[this.snakeState.length - 1];
    if (headDirection === 1) {
      this.drawRect(
        headGrid[0] * this.pixelsPerGrid - movementPixels,
        headGrid[1] * this.pixelsPerGrid,
        movementPixels,
        this.pixelsPerGrid,
        "blue"
      );
    } else if (headDirection === 2) {
      this.drawRect(
        (headGrid[0] + 1) * this.pixelsPerGrid,
        headGrid[1] * this.pixelsPerGrid,
        movementPixels,
        this.pixelsPerGrid,
        "blue"
      );
    } else if (headDirection === 3) {
      this.drawRect(
        headGrid[0] * this.pixelsPerGrid,
        headGrid[1] * this.pixelsPerGrid - movementPixels,
        this.pixelsPerGrid,
        movementPixels,
        "blue"
      );
    } else if (headDirection === 4) {
      this.drawRect(
        headGrid[0] * this.pixelsPerGrid,
        (headGrid[1] + 1) * this.pixelsPerGrid,
        this.pixelsPerGrid,
        movementPixels,
        "blue"
      );
    }
  }

  updateSnakeState(newTimestamp) {
    if (this.currentDirection > 0) {
      const headGrid = this.snakeState[this.snakeState.length - 1];
      var nextGrid = [headGrid[0], headGrid[1]];
      switch (this.currentDirection) {
        case 1:
          nextGrid[0]--;
          break;
        case 2:
          nextGrid[0]++;
          break;
        case 3:
          nextGrid[1]--;
          break;
        case 4:
          nextGrid[1]++;
          break;
      }
      this.snakeState.push(nextGrid);
      this.drawRect(
        nextGrid[0] * this.pixelsPerGrid,
        nextGrid[1] * this.pixelsPerGrid,
        this.pixelsPerGrid,
        this.pixelsPerGrid,
        "blue"
      );

      if (this.growthSpurt < 1) {
        const tailGrid = this.snakeState[0];
        this.snakeState.shift();
        this.drawRect(
          tailGrid[0] * this.pixelsPerGrid,
          tailGrid[1] * this.pixelsPerGrid,
          this.pixelsPerGrid,
          this.pixelsPerGrid,
          "white"
        );
      } else {
        this.growthSpurt--;
      }
    }
    if (this.newDirections.length > 0) {
      this.currentDirection = this.newDirections[0];
      this.newDirections.shift();
    }
    this.lastGridTime = newTimestamp;
  }

  gameOver() {
    alert("game over! Score: " + this.score);
    newSnakeGame();
  }

  render(newTimestamp) {
    var movementPixels = this.calculateMovement(newTimestamp);
    if (movementPixels > 0) {
      if (movementPixels > this.pixelsPerGrid) {
        this.updateSnakeState(newTimestamp);
        movementPixels -= this.pixelsPerGrid;
        this.eatApple();
      }

      if (this.isTouching()) {
        return this.gameOver();
      } else {
        this.repaint(movementPixels);
      }
    }
    window.requestAnimationFrame((newTimestamp) => {
      this.render(newTimestamp);
    });
  }
}

function newSnakeGame() {
  const canvas = document.getElementById("gameBoard");
  const scoreElement = document.getElementById("score");
  const gameSpeed = document.getElementById("gameSpeed").value;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  scoreElement.innerHTML = "0";
  new SnakeGame(canvas, scoreElement, gameSpeed, 20, 3);
}

newSnakeGame();
