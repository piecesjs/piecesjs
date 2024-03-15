import { Piece } from './Piece.js'

export class Header extends Piece {
	constructor() {
		super();

		this.name = 'Header';
		this.styles = `/src/css/components/header.css`;
	}
}

// Register the custom element
customElements.define('c-header', Header);