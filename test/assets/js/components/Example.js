import { default as Piece } from './Piece.js'

class Example extends Piece {
	constructor() {
		super('Example');
	}

	render() {
		return `
			<p>Component name: ${this.name}</p>
		`;
	}
}

// Register the custom element
customElements.define('p-example', Example);