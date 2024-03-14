import { default as Piece } from './Piece.js'

export class Incrementor extends Piece {
	constructor() {
		super();

		this.name = 'Incrementor';

		this.styles = '../../css/pieces/incrementor.css';
	}

	mount() {
		super.mount();
		this.$button = this.$('button');
		// this.$button.addEventListener('click',this.click);

		this.addEvent('click',this.$button,this.click)
	}

	unmount() {
		super.unmount();
		this.removeEvent('click',this.$button,this.click)
	}
	
	render() {
		return `
			<h2>Incrementor Piece</h2>
			<p>Value: ${this.value}</p>
			<button type="button">Increment</button>
		`;
	}

	click() {
		this.value = parseInt(this.value) + 1;
	}

	set value(value) {
		return this.setAttribute('value', value);
	}

	get value() {
		return this.getAttribute('value');
	}

	// Important to observe all changing attributes
	static get observedAttributes() { 
		return ['value'];
	}

}

// Register the custom element
customElements.define('p-incrementor', Incrementor);