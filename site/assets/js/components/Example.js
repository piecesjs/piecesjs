import { Piece } from 'piecesjs';

class Example extends Piece {
  constructor() {
    super('Example', {
      stylesheets: [() => import('/assets/css/components/example.css')],
    });
  }

  render() {
    return `
			<p>Component name: ${this.name}</p>
		`;
  }
}

// Register the custom element
customElements.define('p-example', Example);
