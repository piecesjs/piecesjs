const u = async (a, e, t = document) => {
  t.getElementsByTagName(a).length > 0 && await e();
}, l = (a) => {
  var e = Object.prototype.toString.call(a);
  return typeof a == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof a.length == "number" && (a.length === 0 || typeof a[0] == "object" && a[0].nodeType > 0);
};
class c {
  constructor() {
    this.loadedPiecesCount = 0, this.piecesCount = 0, this.currentPieces = {}, this.domClickElements = [];
  }
  addPiece(e) {
    typeof this.currentPieces[e.name] != "object" && (this.currentPieces[e.name] = {}), this.currentPieces[e.name][e.id] = e;
  }
  removePiece(e) {
    delete this.currentPieces[e.name][e.id];
  }
}
let h = new c();
class d extends HTMLElement {
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = h, this.stylesheets = t, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map();
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
   * Function to render HTML in the component. If component is not emtpy, the rendering is not called
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
            const r = s[n].name.replace("data-events-", ""), o = s[n].value;
            typeof this[o] == "function" && this.on(r, i, this[o]);
          }
      });
    }
    this.mount(e);
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
    e || (this.piecesManager.removePiece({
      name: this.name,
      id: this.cid
    }), this.domEventsElements && this.domEventsElements.forEach((t) => {
      let i = t.attributes;
      for (let s = 0; s < i.length; s++)
        if (i[s].name.startsWith("data-events-")) {
          const n = i[s].name.replace("data-events-", ""), r = i[s].value;
          typeof this[r] == "function" && this.off(n, t, this[r]);
        }
    })), this.log && console.log("❌ unmount", this.name), this.unmount(e);
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
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  dom(e, t = this) {
    const i = t.querySelectorAll(e);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  // To capture element using data-attribute <div data-dom='query'></div>
  domAttr(e, t = this) {
    const i = t.querySelectorAll(`[data-dom="${e}"]`);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  $All(e, t = this) {
    return Array.from(t.querySelectorAll(e));
  }
  domAll(e, t = this) {
    return Array.from(t.querySelectorAll(e));
  }
  domAttrAll(e, t = this) {
    return Array.from(t.querySelectorAll(`[data-dom="${e}"]`));
  }
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
   * @param { String } type
   * @param { HTMLElement or HTMLElement[] } el
   * @param { function } func
   * @param { Object } params
   */
  on(e, t, i, s = null) {
    if (t != null) {
      const n = `${e}_${i.name}`;
      if (!this._boundListeners.has(n)) {
        const o = i.bind(this);
        this._boundListeners.set(n, {
          original: i,
          bound: o
        });
      }
      const r = this._boundListeners.get(n).bound;
      l(t) || Array.isArray(t) ? t.length > 0 && t.forEach((o) => {
        s == null ? o.addEventListener(e, r) : o.addEventListener(e, () => r(s));
      }) : s == null ? t.addEventListener(e, r) : t.addEventListener(e, () => r(s));
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
      const s = `${e}_${i.name}`, n = this._boundListeners.get(s);
      if (!n) {
        console.warn(`No bound listener found for ${s}`);
        return;
      }
      const r = n.bound;
      l(t) || Array.isArray(t) ? t.length > 0 && t.forEach((o) => {
        o.removeEventListener(e, r);
      }) : t.removeEventListener(e, r), this._boundListeners.delete(s);
    }
  }
  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el, by default the event is emit on document
   * @param { Object } params
   */
  emit(e, t = document, i) {
    const s = new CustomEvent(e, {
      detail: i
    });
    t.dispatchEvent(s);
  }
  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(e, t, i, s) {
    Object.keys(this.piecesManager.currentPieces).forEach((n) => {
      n == i && Object.keys(this.piecesManager.currentPieces[n]).forEach((r) => {
        s != null ? r == s && this.piecesManager.currentPieces[n][r].piece[e](t) : this.piecesManager.currentPieces[n][r].piece[e](t);
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
  u as load,
  h as piecesManager
};
