![Piecesjs logo](https://github.com/quentinhocde/piecesjs/blob/main/assets/logo.png?raw=true)

[alpha] - Just another front-end js framework.

### piecesjs is a tiny Javascript framework built on the top of native custom elements with a bunch of tools and utilities.

A Piece is a component. A component is a piece of your page, which can live anywhere in your website, with its own encapsulated styles.

piecesjs is a simple and lightweight front-end framework that aims to make native custom elements accessible, with several utilities and tools for website and app development.
Like modern frameworks, it dynamically imports the JS and CSS that the page needs, for better optimization. Without being limited to a big headless infrastructure.

Compiled with [vitejs](https://vitejs.dev/).

## Features

- Dynamic JS & CSS import.
- Scoped event manager.
- Easy access to all elements inside a component with a `this.$(yourQuery)`.
- Communication between active components.
- Common and global CSS import management.
- A PiecesManager to access to all active components.

## Installation
```
npm i piecesjs
```

## Create your first component

### With dynamic attributes (reactive)

```html
<c-more class="c-more" value="0"></c-more>
```

```js
import { default as Piece } from 'piecesjs'

export class More extends Piece {
  constructor() {
    super();

    this.name = 'More';
    this.styles = `/src/css/components/more.css`;
  }

  initEvents() {
    this.$button = this.$('button');
    this.addEvent('click', this.$button, this.click)
  }

  removeEvents() {
    this.removeEvent('click', this.$button, this.click)
  }
  
  render() {
    return `
      <h2>More component</h2>
      <p>Value: ${this.value}</p>
			<button class="c-button">Increment</button>
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
  
  // Important to automatically call the update function if attribute is changing
  static get observedAttributes() { 
    return ['value'];
  }
}

// Register the custom element
customElements.define('c-more', More);
```

### With static content

```html
<c-header class="c-header">
  <h1>Hello world 🫶</h1>
</c-header>
```

```js
import { default as Piece } from 'piecesjs'

export class Header extends Piece {
  constructor() {
    super();
    this.name = "Header";

    //Encapsulated styles
    this.styles = `/src/css/components/header.css`;
  }
}
// Register the custom element
customElements.define("c-header", Header);
```

### Register and load dynamically your component
```js
import { loadDynamically } from 'piecesjs';

loadDynamically('c-button', `/assets/js/components/Button.js`);
```

---

## Lifecycle

```js
preMount(){}
mount(){}
addEvents()
unMount(){}
removeEvents()

update(){} //Called if an attribute is changed, lifecycle restart
```

### Query with this.$

Shortcut to query an element

```js
// return the element if there is just 1 element, otherwise it returns an array of elements
this.$('button');
```

## Events

Register an event

```js
/* 
You can add an event in the addEvents(). 
The called function is automatically binded to this
params: (eventName, HTMLElement, func)
*/
addEvents() {
  this.addEvent('click', this.$button, this.click);
}
```

Unregister the event

```js
/* 
You can remove the event listener in the removeEvents(). 
params: (eventName, HTMLElement, func)
*/
removeEvents() {
  this.removeEvent('click', this.$button, this.click);
}
```

Call a function of any components, from any components
```js
this.call(functionName,args,pieceName[,pieceId])
```
If no pieceId are specified, all occuerences of the component will be called.
A pieceId can be set directly with an attribute
```html
<c-button pid="myButtonUId"></c-button>
```

## PiecesManager
Used to manage all active components.
To access to the current components active in the page:

```js
import { piecesManager } from 'piecesjs';
//piecesManager.currentPieces;
```

## Utils

### Logs

You can log the lifecycle of your component with an attribute `log`

```html
<c-header log>Hello</c-header>
```