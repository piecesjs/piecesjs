const m = async (o, t, e = document) => {
  e.getElementsByTagName(o).length > 0 && await t();
}, h = (o) => {
  var t = Object.prototype.toString.call(o);
  return typeof o == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(t) && typeof o.length == "number" && (o.length === 0 || typeof o[0] == "object" && o[0].nodeType > 0);
};
class d {
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
    delete this.currentPieces[t.name][t.id];
  }
}
let f = new d();
class p extends HTMLElement {
  /**
   * Creates a new Piece component
   * @param {string} [name] - Component name (defaults to class name if not provided)
   * @param {{stylesheets?: Array<() => Promise<any>>}} [options={}] - Configuration options
   * @param {Array<() => Promise<any>>} [options.stylesheets=[]] - Array of dynamic stylesheet import functions
   */
  constructor(t, { stylesheets: e = [] } = {}) {
    super(), this.name = t || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = f, this.stylesheets = e, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map();
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(t = !0) {
    t && (typeof this.cid == "string" ? this.cid = this.cid : this.cid = `c${this.updatedPiecesCount}`, this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(t), this.baseHTML == null && (this.innerHTML = "", this.template.innerHTML = this.render() != null ? this.render() : "", this.appendChild(this.template.cloneNode(!0).content)), this.privateMount(t);
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
    if (this.log && console.log("✅ mount", this.name), t) {
      this.piecesManager.loadedPiecesCount++, this.domEventsElements = Array.from(this.querySelectorAll("*")).filter(
        (i) => {
          const s = i.attributes;
          for (let n = 0; n < s.length; n++)
            if (s[n].name.startsWith("data-events-"))
              return !0;
          return !1;
        }
      );
      const e = this.attributes;
      for (let i = 0; i < e.length; i++)
        e[i].name.startsWith("data-events-") && this.domEventsElements.push(this);
      this.domEventsElements && this.domEventsElements.forEach((i) => {
        let s = i.attributes;
        for (let n = 0; n < s.length; n++)
          if (s[n].name.startsWith("data-events-")) {
            const a = s[n].name.replace("data-events-", "");
            let r = s[n].value;
            const l = s[n].value.split(",");
            if (l.length == 1)
              typeof this[r] == "function" && this.on(a, i, this[r]);
            else if (l.length >= 2 && i.dataset.eventInit == null) {
              r = l[0];
              const c = l[1], u = l[2];
              i.dataset.eventInit = !0, this.on(a, i, () => {
                this.call(r, i, c, u);
              });
            }
          }
      });
    }
    this.mount(t);
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
    t || (this.piecesManager.removePiece({
      name: this.name,
      id: this.cid
    }), this.domEventsElements && this.domEventsElements.forEach((e) => {
      let i = e.attributes;
      for (let s = 0; s < i.length; s++)
        if (i[s].name.startsWith("data-events-")) {
          const n = i[s].name.replace("data-events-", "");
          let a = i[s].value;
          const r = i[s].value.split(",");
          if (r.length == 1)
            typeof this[a] == "function" && this.off(n, e, this[a]);
          else if (r.length >= 2 && e.dataset.eventInit == null) {
            a = r[0];
            const l = r[1], c = r[2];
            e.dataset.eventInit = !0, this.off(n, e, () => {
              this.call(a, e, l, c);
            });
          }
        }
    })), this.log && console.log("❌ unmount", this.name), this.unmount(t);
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
  attributeChangedCallback(t, e, i) {
    e !== i && (this[t] = i, this.privateUpdate());
  }
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(t, e = this) {
    const i = e.querySelectorAll(t);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(t, e = this) {
    const i = e.querySelectorAll(t);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(t, e = this) {
    const i = e.querySelectorAll(`[data-dom="${t}"]`);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
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
    const e = this.querySelectorAll("[data-dom]");
    let i = {};
    for (let s of e) {
      const n = s.getAttribute("data-dom");
      typeof i[n] > "u" && (i[n] = []), i[n].push(s);
    }
    return i;
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
  on(t, e, i, s = null) {
    if (e != null) {
      const n = `${t}_${i.name}`;
      if (!this._boundListeners.has(n)) {
        const r = i.bind(this);
        this._boundListeners.set(n, {
          original: i,
          bound: r
        });
      }
      const a = this._boundListeners.get(n).bound;
      h(e) || Array.isArray(e) ? e.length > 0 && e.forEach((r) => {
        s == null ? r.addEventListener(t, a) : r.addEventListener(t, () => a(s));
      }) : s == null ? e.addEventListener(t, a) : e.addEventListener(t, () => a(s));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
   */
  off(t, e, i) {
    if (e != null) {
      const s = `${t}_${i.name}`, n = this._boundListeners.get(s);
      if (!n) {
        console.warn(`No bound listener found for ${s}`);
        return;
      }
      const a = n.bound;
      h(e) || Array.isArray(e) ? e.length > 0 && e.forEach((r) => {
        r.removeEventListener(t, a);
      }) : e.removeEventListener(t, a), this._boundListeners.delete(s);
    }
  }
  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(t, e = document, i) {
    const s = new CustomEvent(t, {
      detail: i
    });
    e.dispatchEvent(s);
  }
  /**
   * Call function of a component, from a component
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(t, e, i, s) {
    let n;
    return Object.keys(this.piecesManager.currentPieces).forEach((a) => {
      a == i && Object.keys(this.piecesManager.currentPieces[a]).forEach((r) => {
        s != null ? r == s && (n = this.piecesManager.currentPieces[a][r].piece[t](e)) : n = this.piecesManager.currentPieces[a][r].piece[t](e);
      });
    }), n;
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
  p as Piece,
  m as load,
  f as piecesManager
};
