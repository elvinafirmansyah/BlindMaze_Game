import Horizontal from "./initialComponents/horizontal.js"
import Vertical from "./initialComponents/Vertical.js"
import Walls from "./initialComponents/Walls.js"
import Player from "./Player POV/Player.js"

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

    
  }

  update() {
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

    this.drawPlayer()
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

  drawPlayer() {
    const player = new Player(this.context, this.playerPosition.x, this.playerPosition.y, this._cellSize, this._cellSize);

    console.log(player)
    player.draw();

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

  changeDirection(e) {
    const keyPressed = e.keyCode;
  
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
  
    switch(true) {
      case (keyPressed == LEFT):
        console.log('left');
        break;
      case (keyPressed == RIGHT):
        console.log('right');
        break;
      case (keyPressed == UP):
        console.log('up');
        break;
      case (keyPressed == DOWN):
        console.log('down');
        break;
    }  
  }
  
}

export default Game;