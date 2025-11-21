import { piecesManager } from './piecesManager';
import { isNodeList } from './utils';

/**
 * Piece is a base class for creating native web components
 * Extends HTMLElement and provides lifecycle methods, DOM queries, and event management
 */
export class Piece extends HTMLElement {
  /**
   * Creates a new Piece component
   * @param {string} [name] - Component name (defaults to class name if not provided)
   * @param {{stylesheets?: Array<() => Promise<any>>}} [options={}] - Configuration options
   * @param {Array<() => Promise<any>>} [options.stylesheets=[]] - Array of dynamic stylesheet import functions
   */
  constructor(name, { stylesheets = [] } = {}) {
    super();

    /**
     * Name of the component
     * @type {string}
     */
    this.name = name || this.constructor.name;

    /**
     * Template element for rendering
     * @type {HTMLTemplateElement}
     */
    this.template = document.createElement('template');

    /**
     * Reference to the global pieces manager
     * @type {import('./piecesManager').Manager}
     */
    this.piecesManager = piecesManager;

    /**
     * Array of stylesheet loader functions
     * @type {Array<() => Promise<any>>}
     */
    this.stylesheets = stylesheets;

    /**
     * Counter for tracking component instances
     * @type {number}
     */
    this.updatedPiecesCount = this.piecesManager.piecesCount++;

    if (this.innerHTML != '') {
      /**
       * Base HTML content if component has initial content
       * @type {string|undefined}
       */
      this.baseHTML = this.innerHTML;
    }

    /**
     * Store bound event listeners for proper cleanup
     * @private
     * @type {Map<string, {original: Function, bound: Function}>}
     */
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
   * Render HTML in the component
   * @returns {string|undefined}
   */
  render() {
    if (this.baseHTML != undefined) {
      return this.baseHTML;
    }
  }

  /**
   * Default function from native web components disconnectedCallback()
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
   * @param {boolean} firstHit - false if it's an update
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
   * Called before mounting (before render)
   * @param {boolean} [firstHit=true] - False if it's an update
   */
  premount(firstHit = true) {}

  /**
   * Lifecycle - step : 1
   * @param {boolean} firstHit - false if it's an update
   */
  privateMount(firstHit) {
    if (this.log) {
      console.log('✅ mount', this.name);
    }

    if (firstHit) {
      this.piecesManager.loadedPiecesCount++;

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
              let functionName = attributes[i].value;
              const params = attributes[i].value.split(',');

              if (params.length == 1) {
                if (typeof this[functionName] == 'function') {
                  this.on(eventName, element, this[functionName]);
                }
              } else {
                if (
                  params.length >= 2 &&
                  element.dataset.eventInit == undefined
                ) {
                  functionName = params[0];
                  const pieceName = params[1];
                  const pieceId = params[2];
                  element.dataset.eventInit = true;
                  this.on(eventName, element, () => {
                    this.call(functionName, element, pieceName, pieceId);
                  });
                }
              }
            }
          }
        });
      }
    }

    this.mount(firstHit);
  }

  /**
   * Called after mounting (after render) - use it to add event listeners
   * @param {boolean} [firstHit=true] - False if it's an update
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
   * Called when component is updated
   */
  update() {}

  /**
   * Lifecycle - step : 3
   * @param {boolean} update
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
              let functionName = attributes[i].value;
              const params = attributes[i].value.split(',');

              if (params.length == 1) {
                if (typeof this[functionName] == 'function') {
                  this.off(eventName, element, this[functionName]);
                }
              } else {
                if (
                  params.length >= 2 &&
                  element.dataset.eventInit == undefined
                ) {
                  functionName = params[0];
                  const pieceName = params[1];
                  const pieceId = params[2];
                  element.dataset.eventInit = true;
                  this.off(eventName, element, () => {
                    this.call(functionName, element, pieceName, pieceId);
                  });
                }
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
   * Called when component is unmounted - use it to remove event listeners
   * @param {boolean} [update=false] - True if called during an update
   */
  unmount(update = false) {}

  /**
   * default function from native web components
   * @param {string} property
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;

    this.privateUpdate();
  }

  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(query, context = this) {
    const result = context.querySelectorAll(query);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }

  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(query, context = this) {
    const result = context.querySelectorAll(query);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }

  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(query, context = this) {
    const result = context.querySelectorAll(`[data-dom="${query}"]`);
    return result.length == 1 ? result[0] : result.length == 0 ? null : result;
  }

  /**
   * Query selector - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  $All(query, context = this) {
    return Array.from(context.querySelectorAll(query));
  }

  /**
   * Same as $All - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAll(query, context = this) {
    return Array.from(context.querySelectorAll(query));
  }

  /**
   * Query by data-dom attribute - always returns an array
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAttrAll(query, context = this) {
    return Array.from(context.querySelectorAll(`[data-dom="${query}"]`));
  }

  /**
   * Capture all elements with data-dom attribute as object tree
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Object<string, Element[]>}
   */
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
   * @param {string} type
   * @param {HTMLElement|HTMLElement[]} el
   * @param {Function} func
   * @param {Object} params
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
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
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
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(eventName, el = document, params) {
    const event = new CustomEvent(eventName, {
      detail: params,
    });

    el.dispatchEvent(event);
  }

  /**
   * Call function of a component, from a component
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(func, args, pieceName, pieceId) {
    let callback;
    Object.keys(this.piecesManager.currentPieces).forEach((name) => {
      if (name == pieceName) {
        Object.keys(this.piecesManager.currentPieces[name]).forEach((id) => {
          if (pieceId != undefined) {
            if (id == pieceId) {
              let piece = this.piecesManager.currentPieces[name][id].piece;
              callback = piece[func](args);
            }
          } else {
            let piece = this.piecesManager.currentPieces[name][id].piece;
            callback = piece[func](args);
          }
        });
      }
    });

    return callback;
  }

  /**
   * Load stylesheets dynamically from super()
   * @param {boolean} [firstHit=true] - False if called after an update
   * @returns {Promise<void>}
   */
  async loadStyles(firstHit = true) {
    if (firstHit) {
      for (let i = 0; i < this.stylesheets.length; i++) {
        await this.stylesheets[i]();
      }
    }
  }

  /**
   * Check if log attribute is present
   * @returns {boolean}
   */
  get log() {
    return typeof this.getAttribute('log') == 'string';
  }

  /**
   * Get component ID
   * @returns {string|null}
   */
  get cid() {
    return this.getAttribute('cid');
  }

  /**
   * Set component ID
   * @param {string} cid
   */
  set cid(cid) {
    return this.setAttribute('cid', cid);
  }

  /**
   * Get all attributes as string
   * @returns {string}
   */
  get properties() {
    return Object.values(this.attributes)
      .map((a) => `${a.name}="${a.value}"`)
      .join(' ');
  }
}
