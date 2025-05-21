const u = async (a, e, i = document) => {
  i.getElementsByTagName(a).length > 0 && await e();
}, c = (a) => {
  var e = Object.prototype.toString.call(a);
  return typeof a == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof a.length == "number" && (a.length === 0 || typeof a[0] == "object" && a[0].nodeType > 0);
};
class l {
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
let h = new l();
class d extends HTMLElement {
  constructor(e, { stylesheets: i = [] } = {}) {
    super(), this.name = e || this.constructor.name, this.template = document.createElement("template"), this.piecesManager = h, this.stylesheets = i, this.updatedPiecesCount = this.piecesManager.piecesCount++, this.innerHTML != "" && (this.baseHTML = this.innerHTML), this._boundListeners = /* @__PURE__ */ new Map();
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
    if (this.log && console.log("✅ mount", this.name), e) {
      this.piecesManager.loadedPiecesCount++, this.domEventsElements = Array.from(this.querySelectorAll("*")).filter(
        (t) => {
          const s = t.attributes;
          for (let n = 0; n < s.length; n++)
            if (s[n].name.startsWith("data-events-"))
              return !0;
          return !1;
        }
      );
      const i = this.attributes;
      for (let t = 0; t < i.length; t++)
        i[t].name.startsWith("data-events-") && this.domEventsElements.push(this);
      this.domEventsElements && this.domEventsElements.forEach((t) => {
        let s = t.attributes;
        for (let n = 0; n < s.length; n++)
          if (s[n].name.startsWith("data-events-")) {
            const r = s[n].name.replace("data-events-", ""), o = s[n].value;
            console.log(r, o), typeof this[o] == "function" && this.on(r, t, this[o]);
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
    }), this.domEventsElements && this.domEventsElements.forEach((i) => {
      let t = i.attributes;
      for (let s = 0; s < t.length; s++)
        if (t[s].name.startsWith("data-events-")) {
          const n = t[s].name.replace("data-events-", ""), r = t[s].value;
          console.log(n, r), typeof this[r] == "function" && this.off(n, i, this[r]);
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
  attributeChangedCallback(e, i, t) {
    i !== t && (this[e] = t, this.privateUpdate());
  }
  /**
   * @param { String } query
   * @param { HTMLElement } context
   */
  $(e, i = this) {
    const t = i.querySelectorAll(e);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  dom(e, i = this) {
    const t = i.querySelectorAll(e);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  // To capture element using data-attribute <div data-dom='query'></div>
  domAttr(e, i = this) {
    const t = i.querySelectorAll(`[data-dom="${e}"]`);
    return t.length == 1 ? t[0] : t.length == 0 ? null : t;
  }
  captureTree(e = this) {
    const i = this.querySelectorAll("[data-dom]");
    let t = {};
    for (let s of i) {
      const n = s.getAttribute("data-dom");
      typeof t[n] > "u" && (t[n] = []), t[n].push(s);
    }
    return t;
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
  on(e, i, t, s = null) {
    if (i != null) {
      const n = `${e}_${t.name}`;
      if (!this._boundListeners.has(n)) {
        const o = t.bind(this);
        this._boundListeners.set(n, {
          original: t,
          bound: o
        });
      }
      const r = this._boundListeners.get(n).bound;
      c(i) || Array.isArray(i) ? i.length > 0 && i.forEach((o) => {
        s == null ? o.addEventListener(e, r) : o.addEventListener(e, () => r(s));
      }) : s == null ? i.addEventListener(e, r) : i.addEventListener(e, () => r(s));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement } el
   * @param { function } func
   */
  off(e, i, t) {
    if (i != null) {
      const s = `${e}_${t.name}`, n = this._boundListeners.get(s);
      if (!n) {
        console.warn(`No bound listener found for ${s}`);
        return;
      }
      const r = n.bound;
      c(i) || Array.isArray(i) ? i.length > 0 && i.forEach((o) => {
        o.removeEventListener(e, r);
      }) : i.removeEventListener(e, r), this._boundListeners.delete(s);
    }
  }
  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el, by default the event is emit on document
   * @param { Object } params
   */
  emit(e, i = document, t) {
    const s = new CustomEvent(e, {
      detail: t
    });
    i.dispatchEvent(s);
  }
  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(e, i, t, s) {
    Object.keys(this.piecesManager.currentPieces).forEach((n) => {
      n == t && Object.keys(this.piecesManager.currentPieces[n]).forEach((r) => {
        s != null ? r == s && this.piecesManager.currentPieces[n][r].piece[e](i) : this.piecesManager.currentPieces[n][r].piece[e](i);
      });
    });
  }
  /**
   * Dynamic loading of stylesheets from super()
   */
  async loadStyles(e = !0) {
    if (e)
      for (let i = 0; i < this.stylesheets.length; i++)
        await this.stylesheets[i]();
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
