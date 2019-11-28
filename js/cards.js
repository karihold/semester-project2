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

const characterContainer = document.querySelector('.characters-choices');

characters.forEach(character =>
  fetch('https://anapioficeandfire.com/api/characters?name=' + character)
    .then(response => response.json())
    .then(characterData => {
      if (character === 'daenerys targaryen') {
        createCharacterCard(characterData[1]);
      } else {
        createCharacterCard(characterData[0]);
      }
    })
);

function createCharacterCard(character) {
  if (!character) return;
  const lowerCaseName = character.name.toLowerCase().replace(/\s/g, '');
  console.log(lowerCaseName);
  const card = document.createElement('article');
  card.className = 'characters-flip-card';
  const cardHtml = `<div class="flip-card-inner">
  <div class="flip-card-front">
    <img class="card-image" src="./images/${lowerCaseName}-small.jpg" alt="Profile image of ${character.name}" />
    <h2 class="character-name">${character.name}</h2>
  </div>
  <div class="flip-card-back">
    <h1>description</h1>
    <p class="card-p">Titles:${character.titles}</p>
    <p class="card-p"> Gender:${character.gender}</p>
    <p class="card-p">Culture:${character.culture}</p>
    <p class="card-p"> Born:${character.born}</p>
    <p class="card-p">TV-series appearances:${character.tvSeries}</p>
    <p class="card-p"> Played by:${character.playedBy}</p>
    <button class="button character-select-button">Select Character</button>
  </div>
</div>`;
  card.innerHTML = cardHtml;
  characterContainer.appendChild(card);
}
