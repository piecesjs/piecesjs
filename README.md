<div align="center">
	<img src="https://github.com/piecesjs/piecesjs/blob/main/test/assets/logo-square.png?raw=true" witdh="360" height="360" alt="piecesjs">
  <br>
  <br>
	<p>
		[beta] - [<a href="https://bundlephobia.com/package/piecesjs@0.2.0">1.1kb</a>] - Tiny framework, using native web components.
	</p>
</div>

## Introduction

piecesjs is a tiny Javascript framework built on the top of native web components with a bunch of tools and utilities.

A Piece is a component. A component is a piece of your page, which can live anywhere in your website, with its own encapsulated styles and interactions.

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
<c-counter class="c-counter" value="0"></c-counter>
```

```js
import { Piece } from 'piecesjs';

export class Counter extends Piece {
  constructor() {
    super('Counter', {
      stylesheets: [() => import('/assets/css/components/counter.css')],
    });
  }

  mount() {
    this.$button = this.$('button')[0];
    this.on('click', this.$button, this.click);
  }

  unmount() {
    this.off('click', this.$button[0], this.click);
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
customElements.define('c-counter', Counter);
```

### With static content

```html
<c-header class="c-header">
  <h1>Hello world 🫶</h1>
</c-header>
```

```js
import { Piece } from 'piecesjs';

class Header extends Piece {
  constructor() {
    // Set the name of your component and stylesheets directly with the super();
    super('Header', {
      stylesheets: [() => import('/assets/css/components/header.css')],
    });
  }
}
// Register the custom element
customElements.define('c-header', Header);
```

### Register and load dynamically your component

```js
import { load } from 'piecesjs';

load('c-button', () => import('/assets/js/components/Button.js'));
```

---

## Lifecycle

```js
premount(firstHit = true){}
mount(firstHit = true){} // firstHit parameter is available, set to false if the function is called with an update or if its content is changed.
update(){} //Called if an attribute is changed, relaunch: unmount(update = true), premount(firstHit = false), mount(firstHit = false)
unmount(update = false){}
```

### Query with this.$

Shortcut to query an element. `this.dom(query, context)` is also available.

```js
/**
 * @param { String } query
 * @param { HTMLElement } context (this by default)
 */
this.$('button'); // return a NodeList
```

### Get an element with a slug

```html
<ul>
  <li data-dom="listItem">Item 1</li>
  <li data-dom="listItem">Item 2</li>
</ul>
```

```js
/**
 * @param { String } slug
 * @param { HTMLElement } context (this by default)
 */
this.domAttr('listItem'); // return a NodeList
```

## Events

Register an event listener with `this.on()`

```js
/*
* Tips: call event listeners in the mount(), register event for an HTMLElement or an array of HTMLElements
* The called func is automatically binded to this
* @param { String } type
* @param { HTMLElement or HTMLElement[] } el
* @param { function } func
* @param { Object } params
*/
mount() {
  this.on('click', this.$button, this.click, {hello: 'world'});

  // You can also use this.on() to add an event listener on global elements
  // this.on('resize', window, this.resize);
}

// if you have set params, the eventObject will be available after
click(params, event) {}
```

Unregister an event listener with `this.off()`

```js
/**
 * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
 * @param { String } type
 * @param { HTMLElement } el
 * @param { function } func
 */
unmount() {
  this.off('click', this.$button, this.click);
}
```

## Communication between components

### this.call()

Call a function of any components, from any components

```js
/**
 * Call function of a component, from a component
 * @param { String } func
 * @param { Object } args
 * @param { String } pieceName
 * @param { String } pieceId
 */
this.call('increment', {}, 'Counter', 'myCounterComponentId');
```

If no `pieceId` are specified, all occurrences of the component will be called.
A `pieceId` can be set directly with an attribute `cid`

```html
<c-button cid="myButtonUId"></c-button>
```

### this.emit() and custom events

You can also emit a custom event with `this.emit()`

```js
/**
 * Emit a custom event
 * @param { String } eventName
 * @param { HTMLElement } el, by default the event is emit on document
 * @param { Object } params
 */
this.emit('buttonIsMounted', document, { value: 'A Button is mounted!' });
```

Then, in a Piece you can use `this.on()`, like the default events.

```js
mount() {
  this.on('buttonIsMounted', document, this.customEventTrigger);
}

// You can get parameters with event.detail
customEventTrigger(event) {
  console.log(event.detail); // { value: 'A Button is mounted! }
}

unmount() {
  this.off('buttonIsMounted', document, this.customEventTrigger);
}
```

## PiecesManager

PiecesManager manage all active components.
Get access of all current components visible in the page:

```js
// From anywhere
import { piecesManager } from 'piecesjs';
console.log(piecesManager.currentPieces);

// In a Piece
console.log(this.piecesManager);

class Header extends Piece {
  mount() {
    console.log(this.piecesManager.currentPieces);
  }
}

/*
{
  Counter: {
    c0: {
      name: 'Counter',
      id: 'c0',
      piece: HTMLElement
    },
    myCounterComponentId: {
      name: 'Counter',
      id: 'myCounterComponentId',
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

## You want to collaborate ?

Clone the repo and at the root `/`

```
npm i
```

Link your local piecesjs to use it as an npm package

```
npm link piecesjs
```

Build piecesjs

```
npm run build
```

Test environment :
In the folder `/test`

```
npm i
npm run dev
```

Enjoy and feel free to create a pull request!

## Support

If you want to support me, and follow the journey of the creation of pieces 👀

<a href="https://polar.sh/quentinhocde"><picture><source media="(prefers-color-scheme: dark)" srcset="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe&darkmode"><img alt="Subscribe on Polar" src="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe"></picture></a>
