const tiles = Array.from(document.querySelectorAll('div[class$="tile"]')).reverse();
const diceButton = document.querySelector('.dice-button');
const playerPanel = document.querySelector('.player-panel');
const opponentPanel = document.querySelector('.opponent-panel');

diceButton.addEventListener('click', event => clickHandler());

tiles.forEach((tile, index) => (tile.innerHTML = `<p class="tile-number">${index + 1}</p>`));
createToken('jonsnow');

function rollDice() {
  const randomNumber = Math.floor(Math.random() * 6 + 1);
  return randomNumber;
}

function clickHandler() {
  const diceRoll = rollDice();
  const paragraph = document.createElement('p');
  paragraph.innerText = `you rolled a ${diceRoll}`;
  paragraph.className = 'dice-paragraph';
  playerPanel.insertAdjacentElement('afterbegin', paragraph);
}

function createToken(characterName) {
  const tokenImagePath = `./logosandtokens/${characterName}.svg`;
  const tokenElement = document.createElement('img');
  tokenElement.src = tokenImagePath;
  tiles[0].appendChild(tokenElement);
  tokenElement.className = 'token';
}
