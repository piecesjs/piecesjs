import { Piece } from 'piecesjs'

export class Button extends Piece {
	constructor() {
		super();

		this.name = 'Button';
		this.styles = `/assets/css/components/button.css`;
	}

	mount() {
		super.mount();
		this.$button = this.$('button');

		this.addEvent('click', this, this.click)
	}

	unMount() {
		super.unMount();

		this.removeEvent('click', this, this.click)
	}

	click() {
		this.call('increment',{},'More','uIdMoreComponenent');
	}
}

// Register the custom element
customElements.define('c-button', Button);