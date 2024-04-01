import { Piece } from 'piecesjs';

class Button extends Piece {
  constructor() {
    super('Button', {
      stylesheets: [() => import('/assets/css/components/button.css')],
    });
  }

  mount() {
    this.emit('buttonIsMounted', document, { value: 'A button is mounted!' });

    this.on('click', this, this.click, { value: 'increment' });
  }

  unmount() {
    this.off('click', this, this.click);
  }

  click(params, e) {
    this.call('increment', {}, 'Counter', 'myCounterComponentId');
  }
}

// Register the custom element
customElements.define('c-button', Button);
