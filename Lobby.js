import { showGame }from './Start.js';
const inputName = document.getElementById('inputName');
const startBtn = document.getElementById('startBtn');
const leaderboardButton = document.getElementById('leaderboard_btn');
const instructionButton = document.getElementById('instruction_btn');
const instructionContainer = document.getElementById('instruction');
const leaderboardContainer = document.getElementById('leaderboard');
const closeButton = document.getElementById('close_btn')
const leaderboardContent = document.getElementById('leaderboard_content');

const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
let currentPlayerData = JSON.parse(localStorage.getItem('player')) || {};

// leaderboardData.splice(0, leaderboardData.length);
// localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = inputName.value;

  if (name === '') {
    alert('input name first!');
    return;
  }

  leaderboardContainer.classList.add('hidden');

  let playerData = {
    "id": leaderboardData.length + 1,
    "name": name,
  }

  currentPlayerData = playerData;

  if (typeof window !== 'undefined') {
    localStorage.setItem('player', JSON.stringify(currentPlayerData));
  }

  showGame();

})



displayLeaderboardData();

function displayLeaderboardData() {
  leaderboardData.forEach((_) => {
    const newRow = document.createElement('tr');
    leaderboardContent.appendChild(newRow);

    newRow.innerHTML = `
      <td class="border border-slate-100 px-5 ">${_.id}</td>
      <td class="border border-slate-100 px-5 ">${_.name}</td>
      <td class="border border-slate-100 px-5 ">${_.stage}</td>
    `
  })
}

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