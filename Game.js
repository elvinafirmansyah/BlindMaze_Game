import ExitDoor from "./initialComponents/ExitDoor.js";
// import Horizontal from "./initialComponents/horizontal.js"
import Horizontal from "./initialComponents/Horizontal.js";
import Vertical from "./initialComponents/Vertical.js"
import Walls from "./initialComponents/Walls.js"
import Player from "./Player POV/Player.js"

// const gameCountdown = document.getElementById('time-display');
const moveTime = document.getElementById('move-countdown');
const memorizingTime = document.getElementById('memorizing-countdown');
const memorizingContainer = document.querySelector('.memorizing_container')
const moveContainer = document.querySelector('.move_container');

const heartContainer = document.getElementById('hearts');
const hearts = document.querySelectorAll('.heart_img');
const lastHeart = document.querySelector('#hearts .heart_img:last-child');
// console.log(lastHeart)
// console.log(hearts)
// console.log(moveTime, memorizingTime)
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
    "111111111-", //10
  ],
  [
    "111---1111", //1
    "11-----111", //2
    "11111-1111", //3
    "----------", //4
    "1111111---", //5
    "----------", //6
    "-11111111-", //7
    "-------111", //8
    "--111-----", //9
    "-----1111E", //10
  ],
  [
    "111---1111", //1
    "11-----111", //2
    "11-----111", //3
    "1---------", //4
    "--1111111-", //5
    "----------", //6
    "-111111--E", //7
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

function isOdd(num) {
  return num % 2 !== 0;
}

class Game {
  _columns = 10
  _rows = 10
  _boardWidth = 500
  _boardHeight = 500
  _cellSize = 50;   
  _hearts = 5; 
  initialPlayer = { x: 0, y: 0 };
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

    this.isWin = false;
    this.isOver = false;

    this.running = false;
    this.isLoseHeart = false;

    this.memorizingSeconds = 2;
    this.moveSeconds = 5;
    this.movingSeconds = 5;

    this.memorizingTimerStarted = false;

    this.text = new Player(this.context, this._boardWidth/2, this._boardHeight/2, 100, 100);
  }

  nextTick() {
    if (this.running) {
      this.draw();
      this.update();
      requestAnimationFrame(() => this.nextTick());
    } else {
      if (this.isOver) {
        this.displayGameover();
      } 
      if (this.isWin) {
        this.displayWin();
      }
    }
  }

  startTimer() {
    if (!this.memorizingTimerStarted) {
      this.draw();
      this.memorizingTimerStarted = true; 
      // Ensure it only starts once
      this.memorizingTimer();
    }
  }
  
  memorizingTimer() {
    const countdownDisplay = setInterval(() => {
      this.running = false;
      this.nextTick();
      this.memorizingSeconds--;
      memorizingTime.innerHTML = `${this.memorizingSeconds}s`


      if (this.memorizingSeconds <= 0) {
        clearInterval(countdownDisplay);

        this.running = true;
        this.draw();
        this.nextTick();

        memorizingContainer.classList.add("none");
        moveContainer.classList.remove("none");

        const moveCountdown = setInterval(() => {
          this.moveSeconds--;
          moveTime.innerHTML = `${this.moveSeconds}s`;
          if (this.moveSeconds <= 0) {
            clearInterval(moveCountdown)
            if (this.running) {
              this.isLoseHeart = true;
              this.removeHeart();
              alert(`you hit the wall, your heart is ${this._hearts} left`);

              this.moveSeconds = 5;
              moveTime.innerHTML = `${this.moveSeconds}s`;

              if (this._hearts <= 0) {
                this.running = false;
                this.isOver = true;
              }
              this.memorizingTimer();
            }

          } else if (!this.running) {
            clearInterval(moveCountdown)
          }
        }, 1000)

      }
      
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

  }

  update() {
    this.movePlayer();  
    this.checkGameover();
  }

  removeHeart() {
    const lastHeart = document.querySelector('#hearts .heart_img:last-child');
    console.log(lastHeart)
    if (lastHeart) {
      lastHeart.remove();
      this._hearts--;
    }
  }
  

  checkGameover() {
    for (let r = 0; r < this.randomWalls.length; r++) {
      for (let c = 0; c < this.randomWalls[0].length; c++) {
        const wall = this.randomWalls[r][c];
        if (wall) {
          if (wall.type === "wall") {
            if (wall.x === this.player.x - this._cellSize / 2 && wall.y === this.player.y - this._cellSize / 2) {
              if (!this.isLoseHeart) {
                this.isLoseHeart = true;
                this.removeHeart();
                // console.log(this.resetPlayer);

                this.playerPosition.x = this.initialPlayer.x;
                this.playerPosition.y = this.initialPlayer.y;
                this.player.x = this.playerPosition.x;
                this.player.y = this.playerPosition.y;
                
                this.isLoseHeart = false;

                alert(`you hit the wall, your heart is ${this._hearts} left`);
                this.moveSeconds = 5;
                moveTime.innerHTML = `${this.moveSeconds}s`;

                if (this._hearts <= 0) {
                  this.running = false;
                  this.isOver = true;
                }
                
              } 
              console.log(this.isLoseHeart);
            }
          }
          if (wall.type === "exitdoor") {
            if (wall.x === this.player.x + 20 && wall.y === this.player.y - this._cellSize/2) {
              setTimeout(() => {
                this.running = false;
              }, 300)
              this.isWin = true;
            }
          }
        }
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
    
    this.initialPlayer.x = x;
    this.initialPlayer.y = y;

    console.log(x, y)
    // console.log(x, y)
    return { x, y }; // Return the valid position as an object
  }

  changeDirection(e) {
    if (this.running) {
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
  }
  
  drawPlayer() {
    this.player.draw();
  }

  drawWalls() {
    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._columns; c++) {
        if (this.maze[r][c] !== "-" && this.maze[r][c] !== "E") {
          if (this.running) {
            const transparantWall = new Walls(this.context, c * this._cellSize, r * this._cellSize, this._cellSize, this._cellSize, "wall", "rgba(255, 255, 255, 0.0)");
            this.randomWalls[r][c] = transparantWall;
            transparantWall.draw();
          } else {
            const wall = new Walls(this.context, c * this._cellSize, r * this._cellSize, this._cellSize, this._cellSize, "wall", "rgba(255, 255, 255, 0.5)");
            this.randomWalls[r][c] = wall;
            wall.draw();
          }
          
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
      this.context.font = "60px Poppins";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";
      this.context.fillText("GAMEOVER", this._boardWidth/2, this._boardHeight/2)
    }
  }

  displayWin() {
    if (this.isWin) {
      this.context.font = "60px Poppins";
      this.context.fillStyle = "white";
      this.context.textAlign = "center";
      this.context.fillText("WIN", this._boardWidth/2, this._boardHeight/2)
    }
  }
  
}

export default Game;