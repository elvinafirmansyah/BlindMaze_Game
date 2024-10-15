import Game from "./Game.js";

const startingCountdown = document.getElementById('starting_countdown')
console.log(startingCountdown)

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameboard');

  const context = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 500;
  canvas.style.border = '2px solid lightgray'

  const game = new Game(context, canvas);

  window.requestAnimationFrame(gameStart);

  window.addEventListener("keydown", (e) => {
    game.changeDirection(e);
    game.update();
    game.draw();
  })

  function gameStart() {
    // const countdownDisplay = setInterval(() => {
    //   countdown.innerHTML = `${Number(countdown.innerHTML) - 1}`
    // }, 1000)

    
    setTimeout(() => {
      // clearInterval(countdownDisplay);
      // countdown.style.display = 'none';
      console.log(startingCountdown)
      // countdown.style.display = 'none';
      game.draw();
      game.countdownTimer();
    }, 0)
    // game.update();
  }

})

