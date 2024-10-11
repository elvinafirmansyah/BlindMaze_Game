import Horizontal from "./initialComponents/horizontal.js"
import Vertical from "./initialComponents/Vertical.js"
import Walls from "./initialComponents/Walls.js"

let maze1 = [
  "111---1111", //1
  "11-------1", //2
  "11111-1111", //3
  "----------", //4
  "----------", //5
  "----------", //6
  "------11--", //7
  "-------111", //8
  "111111----", //9
  "-----1111-", //10
]

function randNumber(min, max, cellSize) {
  //max = 500 - 50
  // min = 0
  //cellSize = 50

  // (40 * ((500 - 50) - 0) + 0 / 50) / 50
  // const randNum = Math.round((Math.random() * (max - min) + min / cellSize) * cellSize

  const randNum = Math.round((Math.random() * (max - min) + min) / cellSize) * cellSize
  // Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
  return randNum;
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

    this.walls.draw();

  }

  drawWalls() {

    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._columns; c++) {
        if (maze1[r][c] !== "-" ) {
          const maze_wall = new Walls(context, randNumber(0, this._boardWidth - 50, 50), randNumber(0, this._boardWidth - 50, 50), 50, 50)
        }
      }
    }
    
  }
  
  
}

export default Game;