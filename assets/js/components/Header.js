import { paths } from "/piecesconfig.json" assert { type: "json" };
import { default as Piece } from './Piece.js'

export class Header extends Piece {
	constructor() {
		super();

		this.name = 'Header';
		this.styles = `${paths.css.components}/header.css`;
	}
}

// Register the custom element
customElements.define('c-header', Header);