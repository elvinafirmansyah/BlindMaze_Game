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

    this.walls = new Walls(context, randNumber(0, this._boardWidth - 50, 50), randNumber(0, this._boardWidth - 50, 50), 50, 50)

    this.randomWalls = Array.from({length: this._rows}, () => [])

    const randIdx = randMazeIdx(0, mazes.length - 1)
    this.maze = mazes[randIdx]

    this.playerPosition = this.generatePlayerPosition();

    this._xVelocity = 0;
    this._yVelocity = 0;

    this.player = new Player(this.context, this.playerPosition.x, this.playerPosition.y, this._cellSize, this._cellSize);

    this.isOver = false;
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
  }

  update() {
    this.movePlayer();  
    this.checkGameover();
  }

  checkGameover() {
    for (let r = 0; r < this.randomWalls.length; r++) {
      for (let c = 0; c < this.randomWalls[0].length; c++) {
        const wall = this.randomWalls[r][c];
        if (wall) {
          if (wall.x === this.player.x && wall.y === this.player.y) {
            console.log('gameover')
            this.isOver = true;
          }
        }
      }
    }

    // console.log(this.randomWalls);
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
      const col = randMazeIdx(0, this._columns - (this._columns/2) - 1);

      // Check if the maze at this position is empty (no wall)
      if (this.maze[row][col] === "-" && this.maze[row][col] !== "E") {
        validPosition = true;

        // Convert grid coordinates to actual x, y positions
        x = col * this._cellSize;
        y = row * this._cellSize;
      }
    }

    return { x, y }; // Return the valid position as an object
  }

  changeDirection(e) {
    const keyPressed = e.keyCode;
    // console.log(keyPressed);
  
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
  
    switch(true) {
      case (keyPressed == LEFT):
        console.log('left');
        this._xVelocity = -this._cellSize
        this._yVelocity = 0;
        if (this.player.x === 0) {
          this._xVelocity = 0;
        } 
        break;
      case (keyPressed == RIGHT):
        console.log('right');
        this._xVelocity = this._cellSize
        this._yVelocity = 0
        if (this.player.x === this._boardWidth - this._cellSize) {
          this._xVelocity = 0;
        } 
        break;
      case (keyPressed == UP):
        console.log('up');
        this._xVelocity = 0
        this._yVelocity = -this._cellSize
        if (this.player.y === 0) {
          this._yVelocity = 0;
        } 
        break;
      case (keyPressed == DOWN):
        console.log('down');
        this._xVelocity = 0
        this._yVelocity = this._cellSize
        if (this.player.y === this._boardHeight - this._cellSize) {
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
          const wall = new Walls(this.context, c * 50, r * 50, this._cellSize, this._cellSize);
          this.randomWalls[r][c] = wall;
          wall.draw();
        }
      }
    }
  } 

  displayGameover() {

  }
  
}

export default Game;