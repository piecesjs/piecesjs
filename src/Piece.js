import { piecesManager } from './piecesManager';
import { isNodeList } from './utils';

export class Piece extends HTMLElement {
  constructor(name, { stylesheets = [] } = {}) {
    super();

    this.name = name || this.constructor.name;
    this.template = document.createElement('template');
    this.piecesManager = piecesManager;

    this.stylesheets = stylesheets;

    this.updatedPiecesCount = this.piecesManager.piecesCount++;

    if (this.innerHTML != '') {
      this.baseHTML = this.innerHTML;
    }

    // Store bound event listeners
    this._boundListeners = new Map();
  }

  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(firstHit = true) {
    if (firstHit) {
      // Add the piece to the PiecesManager
      if (typeof this.cid == 'string') {
        this.cid = this.cid;
      } else {
        this.cid = `c${this.updatedPiecesCount}`;
      }

      this.piecesManager.addPiece({
        name: this.name,
        id: this.cid,
        piece: this,
      });
    }

    this.privatePremount(firstHit);

    if (this.baseHTML == undefined) {
      this.innerHTML = '';
      this.template.innerHTML = this.render() != undefined ? this.render() : '';
      this.appendChild(this.template.cloneNode(true).content);
    }

    this.privateMount(firstHit);
  }

  /**
   * Function to render HTML in component. If component is not emtpy, the rendering is not called
   */
  render() {
    if (this.baseHTML != undefined) {
      return this.baseHTML;
    }
  }

  /**
   * default function from native web components disconnectedCallback()
   */
  disconnectedCallback() {
    this.privateUnmount();
  }

  /**
   * default function from native web components adoptedCallback()
   */
  adoptedCallback() {}

  /**
   * Lifecycle - step : 0
   * @param { firstHit } boolean (false if it's an update)
   */
  privatePremount(firstHit = true) {
    if (this.baseHTML == undefined) {
      this.innerHTML = '';
    }

    if (this.log) {
      console.log('🚧 premount', this.name);
    }

    this.loadStyles(firstHit);
    this.premount(firstHit);
  }
  /**
   * Satelite function for premount
   */
  premount(firstHit = true) {}

  /**
   * Lifecycle - step : 1
   * @param { firstHit } boolean (false if it's an update)
   */
  privateMount(firstHit) {
    if (this.log) {
      console.log('✅ mount', this.name);
    }

    if (firstHit) {
      this.piecesManager.loadedPiecesCount++;

      // console.log(
      //   this.piecesManager.loadedPiecesCount,
      //   '/',
      //   this.piecesManager.piecesCount,
      // );

      // if (
      //   this.piecesManager.loadedPiecesCount == this.piecesManager.piecesCount
      // ) {
      //   console.log('🔥 all pieces are loaded');
      // }

      this.domEventsElements = Array.from(this.querySelectorAll('*')).filter(
        (element) => {
          const attributes = element.attributes;
          for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name.startsWith('data-events-')) {
              return true;
            }
          }
          return false;
        },
      );

