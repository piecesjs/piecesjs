import { Piece } from 'piecesjs'

class Header extends Piece {
	constructor() {
		super('Header', {
			stylesheets: [
				() => import('/assets/css/components/header.css')
			]
		});
	}
}

// Register the custom element
customElements.define('c-header', Header);