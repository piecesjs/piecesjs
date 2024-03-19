import { Piece } from 'piecesjs'

class Add extends Piece {
	constructor() {
		super('Add', {
			stylesheets: [
				() => import('/assets/css/components/add.css')
			]
		});
	}

	mount() {
		this.$button = this.$('button')[0];
		this.addEvent('click', this.$button, this.increment);
	}

	unmount() {
		this.removeEvent('click', this.$button, this.increment);
	}
	
	render() {
		return `
			<h2>${this.name} component</h2>
			<p>Value: ${this.value}</p>
			<button class="c-button">Increment</button>
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
customElements.define('c-add', Add);