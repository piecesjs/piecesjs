import { Piece } from 'piecesjs'

class Button extends Piece {
	constructor() {
		super('Button', {
			styles: '/assets/css/components/button.css'
		});
	}

	mount() {
		this.pieces
		this.addEvent('click', this, this.click);
	}

	unmount() {
		this.removeEvent('click', this, this.click);
	}

	click() {
		this.call('increment',{},'Add','myAddComponentId');
	}
}

// Register the custom element
customElements.define('c-button', Button);