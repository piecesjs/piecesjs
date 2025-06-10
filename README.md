<div align="center">
	<img src="https://github.com/piecesjs/piecesjs/blob/main/test/assets/logo-square.png?raw=true" witdh="360" height="360" alt="piecesjs">
  <br>
  <br>
	<p>
		[beta] - [<a href="https://bundlephobia.com/package/piecesjs@0.3.0">1.5kb</a>] - Tiny framework, using native web components.
	</p>
</div>

### Codrops article

[Getting Started with Piecesjs: Building Native Web Components with a Lightweight Framework](https://tympanus.net/codrops/2024/10/21/getting-started-with-piecesjs-building-native-web-components-with-a-lightweight-framework/)

## Introduction

piecesjs is a lightweight JavaScript framework built upon native web components, offering a suite of tools and utilities tailored for creative websites.

---

At its core, a “Piece” is a modular component that can live anywhere on your webpage. Each Piece operates independently, with its own encapsulated styles and interactions, making it easy to manage and reuse across your site.

Piecesjs dynamically imports only the necessary JavaScript and CSS for each page, optimizing performance while maintaining flexibility. Unlike larger frameworks, it allows you to build exactly what you need, free from the overhead of unnecessary code or restrictive architectures.

Designed for creative websites that rely heavily on JavaScript logic—handling multiple steps, states, and events—piecesjs offers a streamlined and scalable approach for developers looking to create highly interactive experiences.

Compiled with [vitejs](https://vitejs.dev/).

## Main features

- Dynamic JS & CSS Import: Automatically loads only the necessary JavaScript and CSS for each page, improving performance.
- Scoped Event Management: Easily manage events within a specific component’s scope using `this.on()` and `this.off()` methods.
- Convenient Access to Scoped HTMLElements: Quickly access elements within the component using `this.$()` or `this.domAttr('slug')`.
- Seamless Communication Between Active Components: Components can communicate effortlessly with each other using `this.call()` or `this.emit()`.
- Efficient Global CSS Management: Streamlined handling of global CSS imports to keep your styles organized.
- PiecesManager: Provides centralized access to all active pieces, simplifying component management.

## Nav

- [Introduction](#introduction)
- [Main features](#main-features)
- [Installation](#installation)
- [Create your first Piece](#create-your-first-piece)
- [Lifecycle](#lifecycle)
- [Queries](#queries)
- [Events](#events)
  - [HTML Event System](#html-event-system)
- [Communication between components](#communication-between-components)
- [PiecesManager](#piecesmanager)
- [Methods, props and attributes](#memo)
- [Support](#support)

## Installation

```
npm i piecesjs --save
```

## Create your first Piece

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
    this.$button = this.$('button');
    this.on('click', this.$button, this.click);
  }

  unmount() {
    this.off('click', this.$button, this.click);
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
  <h1>Hello world</h1>
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

The load function can take a context (HTMLElement) as its third parameter. It's really usefull for page transitions or if you add dynamically some pieces in your DOM.
This will re-run a “check” of the pieces present in the "context", and mount them if there are any new ones.

```js
import { load } from 'piecesjs';

load(
  'c-button',
  () => import('/assets/js/components/Button.js'),
  document.querySelector('#wrapper'),
);
```

---

## Lifecycle

```js
premount(firstHit = true){}
render(){} // if you want to do a Javascript rendering
mount(firstHit = true){} // firstHit parameter is set to false if the function is called after an update or if its content is changed.
update(){} //Called if an attribute is changed. Then it will call unmount(), premount() and mount().
unmount(update = false){} // update = true if this unmount() is called after an attribute is changed.
```

## Queries

### this.$

Shortcut to query an element. `this.dom(query, context)` is also available.

```js
let myButton = this.$('button'); // returns a NodeList if there is more than one element otherwise returns the HTMLElement
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
let listItems this.domAttr('listItem'); // returns a NodeList if there is more than one element otherwise returns the HTMLElement
```

### NodeList anyway

If you prefer get a `NodeList` even if there is just one element (useful for dynamic content), you can call these functions : `this.$All()`, `this.domAll()` and `this.domAttrAll()` with the same parameters as above

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

### HTML Event System

PiecesJS provides a declarative way to handle events directly in your HTML using `data-events-*` attributes.

#### Syntax

```html
<!-- 1 parameter: call method in current or parent Piece -->
<button data-events-click="increment">Increment</button>

<!-- 2 parameters: call method in all instances of a Piece type -->
<button data-events-click="reset,Counter">Reset All Counters</button>

<!-- 3 parameters: call method in specific Piece instance -->
<button data-events-click="increment,Counter,mainCounter">
  Increment Main Counter
</button>
```

#### Example

```html
<c-header>
  <button data-events-click="toggleMenu">Toggle Menu</button>
  <button data-events-click="reset,Counter">Reset All</button>
  <button data-events-click="increment,Counter,mainCounter">+1 Main</button>
</c-header>

<c-counter cid="mainCounter" value="0"></c-counter>
```

```js
class Header extends Piece {
  toggleMenu() {
    console.log('Menu toggled!');
  }
}

class Counter extends Piece {
  reset() {
    this.value = 0;
  }
  increment() {
    this.value = parseInt(this.value) + 1;
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(val) {
    this.setAttribute('value', val);
  }

  static get observedAttributes() {
    return ['value'];
  }
}
```

You can use any DOM event: `data-events-click`, `data-events-mouseenter`, `data-events-input`, etc.

#### How it works

PiecesJS automatically scans for `data-events-*` attributes during mount, binds the appropriate event listeners, and cleans them up on unmount.

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

---

## Memo

### HTML attributes

| Attribute | Description                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| `log`     | You can log the lifecycle of your Piece with an attribute `<c-header log>Hello</c-header>`  |
| `cid`     | To override the generated id of your Piece. Usefull to communicate with this specific Piece |

### Piece instance props

| Attribute   | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| `this.cid`  | A generated id of the Piece, override if you set a cid attribute |
| `this.name` | Return the name of the Piece                                     |

### Piece instance methods

| Method         | Description                                                                   | Arguments                                                                       |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `this.$`       | Query an HTMLElement                                                          | <ul><li>`query`: String</li><li> `context`: HTMLElement, `this` by default</li> |
| `this.dom`     | `this.$` clone                                                                | <ul><li>`query`: String</li><li> `context`: HTMLElement, `this` by default</li> |
| `this.domAttr` | Query with a slug. If you have an element like `<li> data-dom="mySlug"></li>` | `slug`: String                                                                  |

### Piece events methods

| Method      | Description                                                                 | Arguments                                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.on`   | Event listener for scoped and binded (this) events                          | <ul><li>`type`: String (example: `mouseenter`, `resize`..)</li><li>`el`: HTMLElement or HTMLElement[]</li><li>`func`: Function</li><li>`params`: {} (optional)</li> |
| `this.off`  | Remove event listener, the better way is to put it in the `unmount()`.      | <ul><li>`type`: String (example: `mouseenter`, `resize`..)</li><li>`el`: HTMLElement or HTMLElement[]</li><li>`func`: Function</li>                                 |
| `this.call` | Call of a function of a Piece or a specific Piece based on its `cid`        | <ul><li>`func`: String, the function name</li><li>`args`: Object</li><li>`pieceName`: String</li><li>`pieceId`: String (optional), linked to a `cid` attribute</li> |
| `this.emit` | Emit a custom event. Can be listened by the other Pieces with a `this.on()` | <ul><li>`eventName`: String</li><li>`el`: HTMLElement, document by default (optional)</li><li>`params`: Object (optional)</li>                                      |

## You want to collaborate ?

Clone the repo and at the root `/`

```
npm i
```

In the test environment, link your local piecesjs to use it as an npm package

```
cd /test
npm link piecesjs
```

Then back to the root with `cd ../`
and build piecesjs

```
npm run build
```

Test environment :
In the folder `/test`

```
npm run dev
```

Enjoy and feel free to create a pull request!

## Support

If you want to support me, and follow the journey of the creation of pieces 👀

<a href="https://github.com/sponsors/piecesjs">Support me on github</a>

<a href="https://polar.sh/quentinhocde"><picture><source media="(prefers-color-scheme: dark)" srcset="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe&darkmode"><img alt="Subscribe on Polar" src="https://polar.sh/embed/subscribe.svg?org=quentinhocde&label=Subscribe"></picture></a>
