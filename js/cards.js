const characters = [
  'jon snow',
  'daenerys targaryen',
  'samwell tarly',
  'Sandor Clegane',
  'tormund',
  'tyrion lannister',
  'arya stark',
  'brienne of tarth',
  'melisandre',
  'drogo'
];
const playeNowButton = document.querySelector('#play-now-button');
const characterContainer = document.querySelector('.characters-choices');

//Only need to keep track of player selected character,
//as the last character selected always will be the computers character
let playerSelectedCharacter = '';
//Checks if the user selected an allready selected character
let userSelectedTheSameCharacterAgain = false;
let characterSelectionUrl = '';

playeNowButton.addEventListener('click', scrollToCharacaters);

createAllCharacterCards();

//Crated a async function with a for of loop, to make sure the cards are created in the correct order everytime
async function createAllCharacterCards() {
  for (const character of characters) {
    await fetch(`https://anapioficeandfire.com/api/characters?name=${character}`)
      .then(response => response.json())
      .then(characterData => {
        if (character === 'daenerys targaryen') {
          createCharacterCard(characterData[1]);
        } else {
          createCharacterCard(characterData[0]);
        }
      });
  }
}

function createCharacterCard(character) {
  if (!character) return;
  const lowerCaseName = character.name.toLowerCase().replace(/\s/g, '');

  const card = document.createElement('article');
  card.className = 'characters-flip-card';

  const cardHtml = `<div class="flip-card-inner">
  <div class="flip-card-front">
    <img class="card-image" src="./images/${lowerCaseName}-small.jpg" alt="Profile image of ${character.name}" />
    <h2 class="character-name">${character.name}</h2>
  </div>
  <div class="flip-card-back">
    <h1>description</h1>
    ${getCharacterTitles(character)}
    ${character.gender ? `<p class="card-p"><strong>Gender:</strong> ${character.gender}</p>` : ''}
    ${character.culture ? `<p class="card-p"><strong>Culture: </strong>${character.culture}</p>` : ''}
    ${character.born ? `<p class="card-p"><strong>Born: </strong>${character.born}</p>` : ''}
    ${
      character.tvSeries.length
        ? `<p class="card-p"> <strong>TV-series appearances: </strong>${character.tvSeries}</p>`
        : ''
    }
    ${character.playedBy.length ? `<p class="card-p"> <strong>Played by: </strong>${character.playedBy}</p>` : ''}
    <button class="button character-select-button">Select Character</button>
  </div>
</div>`;
  card.innerHTML = cardHtml;
  characterContainer.appendChild(card);
  card.querySelector('.character-select-button').addEventListener('click', event => openModal(character.name));
}

function getCharacterTitles(character) {
  const noTitles = character.titles.length === 1 && !character.titles[0];
  const hasAliases = character.aliases.length >= 1 && character.aliases[0] !== '';

  if (noTitles && hasAliases) {
    return `<p class="card-p"><strong>Aliases: </strong> ${character.aliases}</p>`;
  } else if (noTitles) {
    return '';
  } else {
    return `<p class="card-p"><strong>Titles: </strong> ${character.titles}</p>`;
  }
}

function openModal(characterName) {
  userSelectedTheSameCharacterAgain = playerSelectedCharacter && characterName === playerSelectedCharacter;

  let modalMessage = getModalMessage(characterName);
  let confirmButton = { label: 'Yes', clickHandler: () => confirmCharacterSelection(characterName) };
  let cancelButton = { label: 'No', clickHandler: cancelCharacterSelection };

  if (userSelectedTheSameCharacterAgain) {
    confirmButton = { label: 'Yes', clickHandler: cancelCharacterSelection };
    cancelButton = {
      label: 'No',
      clickHandler: () => confirmCharacterSelection(characterName)
    };
  }

  const characterSelectionModal = new Modal(modalMessage, confirmButton, cancelButton);

  characterSelectionModal.answer();
}

function confirmCharacterSelection(characterName) {
  if (!playerSelectedCharacter || userSelectedTheSameCharacterAgain) {
    playerSelectedCharacter = characterName;
    characterSelectionUrl = `?player=${playerSelectedCharacter}`;
  } else {
    characterSelectionUrl += `&computer=${characterName}`;
    window.location.assign(`./boardgame.html${characterSelectionUrl}`);
  }
}

function cancelCharacterSelection() {
  if (userSelectedTheSameCharacterAgain) {
    playerSelectedCharacter = '';
  } else {
    return;
  }
}

function getModalMessage(characterName) {
  if (userSelectedTheSameCharacterAgain) {
    return `Do you want to play as another character?`;
  } else if (!playerSelectedCharacter) {
    return `Do you want to play as ${characterName}?`;
  } else {
    return `Do you want to play against ${characterName}?`;
  }
}

function scrollToCharacaters() {
  characterContainer.scrollIntoView({ top: 0, behavior: 'smooth' });
}
