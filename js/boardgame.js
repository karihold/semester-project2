const board = document.querySelector('.boardgame-container');
const tiles = Array.from(document.querySelectorAll('div[class$="tile"]')).reverse();
const firstTile = tiles[0];
const lastTileNumber = tiles.length - 1;
const lastTile = tiles[lastTileNumber];

const characterPanels = document.querySelectorAll('.character-panel');
const diceButton = document.querySelector('.dice-button');
const playerLog = document.querySelector('.character-log');
const computerLog = document.querySelector('.character-log-opponent');

const playerData = getChosenCharactersFromUrl('player');
const computerData = getChosenCharactersFromUrl('computer');

const player = new Character(playerData.name, playerData.id);
const computer = new Character(computerData.name, computerData.id, true);

let waitPenalty = 0;

initBoardGame();

//Initilization functions-------------------------------------->
function initBoardGame() {
  //Force the player to go back and choose two characters
  if (!window.location.search) {
    const message = 'It seems like you have not chosen any characters to play as, please go back to the character selection screen';
    const goToIndexPage = () => window.location.assign('./index.html');
    const backToIndexButton = { label: 'Go Back', clickHandler: goToIndexPage };
    const toCharacterSelectionModal = new Modal(message, backToIndexButton);
    return toCharacterSelectionModal.answer();
  }

  createBoardGameTokenAvatar(player);
  createBoardGameTokenAvatar(computer);

  createGameBoardAvatar(player);
  createGameBoardAvatar(computer);

  diceButton.addEventListener('click', onDiceRollClick);
  tiles.forEach((tile, index) => (tile.innerHTML = `<p class="tile-number">${index + 1}</p>`));

  const firstTileTop = firstTile.offsetTop;
  const firstTileLeft = firstTile.offsetLeft;

  player.placeTokenOnBoard(board, firstTileTop, firstTileLeft);
  computer.placeTokenOnBoard(board, firstTileTop, firstTileLeft);
}

function createGameBoardAvatar(character) {
  const htmlString = `
  <figure class="character-avatar">
    <img src="./images/${character.id}-small.jpg">
    <figcatpion class="character-avatar-figcaption">${character.name}</figcatpion>
  </figure>`;

  if (!character.isComputerControlled) {
    characterPanels[0].insertAdjacentHTML('afterbegin', htmlString);
  } else {
    characterPanels[1].insertAdjacentHTML('afterbegin', htmlString);
  }
}

function createBoardGameTokenAvatar(character) {
  const htmlString = `<img class="character-token" src="./logosandtokens/${character.id}.svg">`;
  if (!character.isComputerControlled) {
    characterPanels[0].insertAdjacentHTML('afterbegin', htmlString);
  } else {
    characterPanels[1].insertAdjacentHTML('afterbegin', htmlString);
  }
}

function getChosenCharactersFromUrl(player) {
  const characterNamePattern = new RegExp(`${player}\\=[a-zA-z\\s]+`, 'g');
  const decodedUri = decodeURIComponent(window.location.search);
  const characterName = decodedUri.match(characterNamePattern)[0].split('=')[1];
  const characterLowerCaseName = characterName.toLowerCase().replace(/\s/g, '');

  return { name: characterName, id: characterLowerCaseName };
}

//Game Functions-------------------------------------->
function rollDice() {
  const randomNumber = Math.floor(Math.random() * 6 + 1);
  return randomNumber;
}

async function onDiceRollClick() {
  diceButton.disabled = true;

  //Run players turn until wait penalty is over
  if (computer.hasToWaitTurn && waitPenalty > 0) {
    await runTurn(player);

    diceButton.disabled = false;
    waitPenalty--;

    if (!player.hasToWaitTurn) {
      return;
    }
    computer.hasToWaitTurn = false;
    diceButton.disabled = true;
  } else {
    await runTurn(player);
  }

  if (player.rolledSix && !player.hasToWaitTurn) {
    diceButton.disabled = false;
    return;
  }

  //Run computers turn untill penalty is over
  if (player.hasToWaitTurn && waitPenalty > 0) {
    while (waitPenalty > 0) {
      await runTurn(computer);

      waitPenalty--;
      if (computer.hasToWaitTurn) {
        player.hasToWaitTurn = false;
        break;
      }
    }
    player.hasToWaitTurn = false;
  } else {
    await runTurn(computer);
  }

  if (computer.rolledSix && !computer.hasToWaitTurn) {
    while (computer.rolledSix) {
      await runTurn(computer);
    }
  }

  diceButton.disabled = false;
}

async function runTurn(character) {
  const diceRoll = rollDice();

  character.rolledSix = diceRoll === 6;

  updateDiceLog(character.isComputerControlled, diceRoll);
  await character.moveForwards(diceRoll, tiles);
  await sleep(600);

  if (character.tileNumber === lastTileNumber) {
    return sleep(500).then(() => navigateToFinalePage(!character.isComputerControlled));
  }

  const didLandOnRedTile = tiles[character.tileNumber].className === 'red-tile';

  if (didLandOnRedTile) {
    await applyPenalty(character);
  }
}

async function navigateToFinalePage(didPlayerWin) {
  if (didPlayerWin) {
    const winningModal = new Modal(`Congratulations, you reached Kings Landing, you won!`, { label: 'Great!' });
    await winningModal.answer();
    window.location.assign('./finalewin.html');
  } else {
    const losingModal = new Modal(`Darnation, your opponent reached Kings Landing first, you lost!`, { label: 'Darn!' });
    await losingModal.answer();
    window.location.assign('./finalelose.html');
  }
}

async function applyPenalty(character) {
  const redTile = tiles[character.tileNumber];
  const messageModal = new Modal(redTile.dataset.message);
  const penaltyType = redTile.dataset.type;
  const penalty = parseInt(redTile.dataset.penalty);

  await messageModal.answer();

  if (penaltyType === 'wait') {
    waitPenalty = penalty + 1;
    character.hasToWaitTurn = true;
  } else {
    await character.moveBackwards(penalty, tiles);
  }
}

function updateDiceLog(isCharacterComputerControlled, diceRoll) {
  const paragraph = document.createElement('p');
  paragraph.className = 'dice-paragraph';

  if (!isCharacterComputerControlled) {
    paragraph.innerText = `You rolled a ${diceRoll}`;
    playerLog.insertAdjacentElement('afterbegin', paragraph);
  } else {
    paragraph.innerText = `Computer rolled a ${diceRoll}`;
    computerLog.insertAdjacentElement('afterbegin', paragraph);
  }
}

function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}
