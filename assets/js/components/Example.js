import { default as Piece } from './Piece.js'

export class Example extends Piece {
	constructor() {
		super();

		this.name = 'Example';
	}

	render() {
		return `
			<p>Component name: ${this.name}</p>
		`;
	}
}

// Register the custom element
customElements.define('p-example', Example);