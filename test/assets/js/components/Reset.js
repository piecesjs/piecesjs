import { Piece } from 'piecesjs';

class Reset extends Piece {
  constructor() {
    super('Reset');
  }

  mount() {
    this.emit('resetIsMounted', document, {
      value: 'A reset component is mounted!',
    });
    this.on('click', this, this.click, { value: 'increment' });
  }

  click(params, e) {
    this.call('reset', {}, 'Counter', this.counterToReset);
  }

  unmount() {
    this.off('click', this, this.click);
  }

  get counterToReset() {
    return this.getAttribute('counterToReset');
  }

  set counterToReset(value) {
    return this.setAttribute('counterToReset', value);
  }
}

// Register the custom element
customElements.define('c-reset', Reset);
