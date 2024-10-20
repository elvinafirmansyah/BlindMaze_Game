import Game from "./Game.js";

const startingCountdown = document.getElementById('starting_countdown')

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
    let starting_point = 3;
    const countdown = setInterval(() => {
      starting_point--;
      startingCountdown.innerHTML = String(starting_point);
    }, 1000)

    setTimeout(() => {
      clearInterval(countdown);
      startingCountdown.style.visibility = 'hidden';
      game.draw();
      game.countdownTimer();
      game.update();
    }, 0)

  }

})

