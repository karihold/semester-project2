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

const modalConfirmButton = {
  label: 'Confirm',
  clickHandler: confirmCharacterSelection
};

const modalCancelButton = {
  label: 'Cancel',
  clickHandler: cancelCharacterSelection
};

let selectedCharacter = '';
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
  let modalMessage = getModalMessage(characterName);
  selectedCharacter = characterName;

  const characterSelectionModal = new Modal(modalMessage, modalConfirmButton, modalCancelButton);
  characterSelectionModal.answer();
}

function confirmCharacterSelection() {
  if (!characterSelectionUrl) {
    characterSelectionUrl = `?player=${selectedCharacter}`;
  } else {
    characterSelectionUrl += `&computer=${selectedCharacter}`;
    window.location.assign(`./boardgame.html${characterSelectionUrl}`);
  }
}

function cancelCharacterSelection() {
  selectedCharacterText = '';
  selectedCharacter = '';
}

function getModalMessage(characterName) {
  if (!characterSelectionUrl) {
    return `Do you want to play as ${characterName}?`;
  } else {
    return `Do you want to play against ${characterName}?`;
  }
}

function scrollToCharacaters() {
  characterContainer.scrollIntoView({ top: 0, behavior: 'smooth' });
}