      const attributes = this.attributes;

      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].name.startsWith('data-events-')) {
          this.domEventsElements.push(this);
        }
      }

      if (this.domEventsElements) {
        this.domEventsElements.forEach((element) => {
          let attributes = element.attributes;
          for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name.startsWith('data-events-')) {
              const eventName = attributes[i].name.replace('data-events-', '');
              const functionName = attributes[i].value;

              console.log(eventName, functionName);
              if (typeof this[functionName] == 'function') {
                this.on(eventName, element, this[functionName]);
              }
            }
          }
        });
      }
    }

    this.mount(firstHit);
  }

  /**
   * Satelite function for mount
   */
  mount(firstHit = true) {}

  /**
   * Lifecycle - step : 2
   */
  privateUpdate() {
    if (this.log) {
      console.log('🔃 update', this.name);
    }
    this.update();
    this.privateUnmount(true);
    this.connectedCallback(false);
  }
  /**
   * Satelite function for update
   */
  update() {}

  /**
   * Lifecycle - step : 3
   * @param { update } boolean
   */
  privateUnmount(update = false) {
    if (!update) {
      this.piecesManager.removePiece({
        name: this.name,
        id: this.cid,
      });

      if (this.domEventsElements) {
        this.domEventsElements.forEach((element) => {
          let attributes = element.attributes;
          for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name.startsWith('data-events-')) {
              const eventName = attributes[i].name.replace('data-events-', '');
              const functionName = attributes[i].value;

              console.log(eventName, functionName);
              if (typeof this[functionName] == 'function') {
                this.off(eventName, element, this[functionName]);
              }
            }
          }
        });
      }
    }

    if (this.log) {
      console.log('❌ unmount', this.name);
    }
    this.unmount(update);
  }

  /**
   * Satelite function for unmount
   */
  unmount(update = false) {}

  /**
   * default function from native web components
   * @param { String } property
   * @param { String } oldValue
   * @param { String } newValue
   */
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;

    this.privateUpdate();
  }

  /**
   * @param { String } query
   * @param { HTMLElement } context
   */
  $(query, context = this) {
    const result = context.querySelectorAll(query);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }

  dom(query, context = this) {
    const result = context.querySelectorAll(query);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }
  // To capture element using data-attribute <div data-dom='query'></div>
  domAttr(query, context = this) {
    const result = context.querySelectorAll(`[data-dom="${query}"]`);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }

  captureTree(context = this) {
    const capture = this.querySelectorAll('[data-dom]');
    let allDOM = {};
    for (let dom of capture) {
      const domAttr = dom.getAttribute('data-dom');
      if (typeof allDOM[domAttr] == 'undefined') {
        allDOM[domAttr] = [];
      }
      allDOM[domAttr].push(dom);
    }
    return allDOM;
  }

  /**
   * Events Managment
   */

  /**
   * Tips: call event listeners in the mount(), register event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement or HTMLElement[] } el
   * @param { function } func
   * @param { Object } params
   */
  on(type, el, func, params = null) {
    if (el != null) {
      // Create unique key for this event listener
      const key = `${type}_${func.name}`;

      // Create bound function if it doesn't exist
      if (!this._boundListeners.has(key)) {
        const boundFunc = func.bind(this);
        this._boundListeners.set(key, {
          original: func,
          bound: boundFunc,
        });
      }

      const boundFunc = this._boundListeners.get(key).bound;

      if (isNodeList(el) || Array.isArray(el)) {
        if (el.length > 0) {
          el.forEach((item) => {
            if (params == null) {
              item.addEventListener(type, boundFunc);
            } else {
              item.addEventListener(type, () => boundFunc(params));
            }
          });
        }
      } else {
        if (params == null) {
          el.addEventListener(type, boundFunc);
        } else {
          el.addEventListener(type, () => boundFunc(params));
        }
      }
    }
  }

  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement } el
   * @param { function } func
   */
  off(type, el, func) {
    if (el != null) {
      // Get the bound version of the function
      const key = `${type}_${func.name}`;
      const listener = this._boundListeners.get(key);

      if (!listener) {
        console.warn(`No bound listener found for ${key}`);
        return;
      }

      const boundFunc = listener.bound;

      if (isNodeList(el) || Array.isArray(el)) {
        if (el.length > 0) {
          el.forEach((item) => {
            item.removeEventListener(type, boundFunc);
          });
        }
      } else {
        el.removeEventListener(type, boundFunc);
      }

      // Clean up the stored reference
      this._boundListeners.delete(key);
    }
  }

  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el, by default the event is emit on document
   * @param { Object } params
   */
  emit(eventName, el = document, params) {
    const event = new CustomEvent(eventName, {
      detail: params,
    });

    el.dispatchEvent(event);
  }

  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(func, args, pieceName, pieceId) {
    Object.keys(this.piecesManager.currentPieces).forEach((name) => {
      if (name == pieceName) {
        Object.keys(this.piecesManager.currentPieces[name]).forEach((id) => {
          if (pieceId != undefined) {
            if (id == pieceId) {
              let piece = this.piecesManager.currentPieces[name][id].piece;
              piece[func](args);
            }
          } else {
            let piece = this.piecesManager.currentPieces[name][id].piece;
            piece[func](args);
          }
        });
      }
    });
  }

  /**
   * Dynamic loading of stylesheets from super()
   */
  async loadStyles(firstHit = true) {
    if (firstHit) {
      for (let i = 0; i < this.stylesheets.length; i++) {
        await this.stylesheets[i]();
      }
    }
  }

  get log() {
    return typeof this.getAttribute('log') == 'string';
  }

  get cid() {
    return this.getAttribute('cid');
  }

  set cid(cid) {
    return this.setAttribute('cid', cid);
  }

  get properties() {
    return Object.values(this.attributes)
      .map((a) => `${a.name}="${a.value}"`)
      .join(' ');
  }
}
