import Game from "./Game.js";

const startingCount = document.getElementById
('starting-countdown');

const timeContainer = document.querySelector('.time');

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameboard');
  const context = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 500;
  canvas.style.border = '2px solid lightgray'

  canvas.style.display = "none";

  timeContainer.style.display = 'none';
  
  const game = new Game(context, canvas);
  window.addEventListener("keydown", (e) => game.changeDirection(e));


  document.addEventListener('state', (e) => {
    const state = e.detail.state;
    // console.log(state)
    if (state === 'playing') {
      window.requestAnimationFrame(gameStart)
    } 
  })

  function gameStart() {
    let starting_point = 3;
    startingCount.innerHTML = starting_point;
    const countdown = setInterval(() => {
      starting_point--;
      startingCount.innerHTML = starting_point;
      if (starting_point <= 0) {
        clearInterval(countdown);
        startingCount.style.visibility = 'hidden';

        canvas.style.display = "block";
        timeContainer.style.display = 'flex';
        game.startTimer();

      }
    }, 1000)

  }

})

