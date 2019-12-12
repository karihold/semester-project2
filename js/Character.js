class Character {
  constructor(name, id, isComputerControlled = false) {
    this.name = name;
    this.id = id;

    this.tileNumber = 0;
    this.token = '';

    this.moveTimeOut = 500;

    this.isComputerControlled = isComputerControlled;

    this.hasToWaitTurn = false;
    this.rolledSix = false;

    this.createToken();
  }

  createToken() {
    const tokenImagePath = `./logosandtokens/${this.id}.svg`;
    const tokenElement = document.createElement('img');

    tokenElement.src = tokenImagePath;
    tokenElement.className = 'token';
    tokenElement.id = `token-${this.id}`;

    this.token = tokenElement;
  }

  placeTokenOnBoard(board, top, left) {
    board.appendChild(this.token);
    this.moveToken(top, left);
  }

  async moveToken(top, left) {
    const padding = 10;

    if (!this.isComputerControlled) {
      this.token.style.top = `${top + padding}px`;
      this.token.style.left = `${left + padding}px`;
    } else {
      const offsetTop = 108 / 2;
      const offsetLeft = 148 / 2;

      this.token.style.top = `${top + offsetTop - padding}px`;
      this.token.style.left = `${left + offsetLeft + padding}px`;
    }
  }

  async moveForwards(diceRoll, tiles) {
    const lastTileToMoveTo = this.tileNumber + diceRoll;
    const lastTile = tiles.length - 1;

    let moveIndex = 1;

    //If the last tile to move to is a number greater than or the same as the last tile index
    //Set the diceRoll to be the amount of moves required the exactly reach the last tile.
    if (lastTileToMoveTo > lastTile) {
      diceRoll = diceRoll - (lastTileToMoveTo - lastTile);
    }

    while (moveIndex <= diceRoll) {
      const tileToMoveTo = tiles[moveIndex + this.tileNumber];

      await this.wait(this.moveTimeOut).then(() => this.moveToken(tileToMoveTo.offsetTop, tileToMoveTo.offsetLeft));

      if (tileToMoveTo.className === 'big-tile' && !this.isComputerControlled) {
        const messageModal = new Modal(tileToMoveTo.dataset.message, { label: 'Great!' });
        await messageModal.answer();
      }

      moveIndex++;
    }
    this.tileNumber = this.tileNumber + diceRoll;
  }

  async moveBackwards(penalty, tiles) {
    let lastTileToMoveTo = this.tileNumber - penalty;

    if (lastTileToMoveTo < 0) {
      const movesToLastTile = penalty - lastTileToMoveTo * -1;

      lastTileToMoveTo = this.tileNumber - movesToLastTile;
    }

    let moveIndex = this.tileNumber;

    while (moveIndex !== lastTileToMoveTo) {
      moveIndex--;

      const tileToMoveTo = tiles[moveIndex];

      await this.wait(this.moveTimeOut).then(() => this.moveToken(tileToMoveTo.offsetTop, tileToMoveTo.offsetLeft));
    }

    this.tileNumber = moveIndex;
  }

  async wait(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  }
}
