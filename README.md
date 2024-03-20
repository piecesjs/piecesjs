<div align="left">
	<img src="https://github.com/piecesjs/piecesjs/blob/main/test/assets/logo.png?raw=true" witdh="160" height="57" alt="piecesjs">
  <br>
	<p>
		[alpha] - [<a href="https://bundlephobia.com/package/piecesjs@0.0.10">1.1kb</a>] - Front-end js framework, using native web components.
	</p>
</div>

## Introduction

piecesjs is a tiny Javascript framework built on the top of native web components with a bunch of tools and utilities.

A Piece is a component. A component is a piece of your page, which can live anywhere in your website, with its own encapsulated styles.

---

piecesjs is a simple and lightweight front-end framework that aims to make native web components accessible, with several utilities and tools for website and app development.
Like modern frameworks, it dynamically imports the JS and CSS that the page needs, for better optimization. Without being limited to a big headless infrastructure.

Compiled with [vitejs](https://vitejs.dev/).

## Main features

- Dynamic JS & CSS import.
- Scoped event management.
- Convenient access to scoped HTMLElements using this.$().
- Seamless communication between active components.
- Efficient management of common and global CSS imports.
- A PiecesManager for accessing all active components.

## Installation

```
npm i piecesjs --save
```

## Create your first component

### With dynamic attributes (reactive)

```html
<c-add class="c-add" value="0"></c-add>
```

```js
import { default as Piece } from "piecesjs";

export class Add extends Piece {
  constructor() {
    super("add", {
      stylesheets: [() => import("/assets/css/components/add.css")],
    });
  }

  mount() {
    this.$button = this.$('button')[0];
    this.addEvent("click", this.$button, this.click);
  }

  unmount() {
    this.removeEvent("click", this.$button, this.click);
  }

  render() {
    return `
      <h2>${this.name} component</h2>
      <p>Value: ${this.value}</p>
      <button class="c-button">Increment</button>
    `;
  }

  click() {
    this.value = parseInt(this.value) + 1;
  }

  set value(value) {
    return this.setAttribute("value", value);
  }

  get value() {
    return this.getAttribute("value");
  }

  // Important to automatically call the update function if attribute is changing
  static get observedAttributes() {
    return ["value"];
  }
}

// Register the custom element
customElements.define("c-add", Add);
```

### With static content

```html
<c-header class="c-header">
  <h1>Hello world 🫶</h1>
</c-header>
```

```js
import { default as Piece } from "piecesjs";

class Header extends Piece {
  constructor() {
    // Set the name of your component and stylesheets directly with the super();
    super("Header", {
      stylesheets: [() => import("/assets/css/components/header.css")],
    });
  }
}
// Register the custom element
customElements.define("c-header", Header);
```

### Register and load dynamically your component

```js
import { load } from "piecesjs";

load("c-button", () => import(`/assets/js/components/Button.js`));
```

---

## Lifecycle

```js
premount(){}
mount(){}
update(){} //Called if an attribute is changed : unmount(), premount(), mount()
unmount(){}
```

### Query with this.$

Shortcut to query an element

```js
// return an array of elements
this.$('button');
```

## Events

Register an event

```js
/*
You can add an event in the mount().
The called function is automatically binded to this
params: (eventName, HTMLElement or array of HTMLElement, func [,parameters])
*/
mount() {
  this.addEvent('click', this.$button, this.click, {hello: 'world'});
}
```

Unregister the event

```js
/*
You can remove the event listener in the unmount().
params: (eventName, HTMLElement or array of HTMLElement, func)
*/
unmount() {
  this.removeEvent('click', this.$button, this.click);
}
```

Call a function of any components, from any components

```js
/*
params: (functionName, args, pieceName [,pieceId])
*/
this.call("increment", {}, "Add", "myAddComponentId");
```

If no pieceId are specified, all occurrences of the component will be called.
A pieceId can be set directly with an attribute `cid`

```html
<c-button cid="myButtonUId"></c-button>
```

## PiecesManager

Used to manage all active components.
To access to the current components active in the page:

```js
import { piecesManager } from "piecesjs";
console.log(piecesManager.currentPieces);

// or in a Piece
console.log(this.piecesManager);
class Header extends Piece {
  mount() {
    console.log(this.piecesManager.currentPieces);
  }
}

/*

{
  Add: {
    c0: {
      name: 'Add',
      id: 'c0',
      piece: HTMLElement
    },
    myAddComponentId: {
      name: 'Add',
      id: 'myAddComponentId',
      piece: HTMLElement
    }
  }, 
  Button: {
    c2: {
      name: 'Button',
      id: 'c2',
      piece: HTMLElement
    }
  }, 
  Header: {
    c1: {
      name: 'Header',
      id: 'c1',
      piece: HTMLElement
    }
  }
}
*/
```

## Utils

### Logs

You can log the lifecycle of your component with an attribute `log`

```html
<c-header log>Hello</c-header>
```

<a href="https://polar.sh/quentinhocde"><picture><source media="(prefers-color-scheme: dark)" srcset="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe&darkmode"><img alt="Subscribe on Polar" src="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe"></picture></a>
