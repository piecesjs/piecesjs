const v = async (a, t, e = document) => {
  e.getElementsByTagName(a).length > 0 && await t();
}, d = (a) => {
  var t = Object.prototype.toString.call(a);
  return typeof a == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(t) && typeof a.length == "number" && (a.length === 0 || typeof a[0] == "object" && a[0].nodeType > 0);
};
class f {
  constructor() {
    this.loadedPiecesCount = 0, this.piecesCount = 0, this.currentPieces = {};
  }
  /**
   * Add a piece to the manager
   * @param {{name: string, id: string, piece: import('./Piece').Piece}} piece - Piece data to add
   */
  addPiece(t) {
    typeof this.currentPieces[t.name] != "object" && (this.currentPieces[t.name] = {}), this.currentPieces[t.name][t.id] = t;
  }
  /**
   * Remove a piece from the manager
   * @param {{name: string, id: string}} piece - Piece data to remove
   */
  removePiece(t) {
    var e;
    (e = this.currentPieces[t.name]) == null || delete e[t.id];
  }
}
let p = new f();
class g extends HTMLElement {
  /**
   * Creates a new Piece component
   * @param {string} [name] - Component name (defaults to class name if not provided)
   * @param {{stylesheets?: Array<() => Promise<any>>}} [options={}] - Configuration options
   * @param {Array<() => Promise<any>>} [options.stylesheets=[]] - Array of dynamic stylesheet import functions
   */
  constructor(t, { stylesheets: e = [] } = {}) {
    super(), this.name = t || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = p, this.stylesheets = e, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map(), this._dataEventHandlers = [], this._mounted = !1;
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(t = !0) {
    if (t && (typeof this.cid != "string" && (this.cid = `c${this.updatedPiecesCount}`), this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(t), this.baseHTML == null) {
      this.innerHTML = "";
      const e = this.render();
      this.template.innerHTML = e ?? "", this.appendChild(this.template.cloneNode(!0).content);
    }
    this.privateMount(t);
  }
  /**
   * Render HTML in the component
   * @returns {string|undefined}
   */
  render() {
    if (this.baseHTML != null)
      return this.baseHTML;
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
  adoptedCallback() {
  }
  /**
   * Lifecycle - step : 0
   * @param {boolean} firstHit - false if it's an update
   */
  privatePremount(t = !0) {
    this.baseHTML == null && (this.innerHTML = ""), this.log && console.log("🚧 premount", this.name), this.loadStyles(t), this.premount(t);
  }
  /**
   * Called before mounting (before render)
   * @param {boolean} [firstHit=true] - False if it's an update
   */
  premount(t = !0) {
  }
  /**
   * Lifecycle - step : 1
   * @param {boolean} firstHit - false if it's an update
   */
  privateMount(t) {
    this.log && console.log("✅ mount", this.name), t && this.piecesManager.loadedPiecesCount++, this._mounted = !0, this.privateBindEvents(), this.mount(t);
  }
  /**
   * Bind data-events-* attributes of the piece and its descendants
   */
  privateBindEvents() {
    const t = document.evaluate(
      "descendant-or-self::*[@*[starts-with(name(), 'data-events-')]]",
      this,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    this.domEventsElements = [];
    for (let e = 0; e < t.snapshotLength; e++) {
      const n = t.snapshotItem(e);
      this.domEventsElements.push(n);
      for (const s of n.attributes) {
        if (!s.name.startsWith("data-events-")) continue;
        const r = s.name.slice(12), o = s.value.split(",");
        if (o.length == 1) {
          const i = this[s.value];
          typeof i == "function" && (this.on(r, n, i), this._dataEventHandlers.push({ element: n, eventName: r, handler: i }));
        } else {
          const i = `eventInit${r}`;
          if (n.dataset[i] == null) {
            const [l, u, h] = o;
            n.dataset[i] = !0;
            const c = (m) => this.call(l, m, u, h);
            n.addEventListener(r, c), this._dataEventHandlers.push({
              element: n,
              eventName: r,
              handler: c,
              eventInitKey: i
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
      ({ element: t, eventName: e, handler: n, eventInitKey: s }) => {
        s ? (t.removeEventListener(e, n), delete t.dataset[s]) : this.off(e, t, n);
      }
    ), this._dataEventHandlers = [];
  }
  /**
   * Called after mounting (after render) - use it to add event listeners
   * @param {boolean} [firstHit=true] - False if it's an update
   */
  mount(t = !0) {
  }
  /**
   * Lifecycle - step : 2
   */
  privateUpdate() {
    this.log && console.log("🔃 update", this.name), this.update(), this.privateUnmount(!0), this.connectedCallback(!1);
  }
  /**
   * Called when component is updated
   */
  update() {
  }
  /**
   * Lifecycle - step : 3
   * @param {boolean} update
   */
  privateUnmount(t = !1) {
    var e;
    if (!t) {
      this._mounted = !1;
      const n = (e = this.piecesManager.currentPieces[this.name]) == null ? void 0 : e[this.cid];
      (n == null ? void 0 : n.piece) === this && this.piecesManager.removePiece({
        name: this.name,
        id: this.cid
      });
    }
    this.privateUnbindEvents(), this.log && console.log("❌ unmount", this.name), this.unmount(t);
  }
  /**
   * Called when component is unmounted - use it to remove event listeners
   * @param {boolean} [update=false] - True if called during an update
   */
  unmount(t = !1) {
  }
  /**
   * default function from native web components
   * @param {string} property
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(t, e, n) {
    e !== n && (this[t] = n, this._mounted && this.privateUpdate());
  }
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(t, e = this) {
    const n = e.querySelectorAll(t);
    return n.length == 1 ? n[0] : n.length == 0 ? null : n;
  }
  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(t, e = this) {
    const n = e.querySelectorAll(t);
    return n.length == 1 ? n[0] : n.length == 0 ? null : n;
  }
  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(t, e = this) {
    const n = e.querySelectorAll(`[data-dom="${t}"]`);
    return n.length == 1 ? n[0] : n.length == 0 ? null : n;
  }
  /**
   * Query selector - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  $All(t, e = this) {
    return Array.from(e.querySelectorAll(t));
  }
  /**
   * Same as $All - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAll(t, e = this) {
    return Array.from(e.querySelectorAll(t));
  }
  /**
   * Query by data-dom attribute - always returns an array
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAttrAll(t, e = this) {
    return Array.from(e.querySelectorAll(`[data-dom="${t}"]`));
  }
  /**
   * Capture all elements with data-dom attribute as object tree
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Object<string, Element[]>}
   */
  captureTree(t = this) {
    const e = t.querySelectorAll("[data-dom]");
    let n = {};
    for (let s of e) {
      const r = s.getAttribute("data-dom");
      typeof n[r] > "u" && (n[r] = []), n[r].push(s);
    }
    return n;
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
  on(t, e, n, s = null) {
    if (e == null) return;
    let r = this._boundListeners.get(n);
    r || (r = { bound: n.bind(this), wrappers: [] }, this._boundListeners.set(n, r));
    const o = d(e) || Array.isArray(e) ? e : [e];
    for (const i of o)
      if (s == null)
        i.addEventListener(t, r.bound);
      else {
        const l = () => r.bound(s);
        i.addEventListener(t, l), r.wrappers.push({ item: i, type: t, wrapper: l });
      }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
   */
  off(t, e, n) {
    if (e == null) return;
    const s = [];
    if (this._boundListeners.has(n))
      s.push(this._boundListeners.get(n));
    else
      for (const [o, i] of this._boundListeners)
        o.name === n.name && (s.push(i), this._boundListeners.delete(o));
    if (s.length == 0) {
      console.warn(`No bound listener found for ${t}_${n.name}`);
      return;
    }
    const r = d(e) || Array.isArray(e) ? Array.from(e) : [e];
    for (const o of s) {
      for (const i of r)
        i.removeEventListener(t, o.bound);
      o.wrappers = o.wrappers.filter(
        ({ item: i, type: l, wrapper: u }) => l !== t || !r.includes(i) ? !0 : (i.removeEventListener(t, u), !1)
      );
    }
  }
  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(t, e = document, n) {
    const s = new CustomEvent(t, {
      detail: n
    });
    e.dispatchEvent(s);
  }
  /**
   * Call function of a piece, from a piece
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(t, e, n, s) {
    const r = (u, h) => Object.prototype.hasOwnProperty.call(u, h), { currentPieces: o } = this.piecesManager;
    if (!r(o, n)) return;
    const i = o[n];
    if (s != null)
      return r(i, s) ? i[s].piece[t](e) : void 0;
    let l;
    for (const u of Object.keys(i)) {
      const h = i[u];
      h && (l = h.piece[t](e));
    }
    return l;
  }
  /**
   * Load stylesheets dynamically from super()
   * @param {boolean} [firstHit=true] - False if called after an update
   * @returns {Promise<void>}
   */
  async loadStyles(t = !0) {
    if (t)
      for (let e = 0; e < this.stylesheets.length; e++)
        await this.stylesheets[e]();
  }
  /**
   * Check if log attribute is present
   * @returns {boolean}
   */
  get log() {
    return typeof this.getAttribute("log") == "string";
  }
  /**
   * Get component ID
   * @returns {string|null}
   */
  get cid() {
    return this.getAttribute("cid");
  }
  /**
   * Set component ID
   * @param {string} cid
   */
  set cid(t) {
    return this.setAttribute("cid", t);
  }
  /**
   * Get all attributes as string
   * @returns {string}
   */
  get properties() {
    return Object.values(this.attributes).map((t) => `${t.name}="${t.value}"`).join(" ");
  }
}
export {
  g as Piece,
  v as load,
  p as piecesManager
};
