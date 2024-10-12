import { Piece } from 'piecesjs';

class Header extends Piece {
  constructor() {
    super('Header', {
      stylesheets: [() => import('/assets/css/components/header.css')],
    });
  }

  mount() {
    // Event listener
    this.on('resetIsMounted', document, this.customEventTrigger);

    console.log(this.piecesManager.currentPieces);
  }

  customEventTrigger(e) {
    console.log(e.detail);
  }

  unmount() {
    this.off('resetIsMounted', document, this.customEventTrigger);
  }
}

// Register the custom element
customElements.define('c-header', Header);
