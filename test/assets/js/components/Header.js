import { Piece } from 'piecesjs'

class Header extends Piece {
	constructor() {
		super('Header', {
			stylesheets: [
				() => import('/assets/css/components/header.css')
			]
		});
	}

	mount() {
		this.on('buttonIsMounted', document, this.customEventTrigger, {value: 'Button is mounted!'});
	}

	customEventTrigger(params) {
		console.log(params)
	}

	unmount() {
		this.off('buttonIsMounted', document, this.customEventTrigger);
	}

}

// Register the custom element
customElements.define('c-header', Header);