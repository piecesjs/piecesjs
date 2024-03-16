import { Piece } from '../../../src/index.js'

export class Header extends Piece {
	constructor() {
		super();

		this.name = 'Header';
		this.styles = `/assets/css/components/header.css`;
	}
}

// Register the custom element
customElements.define('c-header', Header);