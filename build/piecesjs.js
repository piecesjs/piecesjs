const g = async (o, e, t = document) => {
  t.getElementsByTagName(o).length > 0 && await e();
}, h = (o) => {
  var e = Object.prototype.toString.call(o);
  return typeof o == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof o.length == "number" && (o.length === 0 || typeof o[0] == "object" && o[0].nodeType > 0);
};
class m {
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
let p = new m();
class b extends HTMLElement {
  /**
   * Creates a new Piece component
   * @param {string} [name] - Component name (defaults to class name if not provided)
   * @param {{stylesheets?: Array<() => Promise<any>>}} [options={}] - Configuration options
   * @param {Array<() => Promise<any>>} [options.stylesheets=[]] - Array of dynamic stylesheet import functions
   */
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = p, this.stylesheets = t, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map();
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
        (i) => {
          const s = i.attributes;
          for (let n = 0; n < s.length; n++)
            if (s[n].name.startsWith("data-events-"))
              return !0;
          return !1;
        }
      );
      const t = this.attributes;
      for (let i = 0; i < t.length; i++)
        t[i].name.startsWith("data-events-") && this.domEventsElements.push(this);
      this.domEventsElements && this.domEventsElements.forEach((i) => {
        let s = i.attributes;
        for (let n = 0; n < s.length; n++)
          if (s[n].name.startsWith("data-events-")) {
            const r = s[n].name.replace("data-events-", "");
            let a = s[n].value;
            const l = s[n].value.split(",");
            if (l.length == 1)
              typeof this[a] == "function" && this.on(r, i, this[a]);
            else {
              const c = `eventInit${r}`;
              if (l.length >= 2 && i.dataset[c] == null) {
                console.log("eventInitKey", c), console.log("params", l), a = l[0];
                const u = l[1], d = l[2];
                i.dataset[c] = !0, this.on(r, i, (f) => {
                  this.call(a, f, u, d);
                });
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
    }), this.domEventsElements && this.domEventsElements.forEach((t) => {
      let i = t.attributes;
      for (let s = 0; s < i.length; s++)
        if (i[s].name.startsWith("data-events-")) {
          const n = i[s].name.replace("data-events-", "");
          let r = i[s].value;
          const a = i[s].value.split(",");
          if (a.length == 1)
            typeof this[r] == "function" && this.off(n, t, this[r]);
          else if (a.length >= 2 && t.dataset.eventInit == null) {
            r = a[0];
            const l = a[1], c = a[2];
            t.dataset.eventInit = !0, this.off(n, t, () => {
              this.call(r, t, l, c);
            });
          }
        }
    })), this.log && console.log("❌ unmount", this.name), this.unmount(e);
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
  attributeChangedCallback(e, t, i) {
    t !== i && (this[e] = i, this.privateUpdate());
  }
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  $(e, t = this) {
    const i = t.querySelectorAll(e);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  /**
   * Same as $ - query selector shortcut
   * @param {string} query - CSS selector
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  dom(e, t = this) {
    const i = t.querySelectorAll(e);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  /**
   * Query by data-dom attribute
   * @param {string} query - Value of data-dom attribute
   * @param {Element} [context=this] - Context element, this by default
   * @returns {Element|NodeList|null}
   */
  domAttr(e, t = this) {
    const i = t.querySelectorAll(`[data-dom="${e}"]`);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
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
    const t = this.querySelectorAll("[data-dom]");
    let i = {};
    for (let s of t) {
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
  on(e, t, i, s = null) {
    if (t != null) {
      const n = `${e}_${i.name}`;
      if (!this._boundListeners.has(n)) {
        const a = i.bind(this);
        this._boundListeners.set(n, {
          original: i,
          bound: a
        });
      }
      const r = this._boundListeners.get(n).bound;
      h(t) || Array.isArray(t) ? t.length > 0 && t.forEach((a) => {
        s == null ? a.addEventListener(e, r) : a.addEventListener(e, () => r(s));
      }) : s == null ? t.addEventListener(e, r) : t.addEventListener(e, () => r(s));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param {string} type
   * @param {HTMLElement} el
   * @param {Function} func
   */
  off(e, t, i) {
    if (t != null) {
      const s = `${e}_${i.name}`, n = this._boundListeners.get(s);
      if (!n) {
        console.warn(`No bound listener found for ${s}`);
        return;
      }
      const r = n.bound;
      h(t) || Array.isArray(t) ? t.length > 0 && t.forEach((a) => {
        a.removeEventListener(e, r);
      }) : t.removeEventListener(e, r), this._boundListeners.delete(s);
    }
  }
  /**
   * Emit a custom event
   * @param {string} eventName
   * @param {HTMLElement} el - by default the event is emit on document
   * @param {Object} params
   */
  emit(e, t = document, i) {
    const s = new CustomEvent(e, {
      detail: i
    });
    t.dispatchEvent(s);
  }
  /**
   * Call function of a piece, from a piece
   * @param {string} func
   * @param {Object} args
   * @param {string} pieceName
   * @param {string} pieceId
   * @returns {any} The return value of the called function
   */
  call(e, t, i, s) {
    let n;
    return Object.keys(this.piecesManager.currentPieces).forEach((r) => {
      r == i && Object.keys(this.piecesManager.currentPieces[r]).forEach((a) => {
        s != null ? a == s && (n = this.piecesManager.currentPieces[r][a].piece[e](t)) : n = this.piecesManager.currentPieces[r][a].piece[e](t);
      });
    }), n;
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
  b as Piece,
  g as load,
  p as piecesManager
};
