import ExitDoor from "./initialComponents/ExitDoor.js";
import Horizontal from "./initialComponents/horizontal.js"
import Vertical from "./initialComponents/Vertical.js"
import Walls from "./initialComponents/Walls.js"
import Player from "./Player POV/Player.js"

const gameCountdown = document.getElementById('time-display');

let mazes = [
  [
    "111---1111", //1
    "11-------1", //2
    "11111-1111", //3
    "----------", //4
    "---------E", //5
    "----------", //6
    "------11--", //7
    "-------111", //8
    "111111----", //9
    "-----1111-", //10
  ],
  [
    "111---1111", //1
    "11-----111", //2
    "11111-1111", //3
    "----------", //4
    "1111111--E", //5
    "----------", //6
    "-11111111-", //7
    "-------111", //8
    "--111-----", //9
    "-----1111-", //10
  ],
]


function randNumber(min, max, cellSize) {
  const randNum = Math.round((Math.random() * (max - min) + min) / cellSize) * cellSize
  return randNum;
}

function randMazeIdx(min, max) {
  const randIdx = Math.round((Math.random() * (max - min) + min))
  return randIdx;
}

function countdownFormat(minutes, seconds) {
  let min = String(minutes);
  let sec = String(seconds);
  if (minutes <= 9) {
    min = '0' + min;
  }
  if (seconds <= 9) {
    sec = '0' + sec;
  }
  return `${min}:${sec}`
}

function isOdd(num) {
  return num % 2 !== 0;
}

class Game {
  _columns = 10
  _rows = 10
  _boardWidth = 500
  _boardHeight = 500
  _cellSize = 50;    
  constructor(context, canvas) {    
    this.context = context   
    this.canvas = canvas

    this.horizontalLine = Array.from({length: this._rows}, (_, i) => new Horizontal(context, i, this._boardWidth)) 

    this.verticalLine = Array.from({length: this._columns}, (_, i) => new Vertical(context, i, this._boardHeight)) 

    // this.walls = new Walls(context, randNumber(0, this._boardWidth - 50, 50), randNumber(0, this._boardWidth - 50, 50), 50, 50)

    this.randomWalls = Array.from({length: this._rows}, () => [])
  

    const randIdx = randMazeIdx(0, mazes.length - 1)
    this.maze = mazes[randIdx]

    this.playerPosition = this.generatePlayerPosition();

    this._xVelocity = 0;
    this._yVelocity = 0;

    this.player = new Player(this.context, this.playerPosition.x, this.playerPosition.y, this._cellSize, this._cellSize);

    this.isOver = false;

    this.minutes = 0;
    this.seconds = 20;

    this.text = new Player(this.context, this._boardWidth/2, this._boardHeight/2, 100, 100);
  }
  
  countdownTimer() {
    const countdownDisplay = setInterval(() => {
      // this.minutes--;
      this.seconds--;
      if (this.minutes >= 1) {
        if (this.seconds <= 0) {
          this.minutes--;
          this.seconds = 59;
        } 
      }
      if (this.seconds <= 0) {
        clearInterval(countdownDisplay);
        this.isOver = true;
      }
      gameCountdown.innerHTML = countdownFormat(this.minutes, this.seconds)
    }, 1000)
  }

  draw() {
    this.context.clearRect(0, 0, this._boardWidth, this._boardHeight);

    this.horizontalLine.forEach((line) => {
      if (line) {
        line.draw();
      } 
    })

    this.verticalLine.forEach((line) => {
      if (line) {
        line.draw()
      }
    })

    this.drawWalls();

    this.drawPlayer();

    this.displayGameover();
    // this.drawGameOver();

  }

  update() {
    this.movePlayer();  
    this.checkGameover();
    // this.displayGameover();
    // this.displayGameover();

    // this.displayGameover();
  }

  checkGameover() {
    for (let r = 0; r < this.randomWalls.length; r++) {
      for (let c = 0; c < this.randomWalls[0].length; c++) {
        const wall = this.randomWalls[r][c];
        if (wall) {
          if (wall.type === "wall") {
            if (wall.x === this.player.x - this._cellSize / 2 && wall.y === this.player.y - this._cellSize / 2) {
              this.isOver = true;
            }
          }
          if (wall.type === "exitdoor") {
            if (wall.x === this.player.x - this._cellSize / 2 && wall.y === this.player.y - this._cellSize / 2)
          }
        }
        console.log(wall)
      }
    }
  }

  movePlayer() {
    this.playerPosition.x += this._xVelocity;
    this.playerPosition.y += this._yVelocity;
    this.player.x = this.playerPosition.x;
    this.player.y = this.playerPosition.y;

    // Reset velocities after moving to avoid continuous movement
    this._xVelocity = 0;
    this._yVelocity = 0;
  }

  generatePlayerPosition() {
    let validPosition = false;
    let x, y;

    // Keep generating random positions until a valid one is found
    while (!validPosition) {
      // Generate random grid coordinates (row and column)
      const row = randMazeIdx(0, this._rows - 1);
      const col = randMazeIdx(0, this._columns - 1);

      // Check if the maze at this position is empty (no wall)
      if (this.maze[row][col] === "-" && this.maze[row][col] !== "E") {
          validPosition = true;

          // Convert grid coordinates to actual x, y positions
          x = (col * this._cellSize) + this._cellSize / 2;
          y = (row * this._cellSize) + this._cellSize / 2;
      }
    }

    return { x, y }; // Return the valid position as an object
  }

  changeDirection(e) {
    const keyPressed = e.keyCode;
  
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
  
    switch(true) {
      case (keyPressed == LEFT):
        console.log('left');
        this._xVelocity = -this._cellSize
        this._yVelocity = 0;
        if (this.player.x === 0 + this._cellSize/2) {
          this._xVelocity = 0;
        } 
        break;
      case (keyPressed == RIGHT):
        console.log('right');
        this._xVelocity = this._cellSize
        this._yVelocity = 0
        if (this.player.x === this._boardWidth - this._cellSize/2) {
          this._xVelocity = 0;
        } 
        break;
      case (keyPressed == UP):
        console.log('up');
        this._xVelocity = 0
        this._yVelocity = -this._cellSize
        if (this.player.y === 0 + this._cellSize/2) {
          this._yVelocity = 0;
        } 
        break;
      case (keyPressed == DOWN):
        console.log('down');
        this._xVelocity = 0
        this._yVelocity = this._cellSize
        if (this.player.y === this._boardHeight - this._cellSize /2) {
          this._yVelocity = 0;
        } 
        break;
    }
  }
  
  drawPlayer() {
    this.player.draw();
  }

  drawWalls() {
    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._columns; c++) {
        if (this.maze[r][c] !== "-" && this.maze[r][c] !== "E") {
          const wall = new Walls(this.context, c * this._cellSize, r * this._cellSize, this._cellSize, this._cellSize, "wall");
          this.randomWalls[r][c] = wall;
          wall.draw();
        }
        if (this.maze[r][c] === "E") {
          const exitDoor = new ExitDoor(this.context, c * this._cellSize + this._cellSize - 5, r * this._cellSize, 5, this._cellSize, "exitdoor");
          this.randomWalls[r][c] = exitDoor;
          exitDoor.draw();
        }
      }
    }
  } 

  displayGameover() {
    if (this.isOver) {
      console.log("GAMOVER")
      console.log(this.context);
      this.context.font = "60px Poppins";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";
      this.context.fillText("GAMEOVER", this._boardWidth/2, this._boardHeight/2)
    }
  }
  
}

export default Game;