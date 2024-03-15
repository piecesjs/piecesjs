
# piecesjs

#### piecesjs is a tiny Javascript framework built on the top of native custom elements with a bunch of tools and utilities.

A Piece is a component. A component is a piece of your page, which can live anywhere in your website, with its own encapsulated styles.

piecesjs is a simple and lightweight framework that aims to make native custom elements accessible, with several utilities and tools for website and app development.
Like modern frameworks, it dynamically imports the JS and CSS that the page needs, for better optimization. Without being limited to a big headless infrastructure.

Compiled with [vitejs](https://vitejs.dev/).


## Features

- Dynamic JS & CSS import.
- Scoped event manager.
- Easy access to all elements inside a component with a `this.$(yourQuery)`.
- Communication between active components.
- Common and global CSS import management.
- A PiecesManager to access to all active components.

## 2 types of components

### With dynamic attributes (reactive)
```html
<c-more class="c-more" value="0"></c-more>
```

```js
import { paths } from  "/piecesconfig.json"  assert { type:  "json" };

export  class  More  extends  Piece {
	constructor() {
		super();
		this.name =  'More';
		this.styles = `/assets/css/components/more.css`;
	}

	mount() {
		super.mount();	
		
		// Add scoped event listener
		this.$button =  this.$('button');
		this.addEvent('click',this.$button,this.click)
	}

	unMount() {
		super.unMount();
		//Remove event listener
		this.removeEvent('click',this.$button,this.click)
	}

	render() {
		return  `
			<h2>More component</h2>
			<p>Value: ${this.value}</p>
			<button type="button">Increment</button>
		`;
	}
	click() {
		this.value =  parseInt(this.value) +  1;
	}

	set  value(value) {
		return  this.setAttribute('value',  value);
	}
	get  value() {
		return  this.getAttribute('value');
	}

	// Important to observe all changing attributes
	static  get  observedAttributes() {
		return ['value'];
	}
}

// Register the custom element
customElements.define('c-more',  More);
```

### With static content

```html
<c-header class="c-header">
<h1>Hello world 🫶</h1>
</c-header>
```
 
```js
import { default  as Piece } from  './Piece.js'
  
export  class  Header  extends  Piece {
constructor() {
	super();
	this.name =  'Header';
	
	//Encapsulated styles
		this.styles = `/assets/css/components/more.css`;

}
}
// Register the custom element
customElements.define('c-header',  Header);
```
---
## Lifecycle
```js
preMount(){}
mount(){}
unMount(){}
update(){} //Called if an attribute is changed
```

## Events
Register an event
```js
/* 
You can add an event in the mount(). 
The called function is automatically binded to this
params: (eventName, HTMLElement, func)
*/

this.addEvent('click', this.$button, this.click)
```
Unregister the event
```js
/* 
You can remove the event listener in the unMount(). 
params: (eventName, HTMLElement, func)
*/
this.removeEvent('click', this.$button, this.click)
```

## PiecesManager
Used to manage all active Pieces. 
To access to the current components visible in the page:
```js
import { piecesManager } from "../PiecesManager";

console.log(piecesManager.currentPieces);
```

## Utils

### Logs
You can log the lifecycle of your component with an attribute `log`

```html
<c-header log>Hello</c-header>
```

### Query with this.$
Shortcut to query an element
```js
// return the element if there is just 1 element, otherwise it returns an array of elements
this.$('button'); 
```