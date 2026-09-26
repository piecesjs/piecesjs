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
     * Resolves once the stylesheets of the first mount are loaded
     * @type {Promise<void>}
     */
    this.stylesReady = Promise.resolve();

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
     * Store bound event listeners for proper cleanup, keyed by the original function
     * @private
     * @type {Map<Function, {bound: Function, wrappers: Array<{item: EventTarget, type: string, wrapper: Function}>}>}
     */
    this._boundListeners = new Map();

    /**
     * Store data-events handlers for proper cleanup
     * @private
     * @type {Array<{element: Element, eventName: string, handler: Function, eventInitKey?: string}>}
     */
    this._dataEventHandlers = [];

    /**
     * True between privateMount and a non-update privateUnmount
     * @private
     * @type {boolean}
     */
    this._mounted = false;
  }

  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(firstHit = true) {
    if (firstHit) {
      // Add the piece to the PiecesManager
      if (typeof this.cid != 'string') {
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
      const html = this.render();
      this.template.innerHTML = html != undefined ? html : '';
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

    const styles = this.loadStyles(firstHit);
    // An update must not replace a first-hit promise that is still pending
    if (firstHit) this.stylesReady = styles;
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
    }

    this._mounted = true;
    // Bound on every mount: render() pieces replace their DOM on update
    this.privateBindEvents();

    this.mount(firstHit);
  }

  /**
   * Bind data-events-* attributes of the piece and its descendants
   */
  privateBindEvents() {
    // XPath filters on attribute name prefix natively, which CSS selectors can't do
    const snapshot = document.evaluate(
      "descendant-or-self::*[@*[starts-with(name(), 'data-events-')]]",
      this,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null,
    );

    this.domEventsElements = [];

    for (let i = 0; i < snapshot.snapshotLength; i++) {
      const element = snapshot.snapshotItem(i);
      this.domEventsElements.push(element);

      for (const attribute of element.attributes) {
        if (!attribute.name.startsWith('data-events-')) continue;

        const eventName = attribute.name.slice('data-events-'.length);
        const params = attribute.value.split(',');

        if (params.length == 1) {
          const handler = this[attribute.value];
          if (typeof handler == 'function') {
            this.on(eventName, element, handler);
            this._dataEventHandlers.push({ element, eventName, handler });
          }
        } else {
          const eventInitKey = `eventInit${eventName}`;

          // The flag prevents a parent piece and a nested piece from binding the same element twice
          if (element.dataset[eventInitKey] == undefined) {
            const [functionName, pieceName, pieceId] = params;
            element.dataset[eventInitKey] = true;
            const handler = (event) =>
              this.call(functionName, event, pieceName, pieceId);
            element.addEventListener(eventName, handler);
            this._dataEventHandlers.push({
              element,
              eventName,
              handler,
              eventInitKey,
            });
          }
        }
      }
    }
  }

  /**
   * Unbind everything registered by privateBindEvents
   */
  privateUnbindEvents() {
    this._dataEventHandlers.forEach(
      ({ element, eventName, handler, eventInitKey }) => {
        if (eventInitKey) {
          element.removeEventListener(eventName, handler);
          delete element.dataset[eventInitKey];
        } else {
          this.off(eventName, element, handler);
        }
      },
    );
    this._dataEventHandlers = [];
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
      this._mounted = false;

      // Another piece may have claimed this cid meanwhile (e.g. page transitions
      // keeping both containers alive): only remove the entry if it's ours
      const registered = this.piecesManager.currentPieces[this.name]?.[this.cid];
      if (registered?.piece === this) {
        this.piecesManager.removePiece({
          name: this.name,
          id: this.cid,
        });
      }
    }

    this.privateUnbindEvents();

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

    // Upgrades fire this before connectedCallback: the first mount handles it
    if (!this._mounted) return;

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
    const capture = context.querySelectorAll('[data-dom]');
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
    if (el == null) return;

    // Keyed by reference: two handlers sharing a name (or anonymous) stay distinct
    let listener = this._boundListeners.get(func);
    if (!listener) {
      listener = { bound: func.bind(this), wrappers: [] };
      this._boundListeners.set(func, listener);
    }

    const items = isNodeList(el) || Array.isArray(el) ? el : [el];

    for (const item of items) {
      if (params == null) {
        item.addEventListener(type, listener.bound);
      } else {
        const wrapper = () => listener.bound(params);
        item.addEventListener(type, wrapper);
        listener.wrappers.push({ item, type, wrapper });
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
    if (el == null) return;

    const listeners = [];
    if (this._boundListeners.has(func)) {
      listeners.push(this._boundListeners.get(func));
    } else {
      // Handlers re-created on each call (e.g. fn.bind(this)) never match by
      // reference: fall back to the name, as keys used to be name-based
      for (const [original, listener] of this._boundListeners) {
        if (original.name === func.name) {
          listeners.push(listener);
          this._boundListeners.delete(original);
        }
      }
    }

    if (listeners.length == 0) {
      console.warn(`No bound listener found for ${type}_${func.name}`);
      return;
    }

    const items =
      isNodeList(el) || Array.isArray(el) ? Array.from(el) : [el];

    for (const listener of listeners) {
      for (const item of items) {
        item.removeEventListener(type, listener.bound);
      }

      listener.wrappers = listener.wrappers.filter(
        ({ item, type: wrapperType, wrapper }) => {
          if (wrapperType !== type || !items.includes(item)) return true;
          item.removeEventListener(type, wrapper);
          return false;
        },
      );
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
   * Call function of a piece, from a piece
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(func, args, pieceName, pieceId) {
    // Own keys only: names like "constructor" must not hit Object.prototype
    const hasOwn = (object, key) =>
      Object.prototype.hasOwnProperty.call(object, key);
    const { currentPieces } = this.piecesManager;
    if (!hasOwn(currentPieces, pieceName)) return;
    const pieces = currentPieces[pieceName];

    if (pieceId != undefined) {
      if (!hasOwn(pieces, pieceId)) return;
      return pieces[pieceId].piece[func](args);
    }

    let callback;
    for (const id of Object.keys(pieces)) {
      // A previous call may have unmounted this piece
      const entry = pieces[id];
      if (entry) callback = entry.piece[func](args);
    }

    return callback;
  }

  /**
   * Load stylesheets dynamically from super()
   * @param {boolean} [firstHit=true] - False if called after an update
   * @returns {Promise<void>}
   */
  async loadStyles(firstHit = true) {
    if (firstHit) {
      // Sequential on purpose: Vite dev injects CSS in resolution order, so
      // parallel loading could reorder the cascade (prod keeps call order)
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
