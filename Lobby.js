const inputName = document.getElementById('inputName');
const startBtn = document.getElementById('startBtn');
const leaderboardButton = document.getElementById('leaderboard_btn');
const instructionButton = document.getElementById('instruction_btn');
const instructionContainer = document.getElementById('instruction');
const leaderboardContainer = document.getElementById('leaderboard');
const closeButton = document.getElementById('close_btn')

const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
let currentPlayerData = JSON.parse(localStorage.getItem('player')) || {};

console.log(leaderboardData, currentPlayerData);

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = inputName.value;

  if (name === '') {
    alert('input name first!');
    return;
  }

  leaderboardContainer.classList.add('hidden');

  // const leaderboardObj = {
  //   "name": name,
  //   "stage": 1,
  // }
  // leaderboardData.push(leaderboardObj);

  // localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

  // console.log(localStorage.getItem('leaderboard'))

  let playerData = {
    "id": leaderboardData.length,
    "name": name,
  }

  currentPlayerData = playerData;

  localStorage.setItem('player', JSON.stringify(currentPlayerData));

  console.log(localStorage.getItem('player'))

  setTimeout(() => {
    const stateEvent = new CustomEvent('state', {
      detail: { state: "playing" },
    })
    document.dispatchEvent(stateEvent);
  }, 100)

})

// leaderboardData.splice(0, leaderboardData.length);
// localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

leaderboardButton.addEventListener("click", (e) => {
  e.preventDefault();
  leaderboardContainer.classList.toggle('hidden');
})

instructionButton.addEventListener("click", (e) => {
  e.preventDefault();
  instructionContainer.classList.remove('hidden');
  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    instructionContainer.classList.add('hidden');
  })

})