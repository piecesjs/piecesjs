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
  addPiece(t) {
    typeof this.currentPieces[t.name] != "object" && (this.currentPieces[t.name] = {}), this.currentPieces[t.name][t.id] = t;
  }
  removePiece(t) {
    delete this.currentPieces[t.name][t.id];
  }
}
let f = new d();
class p extends HTMLElement {
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
  privatePremount(t = !0) {
    this.baseHTML == null && (this.innerHTML = ""), this.log && console.log("🚧 premount", this.name), this.loadStyles(t), this.premount(t);
  }
  /**
   * Satelite function for premount
   */
  premount(t = !0) {
  }
  /**
   * Lifecycle - step : 1
   * @param { firstHit } boolean (false if it's an update)
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
            const r = s[n].name.replace("data-events-", "");
            let a = s[n].value;
            const l = s[n].value.split(",");
            if (l.length == 1)
              typeof this[a] == "function" && this.on(r, i, this[a]);
            else if (l.length >= 2 && i.dataset.eventInit == null) {
              a = l[0];
              const c = l[1], u = l[2];
              i.dataset.eventInit = !0, this.on(r, i, () => {
                this.call(a, i, c, u);
              });
            }
          }
      });
    }
    this.mount(t);
  }
  /**
   * Satelite function for mount
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
   * Satelite function for update
   */
  update() {
  }
  /**
   * Lifecycle - step : 3
   * @param { update } boolean
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
          let r = i[s].value;
          const a = i[s].value.split(",");
          if (a.length == 1)
            typeof this[r] == "function" && this.off(n, e, this[r]);
          else if (a.length >= 2 && e.dataset.eventInit == null) {
            r = a[0];
            const l = a[1], c = a[2];
            e.dataset.eventInit = !0, this.off(n, e, () => {
              this.call(r, e, l, c);
            });
          }
        }
    })), this.log && console.log("❌ unmount", this.name), this.unmount(t);
  }
  /**
   * Satelite function for unmount
   */
  unmount(t = !1) {
  }
  /**
   * default function from native web components
   * @param { String } property
   * @param { String } oldValue
   * @param { String } newValue
   */
  attributeChangedCallback(t, e, i) {
    e !== i && (this[t] = i, this.privateUpdate());
  }
  /**
   * @param { String } query
   * @param { HTMLElement } context
   */
  $(t, e = this) {
    const i = e.querySelectorAll(t);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  dom(t, e = this) {
    const i = e.querySelectorAll(t);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  // To capture element using data-attribute <div data-dom='query'></div>
  domAttr(t, e = this) {
    const i = e.querySelectorAll(`[data-dom="${t}"]`);
    return i.length == 1 ? i[0] : i.length == 0 ? null : i;
  }
  $All(t, e = this) {
    return Array.from(e.querySelectorAll(t));
  }
  domAll(t, e = this) {
    return Array.from(e.querySelectorAll(t));
  }
  domAttrAll(t, e = this) {
    return Array.from(e.querySelectorAll(`[data-dom="${t}"]`));
  }
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
   * @param { String } type
   * @param { HTMLElement or HTMLElement[] } el
   * @param { function } func
   * @param { Object } params
   */
  on(t, e, i, s = null) {
    if (e != null) {
      const n = `${t}_${i.name}`;
      if (!this._boundListeners.has(n)) {
        const a = i.bind(this);
        this._boundListeners.set(n, {
          original: i,
          bound: a
        });
      }
      const r = this._boundListeners.get(n).bound;
      h(e) || Array.isArray(e) ? e.length > 0 && e.forEach((a) => {
        s == null ? a.addEventListener(t, r) : a.addEventListener(t, () => r(s));
      }) : s == null ? e.addEventListener(t, r) : e.addEventListener(t, () => r(s));
    }
  }
  /**
   * Tips: remove event listeners in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement } el
   * @param { function } func
   */
  off(t, e, i) {
    if (e != null) {
      const s = `${t}_${i.name}`, n = this._boundListeners.get(s);
      if (!n) {
        console.warn(`No bound listener found for ${s}`);
        return;
      }
      const r = n.bound;
      h(e) || Array.isArray(e) ? e.length > 0 && e.forEach((a) => {
        a.removeEventListener(t, r);
      }) : e.removeEventListener(t, r), this._boundListeners.delete(s);
    }
  }
  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el, by default the event is emit on document
   * @param { Object } params
   */
  emit(t, e = document, i) {
    const s = new CustomEvent(t, {
      detail: i
    });
    e.dispatchEvent(s);
  }
  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(t, e, i, s) {
    Object.keys(this.piecesManager.currentPieces).forEach((n) => {
      n == i && Object.keys(this.piecesManager.currentPieces[n]).forEach((r) => {
        s != null ? r == s && this.piecesManager.currentPieces[n][r].piece[t](e) : this.piecesManager.currentPieces[n][r].piece[t](e);
      });
    });
  }
  /**
   * Dynamic loading of stylesheets from super()
   */
  async loadStyles(t = !0) {
    if (t)
      for (let e = 0; e < this.stylesheets.length; e++)
        await this.stylesheets[e]();
  }
  get log() {
    return typeof this.getAttribute("log") == "string";
  }
  get cid() {
    return this.getAttribute("cid");
  }
  set cid(t) {
    return this.setAttribute("cid", t);
  }
  get properties() {
    return Object.values(this.attributes).map((t) => `${t.name}="${t.value}"`).join(" ");
  }
}
export {
  p as Piece,
  m as load,
  f as piecesManager
};
