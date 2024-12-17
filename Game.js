import { hideGame } from "./Start.js";
import ExitDoor from "./initialComponents/ExitDoor.js";
import Horizontal from "./initialComponents/Horizontal.js";
import Vertical from "./initialComponents/Vertical.js"
import Walls from "./initialComponents/Walls.js"
import Player from "./Player POV/Player.js"
import mazes from './data/mazes.js';
// const gameCountdown = document.getElementById('time-display');
const moveTime = document.getElementById('move-countdown');
const memorizingTime = document.getElementById('memorizing-countdown');
const memorizingContainer = document.querySelector('.memorizing_container')
const moveContainer = document.querySelector('.move_container');

const allHearts = document.querySelectorAll('.heart_img');

const roundText = document.querySelector('.round');


function generateMazeIdx (min, max, data) {
  console.log(data);
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
  _stage = 0;
  _movingSec = 20;
  _memorizingSec = 10;
  initialPlayer = { x: 0, y: 0 };
  mazeData = [];
  constructor(context, canvas) {    
    this.context = context   
    this.canvas = canvas

    this.horizontalLine = Array.from({length: this._rows}, (_, i) => new Horizontal(context, i, this._boardWidth)) 

    this.verticalLine = Array.from({length: this._columns}, (_, i) => new Vertical(context, i, this._boardHeight)) 

    // this.walls = new Walls(context, randNumber(0, this._boardWidth - 50, 50), randNumber(0, this._boardWidth - 50, 50), 50, 50)

    this.randomWalls = Array.from({length: this._rows}, () => [])
  
    this.randIdx = this.generateMazeIdx(0, mazes.length - 1, this.mazeData);
    
    // this.randIdx = randMazeIdx(0, mazes.length - 1)
    
    // this.maze = mazes[this._stage];
    this.maze = mazes[this.randIdx];

    this.totalStage = 3;

    this.playerPosition = this.generatePlayerPosition();

    this._xVelocity = 0;
    this._yVelocity = 0;

    this.player = new Player(this.context, this.playerPosition.x, this.playerPosition.y, this._cellSize, this._cellSize);

    this.isWin = false;
    this.isOver = false;

    this.moveCountdownId = null;

    this.running = false;
    this.isLoseHeart = false;
    this.isNextStage = false;

    this.memorizingSeconds = this._memorizingSec;
    this.moveSeconds = this._movingSec;

    this.memorizingTimerStarted = false;

    this.text = new Player(this.context, this._boardWidth/2, this._boardHeight/2, 100, 100);
  }

  generateMazeIdx(min, max, data) {
    let validNumber = false;
    let validIdx;
    const randIdx = Math.round((Math.random() * (max - min) + min))


    if (data.length <= 0) {
      validNumber = true;
      if (validNumber) {
        validIdx = randIdx;
      }
    } 

    while (!validNumber) {
      if (!data.includes(randIdx)) {
        validNumber = true;
        if (validNumber) {
          validIdx = randIdx;
        }
      }
    }
    return validIdx;
  }

  nextTick() {
    if (this.running) {
      this.draw();
      this.update();
      requestAnimationFrame(() => this.nextTick());
    } else {
      if (this.isOver) {
        this.displayGameover();
        hideGame();
      } 
      if (this.isWin) {
        this.displayWin();
        hideGame();
      }
      
    }
  }

  startTimer() {
    if (!this.memorizingTimerStarted) {
      this.draw();
      console.log(this.randIdx)
      this.mazeData.push(this.randIdx)
      console.log(this.mazeData)
      this.memorizingTimerStarted = true; 
      // Ensure it only starts once
      this.memorizingTimer();
    }
  }
  
  memorizingTimer() {
    const countdownDisplay = setInterval(() => {
      this.running = false;
      this.memorizingSeconds--;
      memorizingTime.innerHTML = `${this.memorizingSeconds}s`

      if (this.memorizingSeconds <= 0) {
        clearInterval(countdownDisplay);  
        this.running = true;
        this.draw();
        this.nextTick();

        memorizingContainer.classList.add("none");
        moveContainer.classList.remove("none");

        this.movingCountdown();
      }
      
    }, 1000)
  }

  movingCountdown() {
    if (this.moveCountdownId) {
      clearInterval(this.moveCountdownId); // Clear any existing interval
    }

    this.moveCountdownId = setInterval(() => {
      this.moveSeconds--;
      moveTime.innerHTML = `${this.moveSeconds}s`;
      if (this.moveSeconds <= 0) {
        clearInterval(this.moveCountdownId);
        if (this.running) {
          if (!this.isLoseHeart) {
            this.isLoseHeart = true;
            this.removeHeart();

            this.playerPosition.x = this.initialPlayer.x;
            this.playerPosition.y = this.initialPlayer.y;
            this.player.x = this.playerPosition.x;
            this.player.y = this.playerPosition.y;
            
            this.isLoseHeart = false;

            alert(`you run out of time, your heart is ${this._hearts} left`);
            this.moveSeconds = this._movingSec;
            moveTime.innerHTML = `${this.moveSeconds}s`;
            this.movingCountdown();

            if (this._hearts <= 0) {
              this.running = false;
              this.isOver = true;
            }
          } 

        }

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
    this._hearts--;
    if (allHearts[this._hearts]) {
      allHearts[this._hearts].style.filter = 'brightness(50%)';
    }
  }

  drawNextStage() {
    if (this.nextStage) {
      // move to next stage 
      this._stage++;
      roundText.innerHTML = `Round ${this._stage + 1}`
      // console.log(this._stage);
      this.randIdx = this.generateMazeIdx(0, mazes.length - 1, this.mazeData);
      this.maze = mazes[this.randIdx];

      this.randomWalls = Array.from({ length: this._rows }, () => []);

      // remove moveContainer and add memorizingCon
      memorizingContainer.classList.remove("none");
      moveContainer.classList.add("none");

      // reset memorizingTimerStarted
      this.memorizingTimerStarted = false;
      this.memorizingSeconds = this._memorizingSec; 
      memorizingTime.innerHTML = `${this.memorizingSeconds}s`
      this.moveSeconds = this._movingSec;
      moveTime.innerHTML = `${this.moveSeconds}s`;

      this.playerPosition = this.generatePlayerPosition();
      this.player.x = this.playerPosition.x;
      this.player.y = this.playerPosition.y;

      console.log(this.playerPosition, this.maze);

      this.startTimer();
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
                this.playerPosition.x = this.initialPlayer.x;
                this.playerPosition.y = this.initialPlayer.y;
                this.player.x = this.playerPosition.x;
                this.player.y = this.playerPosition.y;
                // alert(`you hit the wall, your heart is ${this._hearts} left`);
                const alert = confirm(`you hit the wall, your heart is ${this._hearts} left`);
                if (alert) {
                  this.moveSeconds = this._movingSec;
                  moveTime.innerHTML = `${this.moveSeconds}s`;
                }
                
                this.movingCountdown();
                
                this.isLoseHeart = false;
                
                if (this._hearts <= 0) {
                  this.running = false;
                  this.isOver = true;
                }
              } 
            }
          }
          if (wall.type === "exitdoor") {
            if (wall.x === this.player.x + 20 && wall.y === this.player.y - this._cellSize/2) {
              console.log(wall.x, this.player.x + 20)
              console.log(this._stage)
              if (this._stage > 0 && this._stage !== this.totalStage - 1) {
                this.nextStage = false;
                console.log('ayo', this.nextStage)
              }
              if (this._stage === this.totalStage - 1) {
                setTimeout(() => {
                    this.running = false;
                    this.isWin = true;
                  }, 1000)
              }
              setTimeout(() => {
                this.running = false;
                if (!this.nextStage) {
                  this.nextStage = true;
                  this.drawNextStage();
                }
              }, 1000)  
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
      const col = randMazeIdx(0, this._columns/2 - 1);

      // Check if the maze at this position is empty (no wall)
      if (this.maze[row][col] === "-" && this.maze[row][col] !== "E") {
          validPosition = true;

          // Convert grid coordinates to actual x, y positions
          x = (col * this._cellSize) + this._cellSize / 2;
          // 1 * 50 + 25
          y = (row * this._cellSize) + this._cellSize / 2;

      }
    }
    
    this.initialPlayer.x = x;
    this.initialPlayer.y = y;

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
          this._xVelocity = -this._cellSize
          this._yVelocity = 0;
          if (this.player.x === 0 + this._cellSize/2) {
            this._xVelocity = 0;
          } 
          break;
        case (keyPressed == RIGHT):
          this._xVelocity = this._cellSize
          this._yVelocity = 0
          if (this.player.x === this._boardWidth - this._cellSize/2) {
            this._xVelocity = 0;
          } 
          break;
        case (keyPressed == UP):
          this._xVelocity = 0
          this._yVelocity = -this._cellSize
          if (this.player.y === 0 + this._cellSize/2) {
            this._yVelocity = 0;
          } 
          break;
        case (keyPressed == DOWN):
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
            const transparantWall = new Walls(this.context, c * this._cellSize, r * this._cellSize, this._cellSize, this._cellSize, "wall", "rgba(255, 255, 255, 0)");
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
      const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
      let currentPlayerData = JSON.parse(localStorage.getItem('player'));

      const leaderboardObj = {
        "id": currentPlayerData.id,
        "name": currentPlayerData.name,
        "stage": this._stage + 1, 
      }

      leaderboardData.push(leaderboardObj);

      if (typeof window !== 'undefined') {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
      }


      alert(`
        gameover,
        name: ${currentPlayerData.name}
        stage: ${this._stage + 1}
      `)
      window.location.reload();
    }
  }

  displayWin() {
    if (this.isWin) {
      const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
      let currentPlayerData = JSON.parse(localStorage.getItem('player'));

      const leaderboardObj = {
        "id": currentPlayerData.id,
        "name": currentPlayerData.name,
        "stage": this._stage + 1, 
      }

      leaderboardData.push(leaderboardObj);

      if (typeof window !== 'undefined') {
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
      }


      console.log(leaderboardData);
      alert(`
        you won,
        name: ${currentPlayerData.name}
        stage: ${this._stage + 1}`
      )
      window.location.reload();
    }
  }
  
}

export default Game;