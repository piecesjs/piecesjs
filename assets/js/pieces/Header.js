import { default as Piece } from './Piece.js'

export class Header extends Piece {
	constructor() {
		super();

		this.name = 'Header';
		this.styles = '../../css/pieces/header.css';
	}
}

// Register the custom element
customElements.define('p-header', Header);