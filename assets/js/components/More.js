import { default as Piece } from './Piece.js'

export class More extends Piece {
	constructor() {
		super();

		this.name = 'More';
		this.styles = `/assets/css/components/more.css`;
	}

	mount() {
		super.mount();
		this.$button = this.$('button');

		this.addEvent('click', this.$button, this.click)
	}

	unMount() {
		super.unMount();

		this.removeEvent('click', this.$button, this.click)
	}
	
	render() {
		return `
			<h2>More component</h2>
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

	static get observedAttributes() { 
		return ['value'];
	}
}

// Register the custom element
customElements.define('c-more', More);