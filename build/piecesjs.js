const v = async (o, e, s = document) => {
  s.getElementsByTagName(o).length > 0 && await e();
}, u = (o) => {
  var e = Object.prototype.toString.call(o);
  return typeof o == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof o.length == "number" && (o.length === 0 || typeof o[0] == "object" && o[0].nodeType > 0);
};
class p {
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
    delete this.currentPieces[e.name][e.id];
  }
}
let g = new p();
class b extends HTMLElement {
  /**
   * Creates a new Piece component
   * @param {string} [name] - Component name (defaults to class name if not provided)
   * @param {{stylesheets?: Array<() => Promise<any>>}} [options={}] - Configuration options
   * @param {Array<() => Promise<any>>} [options.stylesheets=[]] - Array of dynamic stylesheet import functions
   */
  constructor(e, { stylesheets: s = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = g, this.stylesheets = s, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map(), this._dataEventHandlers = [];
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(e = !0) {
    e && (typeof this.cid == "string" ? this.cid = this.cid : this.cid = `c${this.updatedPiecesCount}`, this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(e), this.baseHTML == null && (this.innerHTML = "", this.template.innerHTML = this.render() != null ? this.render() : "", this.appendChild(this.template.cloneNode(!0).content)), this.privateMount(e);
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
    this.baseHTML == null && (this.innerHTML = ""), this.log && console.log("🚧 premount", this.name), this.loadStyles(e), this.premount(e);
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
    if (this.log && console.log("✅ mount", this.name), e) {
      this.piecesManager.loadedPiecesCount++, this.domEventsElements = Array.from(this.querySelectorAll("*")).filter(
        (t) => {
          const n = t.attributes;
          for (let i = 0; i < n.length; i++)
            if (n[i].name.startsWith("data-events-"))
              return !0;
          return !1;
        }
      );
      const s = this.attributes;
      for (let t = 0; t < s.length; t++)
        s[t].name.startsWith("data-events-") && this.domEventsElements.push(this);
      this.domEventsElements && this.domEventsElements.forEach((t) => {
        let n = t.attributes;
        for (let i = 0; i < n.length; i++)
          if (n[i].name.startsWith("data-events-")) {
            const r = n[i].name.replace("data-events-", "");
            let a = n[i].value;
            const l = n[i].value.split(",");
            if (l.length == 1)
              typeof this[a] == "function" && this.on(r, t, this[a]);
            else {
              const c = `eventInit${r}`;
              if (l.length >= 2 && t.dataset[c] == null) {
                a = l[0];
                const d = l[1], f = l[2];
                t.dataset[c] = !0;
                const h = (m) => this.call(a, m, d, f);
                t.addEventListener(r, h), this._dataEventHandlers.push({ element: t, eventName: r, handler: h });
              }
            }
          }
      });
    }
    this.mount(e);
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
    e || (this.piecesManager.removePiece({
      name: this.name,
      id: this.cid
    }), this.domEventsElements && this.domEventsElements.forEach((s) => {
      let t = s.attributes;
      for (let n = 0; n < t.length; n++)
        if (t[n].name.startsWith("data-events-")) {
          const i = t[n].name.replace("data-events-", ""), r = t[n].value;
          t[n].value.split(",").length == 1 && typeof this[r] == "function" && this.off(i, s, this[r]);
        }
    }), this._dataEventHandlers.forEach(({ element: s, eventName: t, handler: n }) => {
      s.removeEventListener(t, n);
    }), this._dataEventHandlers = []), this.log && console.log("❌ unmount", this.name), this.unmount(e);
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
  attributeChangedCallback(e, s, t) {
    s !== t && (this[e] = t, this.privateUpdate());
  }
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(e, s = this) {
    const t = s.querySelectorAll(e);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(e, s = this) {
    const t = s.querySelectorAll(e);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(e, s = this) {
    const t = s.querySelectorAll(`[data-dom="${e}"]`);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  /**
   * Query selector - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  $All(e, s = this) {
    return Array.from(s.querySelectorAll(e));
  }
  /**
   * Same as $All - always returns an array
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAll(e, s = this) {
    return Array.from(s.querySelectorAll(e));
  }
  /**
   * Query by data-dom attribute - always returns an array
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element[]}
   */
  domAttrAll(e, s = this) {
    return Array.from(s.querySelectorAll(`[data-dom="${e}"]`));
  }
  /**
   * Capture all elements with data-dom attribute as object tree
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Object<string, Element[]>}
   */
  captureTree(e = this) {
    const s = this.querySelectorAll("[data-dom]");
    let t = {};
    for (let n of s) {
      const i = n.getAttribute("data-dom");
      typeof t[i] > "u" && (t[i] = []), t[i].push(n);
    }
    return t;
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
  on(e, s, t, n = null) {
    if (s != null) {
      const i = `${e}_${t.name}`;
      if (!this._boundListeners.has(i)) {
        const a = t.bind(this);
        this._boundListeners.set(i, {
          original: t,
          bound: a
        });
      }
      const r = this._boundListeners.get(i).bound;
      u(s) || Array.isArray(s) ? s.length > 0 && s.forEach((a) => {
        n == null ? a.addEventListener(e, r) : a.addEventListener(e, () => r(n));
      }) : n == null ? s.addEventListener(e, r) : s.addEventListener(e, () => r(n));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
   */
  off(e, s, t) {
    if (s != null) {
      const n = `${e}_${t.name}`, i = this._boundListeners.get(n);
      if (!i) {
        console.warn(`No bound listener found for ${n}`);
        return;
      }
      const r = i.bound;
      u(s) || Array.isArray(s) ? s.length > 0 && s.forEach((a) => {
        a.removeEventListener(e, r);
      }) : s.removeEventListener(e, r), this._boundListeners.delete(n);
    }
  }
  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(e, s = document, t) {
    const n = new CustomEvent(e, {
      detail: t
    });
    s.dispatchEvent(n);
  }
  /**
   * Call function of a piece, from a piece
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(e, s, t, n) {
    let i;
    return Object.keys(this.piecesManager.currentPieces).forEach((r) => {
      r == t && Object.keys(this.piecesManager.currentPieces[r]).forEach((a) => {
        n != null ? a == n && (i = this.piecesManager.currentPieces[r][a].piece[e](s)) : i = this.piecesManager.currentPieces[r][a].piece[e](s);
      });
    }), i;
  }
  /**
   * Load stylesheets dynamically from super()
   * @param {boolean} [firstHit=true] - False if called after an update
   * @returns {Promise<void>}
   */
  async loadStyles(e = !0) {
    if (e)
      for (let s = 0; s < this.stylesheets.length; s++)
        await this.stylesheets[s]();
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
  b as Piece,
  v as load,
  g as piecesManager
};
