import { Piece } from 'piecesjs'

export class Button extends Piece {
	constructor() {
		super();

		this.name = 'Button';
		this.styles = `/assets/css/components/button.css`;
	}

	initEvents() {
		this.$button = this.$('button')[0];
		this.addEvent('click', this, this.click)
	}

	removeEvents() {
		this.removeEvent('click', this, this.click)
	}

	click() {
		this.call('increment',{},'Add','uIdAddComponenent');
	}
}

// Register the custom element
customElements.define('c-button', Button);