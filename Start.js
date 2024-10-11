import Game from "./Game.js";

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameboard');

  console.log(canvas)
  const context = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 500;
  canvas.style.border = '2px solid black'

  const game = new Game(context, canvas)

  game.update();

  game.drawWalls();

  

  window.addEventListener("keydown", (e) => {
    game.changeDirection(e);
  })

})

