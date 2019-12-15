class Modal {
  //CancelButton is optional, to allow for just one button in the modal;
  constructor(message = '', confirmButton = {}, cancelButton) {
    this.message = message;

    this.parent = document.body;
    this.modal = undefined;

    this.cancelButton = cancelButton;
    this.confirmButton = confirmButton;

    this.confirmLabel = confirmButton.label || 'Confirm';
    //To prevent the script from crashing if no cancel button is passed down;
    this.cancelLabel = cancelButton ? cancelButton.label || 'Cancel' : 'Cancel';

    this.createModal();
  }

  answer() {
    const confirmButton = this.modal.querySelector('.button');
    const cancelButton = this.modal.querySelector('.button-inverted');

    return new Promise((resolve, reject) => {
      if (!this.modal) {
        reject('Something went wrong with the creation of this modal');
      }

      this.modal.addEventListener('click', event => {
        if (event.target.className !== 'modal-overlay modal-overlay--active') {
          return;
        }
        resolve();
        //Set the overlayclick to be the same as the cancel action if cancel action is set, otherwise it will be set the same as confirm action
        if (cancelButton && this.cancelButton.clickHandler) {
          this.cancelButton.clickHandler(event);
          this.removeModal();
        } else if (this.confirmButton.clickHandler) {
          this.confirmButton.clickHandler(event);
          this.removeModal();
        } else {
          this.removeModal();
        }
      });

      confirmButton.addEventListener('click', event => {
        resolve();
        if (this.confirmButton.clickHandler) {
          this.confirmButton.clickHandler(event);
        }
        this.removeModal();
      });

      if (cancelButton) {
        cancelButton.addEventListener('click', event => {
          resolve();
          if (this.cancelButton.clickHandler) {
            this.cancelButton.clickHandler(event);
          }
          this.removeModal();
        });
      }
    });
  }

  createModal() {
    this.createModalMarkup();
    this.parent.insertAdjacentElement('afterbegin', this.modal);

    this.sleep(100).then(() => this.fadeIn());
  }

  removeModal() {
    this.fadeOut();
    this.sleep(200).then(() => {
      this.parent.removeChild(this.modal);
      delete this;
    });
  }

  //Simulating wait time, to make the fade in and out transitions to work;
  sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
  }

  fadeIn() {
    this.modal.classList.add('modal-overlay--active');
    this.parent.style.overflow = 'hidden';
  }

  fadeOut() {
    this.modal.classList.remove('modal-overlay--active');
    this.parent.removeAttribute('style');
  }

  createModalMarkup() {
    this.modal = document.createElement('div');
    this.modal.className = 'modal-overlay';
    this.modal.addEventListener('click', this.onModalOverlayClick);

    this.modal.innerHTML = `
        <article class="modal">
          ${this.message ? `<p class="modal-message">${this.message}</p>` : ''}
          <div class="modal-buttons">
            <button class="button">${this.confirmLabel}</button>
            ${this.cancelButton ? `<button class="button-inverted">${this.cancelLabel}</button>` : ''}
          </div>
        </article>
      `;
  }
}
