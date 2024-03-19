import { Piece } from 'piecesjs'

class Button extends Piece {
	constructor() {
		super('Button', {
			stylesheets: [
				() => import('/assets/css/components/button.css')
			]
		});

		// this.registerStylesheet(() => import('/assets/css/components/button.css'));
	}

	mount() {
		this.pieces
		this.addEvent('click', this, this.click, {test: 'test'});
	}

	unmount() {
		this.removeEvent('click', this, this.click);
	}

	click(params, e) {
		console.log(params);
		this.call('increment',{},'Add','myAddComponentId');
	}
}

// Register the custom element
customElements.define('c-button', Button);