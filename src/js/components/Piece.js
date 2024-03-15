
import { piecesManager } from "../PiecesManager";

export class Piece extends HTMLElement {
	constructor() {
		super();

		this.name = 'Piece';
		this.template = document.createElement('template');

		if(this.innerHTML != ' ') {
			this.baseHTML = this.innerHTML;
		}

		this.events = {};
	}

	// 
	// Basic Custom Elements functions
	// 
	connectedCallback(firstHit = true) {
		if(firstHit) {
			// Add the piece to the PiecesManager
			if(typeof this.cid == 'string') {
				this.id = this.cid;
			} else {
				this.id =`c${piecesManager.piecesCount++}`;
			}
			
			piecesManager.addPiece({
				name: this.name,
				id: this.id,
				piece: this
			});
		}

		this.preMount();

		this.template.innerHTML = this.render();
		this.appendChild(this.template.cloneNode(true).content);
		
		this.mount();
	}

	render() {
		if(this.baseHTML != undefined) {
			return this.baseHTML;
		}
	}

	disconnectedCallback() {
		this.unMount();
	}

	adoptedCallback() {
		this.adopted();
	}

	// Step 0
	preMount() {
		this.innerHTML = '';

		if(this.log) {
			console.log('🚧 preMount', this.name);
		}

		this.loadStyles();
	}

	// Step 1
	mount() {
		if(this.log) {
			console.log('🔨 mount', this.name);
		}
	}

	// Step 2
	update() {
		if(this.log) {
			console.log('🔃 update', this.name);
		}

		this.connectedCallback(false);
	}

	// Step 3
	unMount() {
		piecesManager.removePiece({
			name: this.name,
			id: this.id
		});

		if(this.log) {
			console.log('👋 unMount', this.name);
		}
	}
	
	attributeChangedCallback(property, oldValue, newValue) {
		if (oldValue === newValue) return;
		this[property] = newValue;

		this.update();
	}

	// Simple query to return an HTMLElement
	$(query) {
		if(this.querySelectorAll(query).length > 1) {
			return this.querySelectorAll(query);
		} else {
			return this.querySelector(query);

		}
	}

	// 
	// Event Managment
	//
	addEvent(type,el,func) {
		el.addEventListener(type,func.bind(this))
	}

	removeEvent(type, el) {
		el.removeEventListener(type,func.bind(this))
	}

	// Call function anywhere
	call(func,args,pieceName, pieceId) {

		Object.keys(piecesManager.currentPieces).forEach(name => {
			if(name == pieceName) {
				Object.keys(piecesManager.currentPieces[name]).forEach(id => {

					if(pieceId != undefined) {
						if(id == pieceId) {
							let piece = piecesManager.currentPieces[name][id].piece;
							piece[func](args);
						}
					} else {
						let piece = piecesManager.currentPieces[name][id].piece;
						piece[func](args);
					}
				});
			}
		});
	}

	// Dynamically load styles in the page
	async loadStyles() {
		if(this.styles != undefined) {
			const importedStyle = await import(/* @vite-ignore */this.styles);
		}
	}

	get log() {
		return typeof this.getAttribute('log') == 'string';
	}

	get cid() {
		return this.getAttribute('cid')
	}

	get properties() {
		return Object.values(this.attributes)
			.map(a => `${a.name}="${a.value}"`)
			.join(' ');
	}
}