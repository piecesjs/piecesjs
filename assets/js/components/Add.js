import { Piece } from 'piecesjs'

export class Add extends Piece {
	constructor() {
		super();

		this.name = 'More';
		this.styles = `/assets/css/components/add.css`;
	}

	initEvents() {
		this.$button = this.$('button');
		this.addEvent('click', this.$button, this.increment)
	}

	removeEvents() {
		this.removeEvent('click', this.$button, this.increment)
	}
	
	render() {
		return `
			<h2>More component</h2>
			<p>Value: ${this.value}</p>
			<button class="c-button">Increment</button>
		`;
	}

	increment() {
		console.log('increment');
		this.value = parseInt(this.value) + 1;
	}

	set value(value) {
		return this.setAttribute('value', value);
	}

	get value() {
		return this.getAttribute('value');
	}

	// Important to automatically call the update function if attribute is changing
	static get observedAttributes() { 
		return ['value'];
	}
}

// Register the custom element
customElements.define('c-add', Add);