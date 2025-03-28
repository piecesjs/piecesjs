const l = async (o, e, t = document) => {
  t.getElementsByTagName(o).length > 0 && await e();
}, a = (o) => {
  var e = Object.prototype.toString.call(o);
  return typeof o == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof o.length == "number" && (o.length === 0 || typeof o[0] == "object" && o[0].nodeType > 0);
};
class u {
  constructor() {
    this.piecesCount = 0, this.currentPieces = {};
  }
  addPiece(e) {
    typeof this.currentPieces[e.name] != "object" && (this.currentPieces[e.name] = {}), this.currentPieces[e.name][e.id] = e;
  }
  removePiece(e) {
    delete this.currentPieces[e.name][e.id];
  }
}
let h = new u();
class d extends HTMLElement {
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = h, this.stylesheets = t, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map();
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(e = !0) {
    e && (typeof this.cid == "string" ? this.cid = this.cid : this.cid = `c${this.piecesManager.piecesCount++}`, this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(e), this.baseHTML == null && (this.innerHTML = "", this.template.innerHTML = this.render() != null ? this.render() : "", this.appendChild(this.template.cloneNode(!0).content)), this.privateMount(e);
  }
  /**
   * Function to render HTML in component. If component is not emtpy, the rendering is not called
   */
  render() {
    if (this.baseHTML != null)
      return this.baseHTML;
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
  adoptedCallback() {
  }
  /**
   * Lifecycle - step : 0
   * @param { firstHit } boolean (false if it's an update)
   */
  privatePremount(e = !0) {
    this.baseHTML == null && (this.innerHTML = ""), this.log && console.log("🚧 premount", this.name), this.loadStyles(e), this.premount(e);
  }
  /**
   * Satelite function for premount
   */
  premount(e = !0) {
  }
  /**
   * Lifecycle - step : 1
   * @param { firstHit } boolean (false if it's an update)
   */
  privateMount(e) {
    this.log && console.log("✅ mount", this.name), this.mount(e);
  }
  /**
   * Satelite function for mount
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
   * Satelite function for update
   */
  update() {
  }
  /**
   * Lifecycle - step : 3
   * @param { update } boolean
   */
  privateUnmount(e = !1) {
    e || this.piecesManager.removePiece({
      name: this.name,
      id: this.cid
    }), this.log && console.log("❌ unmount", this.name), this.unmount(e);
  }
  /**
   * Satelite function for unmount
   */
  unmount(e = !1) {
  }
  /**
   * default function from native web components
   * @param { String } property
   * @param { String } oldValue
   * @param { String } newValue
   */
  attributeChangedCallback(e, t, i) {
    t !== i && (this[e] = i, this.privateUpdate());
  }
  /**
   * @param { String } query
   * @param { HTMLElement } context
   */
  $(e, t = this) {
    const i = t.querySelectorAll(e);
    return i.length == 1 ? i[0] : i;
  }
  dom(e, t = this) {
    const i = t.querySelectorAll(e);
    return i.length == 1 ? i[0] : i;
  }
  // To capture element using data-attribute <div data-dom='query'></div>
  domAttr(e, t = this) {
    const i = t.querySelectorAll(`[data-dom="${e}"]`);
    return i.length == 1 ? i[0] : i;
  }
  captureTree(e = this) {
    const t = this.querySelectorAll("[data-dom]");
    let i = {};
    for (let n of t) {
      const s = n.getAttribute("data-dom");
      typeof i[s] > "u" && (i[s] = []), i[s].push(n);
    }
    return i;
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
  on(e, t, i, n = null) {
    if (t != null) {
      const s = `${e}_${i.name}`;
      if (!this._boundListeners.has(s)) {
        const c = i.bind(this);
        this._boundListeners.set(s, {
          original: i,
          bound: c
        });
      }
      const r = this._boundListeners.get(s).bound;
      a(t) ? t.length > 0 && t.forEach((c) => {
        n == null ? c.addEventListener(e, r) : c.addEventListener(e, () => r(n));
      }) : n == null ? t.addEventListener(e, r) : t.addEventListener(e, () => r(n));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement } el
   * @param { function } func
   */
  off(e, t, i) {
    if (t != null) {
      const n = `${e}_${i.name}`, s = this._boundListeners.get(n);
      if (!s) {
        console.warn(`No bound listener found for ${n}`);
        return;
      }
      const r = s.bound;
      a(t) ? t.length > 0 && t.forEach((c) => {
        c.removeEventListener(e, r);
      }) : t.removeEventListener(e, r), this._boundListeners.delete(n);
    }
  }
  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el, by default the event is emit on document
   * @param { Object } params
   */
  emit(e, t = document, i) {
    const n = new CustomEvent(e, {
      detail: i
    });
    t.dispatchEvent(n);
  }
  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(e, t, i, n) {
    Object.keys(this.piecesManager.currentPieces).forEach((s) => {
      s == i && Object.keys(this.piecesManager.currentPieces[s]).forEach((r) => {
        n != null ? r == n && this.piecesManager.currentPieces[s][r].piece[e](t) : this.piecesManager.currentPieces[s][r].piece[e](t);
      });
    });
  }
  /**
   * Dynamic loading of stylesheets from super()
   */
  async loadStyles(e = !0) {
    if (e)
      for (let t = 0; t < this.stylesheets.length; t++)
        await this.stylesheets[t]();
  }
  get log() {
    return typeof this.getAttribute("log") == "string";
  }
  get cid() {
    return this.getAttribute("cid");
  }
  set cid(e) {
    return this.setAttribute("cid", e);
  }
  get properties() {
    return Object.values(this.attributes).map((e) => `${e.name}="${e.value}"`).join(" ");
  }
}
export {
  d as Piece,
  l as load,
  h as piecesManager
};
