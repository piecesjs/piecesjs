import { Piece } from 'piecesjs';

class Reset extends Piece {
  constructor() {
    super('Reset');
  }

  mount() {
    this.emit('resetIsMounted', document, {
      value: 'A reset component is mounted!',
    });
  }

  resetCounter(e) {
    console.log('resetCounter', this.cid);
    let callback = this.call('reset', {}, 'Counter', this.counterToReset);

    console.log(callback);
  }

  unmount() {}

  // getter and setter for easy access to the counterToReset attribute
  get counterToReset() {
    return this.getAttribute('counterToReset');
  }

  set counterToReset(value) {
    return this.setAttribute('counterToReset', value);
  }
}

// Register the custom element
customElements.define('c-reset', Reset);
