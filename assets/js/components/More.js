import { Piece } from 'piecesjs'

export class More extends Piece {
	constructor() {
		super();

		this.name = 'More';
		this.styles = `/assets/css/components/more.css`;
	}

	mount() {
		super.mount();
		this.$button = this.$('c-button');

		this.addEvent('click', this.$button, this.increment)
	}

	unMount() {
		super.unMount();

		this.removeEvent('click', this.$button, this.increment)
	}
	
	render() {
		return `
			<h2>More component</h2>
			<p>Value: ${this.value}</p>
			<c-button class="c-button">Increment</c-button>
		`;
	}

	increment() {
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
customElements.define('c-more', More);