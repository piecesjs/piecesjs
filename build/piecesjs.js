const v = async (a, e, t = document) => {
  t.getElementsByTagName(a).length > 0 && await e();
}, d = (a) => {
  var e = Object.prototype.toString.call(a);
  return typeof a == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof a.length == "number" && (a.length === 0 || typeof a[0] == "object" && a[0].nodeType > 0);
};
class f {
  constructor() {
    this.loadedPiecesCount = 0, this.piecesCount = 0, this.currentPieces = {};
  }
  /**
   * Add a piece to the manager
   * @param {{name: string, id: string, piece: import('./Piece').Piece}} piece - Piece data to add
   */
  addPiece(e) {
    typeof this.currentPieces[e.name] != "object" && (this.currentPieces[e.name] = {}), this.currentPieces[e.name][e.id] = e;
  }
  /**
   * Remove a piece from the manager
   * @param {{name: string, id: string}} piece - Piece data to remove
   */
  removePiece(e) {
    var t;
    (t = this.currentPieces[e.name]) == null || delete t[e.id];
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
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = p, this.stylesheets = t, this.stylesReady = Promise.resolve(), this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map(), this._dataEventHandlers = [], this._mounted = !1;
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(e = !0) {
    if (e && (typeof this.cid != "string" && (this.cid = `c${this.updatedPiecesCount}`), this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(e), this.baseHTML == null) {
      this.innerHTML = "";
      const t = this.render();
      this.template.innerHTML = t ?? "", this.appendChild(this.template.cloneNode(!0).content);
    }
    this.privateMount(e);
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
  privatePremount(e = !0) {
    this.baseHTML == null && (this.innerHTML = ""), this.log && console.log("🚧 premount", this.name);
    const t = this.loadStyles(e);
    e && (this.stylesReady = t), this.premount(e);
  }
  /**
   * Called before mounting (before render)
   * @param {boolean} [firstHit=true] - False if it's an update
   */
  premount(e = !0) {
  }
  /**
   * Lifecycle - step : 1
   * @param {boolean} firstHit - false if it's an update
   */
  privateMount(e) {
    this.log && console.log("✅ mount", this.name), e && this.piecesManager.loadedPiecesCount++, this._mounted = !0, this.privateBindEvents(), this.mount(e);
  }
  /**
   * Bind data-events-* attributes of the piece and its descendants
   */
  privateBindEvents() {
    const e = document.evaluate(
      "descendant-or-self::*[@*[starts-with(name(), 'data-events-')]]",
      this,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    this.domEventsElements = [];
    for (let t = 0; t < e.snapshotLength; t++) {
      const s = e.snapshotItem(t);
      this.domEventsElements.push(s);
      for (const n of s.attributes) {
        if (!n.name.startsWith("data-events-")) continue;
        const r = n.name.slice(12), o = n.value.split(",");
        if (o.length == 1) {
          const i = this[n.value];
          typeof i == "function" && (this.on(r, s, i), this._dataEventHandlers.push({ element: s, eventName: r, handler: i }));
        } else {
          const i = `eventInit${r}`;
          if (s.dataset[i] == null) {
            const [l, u, h] = o;
            s.dataset[i] = !0;
            const c = (m) => this.call(l, m, u, h);
            s.addEventListener(r, c), this._dataEventHandlers.push({
              element: s,
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
      ({ element: e, eventName: t, handler: s, eventInitKey: n }) => {
        n ? (e.removeEventListener(t, s), delete e.dataset[n]) : this.off(t, e, s);
      }
    ), this._dataEventHandlers = [];
  }
  /**
   * Called after mounting (after render) - use it to add event listeners
   * @param {boolean} [firstHit=true] - False if it's an update
   */
  mount(e = !0) {
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
  privateUnmount(e = !1) {
    var t;
    if (!e) {
      this._mounted = !1;
      const s = (t = this.piecesManager.currentPieces[this.name]) == null ? void 0 : t[this.cid];
      (s == null ? void 0 : s.piece) === this && this.piecesManager.removePiece({
        name: this.name,
        id: this.cid
      });
    }
    this.privateUnbindEvents(), this.log && console.log("❌ unmount", this.name), this.unmount(e);
  }
  /**
   * Called when component is unmounted - use it to remove event listeners
   * @param {boolean} [update=false] - True if called during an update
   */
  unmount(e = !1) {
  }
  /**
   * default function from native web components
   * @param {string} property
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(e, t, s) {
    t !== s && (this[e] = s, this._mounted && this.privateUpdate());
  }
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(e, t = this) {
    const s = t.querySelectorAll(e);
    return s.length == 1 ? s[0] : s.length == 0 ? null : s;
  }
  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(e, t = this) {
    const s = t.querySelectorAll(e);
    return s.length == 1 ? s[0] : s.length == 0 ? null : s;
  }
  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(e, t = this) {
    const s = t.querySelectorAll(`[data-dom="${e}"]`);
    return s.length == 1 ? s[0] : s.length == 0 ? null : s;
  }
  /**
   * Query selector - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  $All(e, t = this) {
    return Array.from(t.querySelectorAll(e));
  }
  /**
   * Same as $All - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAll(e, t = this) {
    return Array.from(t.querySelectorAll(e));
  }
  /**
   * Query by data-dom attribute - always returns an array
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAttrAll(e, t = this) {
    return Array.from(t.querySelectorAll(`[data-dom="${e}"]`));
  }
  /**
   * Capture all elements with data-dom attribute as object tree
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Object<string, Element[]>}
   */
  captureTree(e = this) {
    const t = e.querySelectorAll("[data-dom]");
    let s = {};
    for (let n of t) {
      const r = n.getAttribute("data-dom");
      typeof s[r] > "u" && (s[r] = []), s[r].push(n);
    }
    return s;
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
  on(e, t, s, n = null) {
    if (t == null) return;
    let r = this._boundListeners.get(s);
    r || (r = { bound: s.bind(this), wrappers: [] }, this._boundListeners.set(s, r));
    const o = d(t) || Array.isArray(t) ? t : [t];
    for (const i of o)
      if (n == null)
        i.addEventListener(e, r.bound);
      else {
        const l = () => r.bound(n);
        i.addEventListener(e, l), r.wrappers.push({ item: i, type: e, wrapper: l });
      }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
   */
  off(e, t, s) {
    if (t == null) return;
    const n = [];
    if (this._boundListeners.has(s))
      n.push(this._boundListeners.get(s));
    else
      for (const [o, i] of this._boundListeners)
        o.name === s.name && (n.push(i), this._boundListeners.delete(o));
    if (n.length == 0) {
      console.warn(`No bound listener found for ${e}_${s.name}`);
      return;
    }
    const r = d(t) || Array.isArray(t) ? Array.from(t) : [t];
    for (const o of n) {
      for (const i of r)
        i.removeEventListener(e, o.bound);
      o.wrappers = o.wrappers.filter(
        ({ item: i, type: l, wrapper: u }) => l !== e || !r.includes(i) ? !0 : (i.removeEventListener(e, u), !1)
      );
    }
  }
  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(e, t = document, s) {
    const n = new CustomEvent(e, {
      detail: s
    });
    t.dispatchEvent(n);
  }
  /**
   * Call function of a piece, from a piece
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(e, t, s, n) {
    const r = (u, h) => Object.prototype.hasOwnProperty.call(u, h), { currentPieces: o } = this.piecesManager;
    if (!r(o, s)) return;
    const i = o[s];
    if (n != null)
      return r(i, n) ? i[n].piece[e](t) : void 0;
    let l;
    for (const u of Object.keys(i)) {
      const h = i[u];
      h && (l = h.piece[e](t));
    }
    return l;
  }
  /**
   * Load stylesheets dynamically from super()
   * @param {boolean} [firstHit=true] - False if called after an update
   * @returns {Promise<void>}
   */
  async loadStyles(e = !0) {
    if (e)
      for (let t = 0; t < this.stylesheets.length; t++)
        await this.stylesheets[t]();
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
  set cid(e) {
    return this.setAttribute("cid", e);
  }
  /**
   * Get all attributes as string
   * @returns {string}
   */
  get properties() {
    return Object.values(this.attributes).map((e) => `${e.name}="${e.value}"`).join(" ");
  }
}
export {
  g as Piece,
  v as load,
  p as piecesManager
};
