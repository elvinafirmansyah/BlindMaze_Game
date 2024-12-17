document.addEventListener('DOMContentLoaded', () => {
  const lobbyContainer = document.querySelector('.lobby_container');
  const gameContainer = document.querySelector('.game_container');


  document.addEventListener('state', (event) => {
    const state = event.detail.state;

    if (typeof window !== 'undefined') {
      localStorage.setItem('state', state);
    }

    gameContainer.classList.add('hidden');
    lobbyContainer.classList.add('hidden');

    switch(state) {
      case 'lobby':
        lobbyContainer.classList.remove('hidden');
        break
      case 'playing':
        gameContainer.classList.remove('hidden');
        break
      default:
      break
    }

    console.log(state);
  })

})

setTimeout(() => {
  const stateEvent = new CustomEvent('state', {
    detail: { state: "lobby" },
  })
  document.dispatchEvent(stateEvent);
}, 100)