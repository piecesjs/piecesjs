const u = async (s, e, t = document) => {
  t.getElementsByTagName(s).length > 0 && await e();
}, h = (s) => {
  var e = Object.prototype.toString.call(s);
  return typeof s == "object" && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(e) && typeof s.length == "number" && (s.length === 0 || typeof s[0] == "object" && s[0].nodeType > 0);
};
class o {
  constructor() {
    this.piecesCount = 0, this.currentPieces = {};
  }
  addPiece(e) {
    typeof this.currentPieces[e.name] != "object" && (this.currentPieces[e.name] = {}), this.currentPieces[e.name][e.id] = e;
  }
  removePiece(e) {
    Object.keys(this.currentPieces).forEach((t) => {
      t == e.name && (Object.keys(this.currentPieces[t]).forEach((i) => {
        delete this.currentPieces[t][i];
      }), delete this.currentPieces[t]);
    });
  }
}
let l = new o();
class d extends HTMLElement {
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e, this.template = document.createElement("template"), this.piecesManager = l, this.stylesheets = t, this.innerHTML != "" && (this.baseHTML = this.innerHTML);
  }
  /**
   * default function from native web components connectedCallback()
   */
  connectedCallback(e = !0) {
    e && (typeof this.cid == "string" ? this.cid = this.cid : this.cid = `c${this.piecesManager.piecesCount++}`, this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(e), this.baseHTML == null && (this.innerHTML = "", this.template.innerHTML = this.render(), this.appendChild(this.template.cloneNode(!0).content)), this.privateMount(e);
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
    this.log && console.log("🔃 update", this.name), this.privateUnmount(!0), this.connectedCallback(!1);
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
    return t.querySelectorAll(e);
  }
  dom(e, t = this) {
    return t.querySelectorAll(e);
  }
  /**
   * Events Managment
   */
  /**
   * Tips: remove events in the mount(), register event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement or HTMLElement[] } el
   * @param { function } func
   * @param { Object } params
   */
  on(e, t, i, n = null) {
    t != null && (h(t) && t.length > 0 ? t.forEach((r) => {
      n == null ? r.addEventListener(e, i.bind(this)) : r.addEventListener(e, i.bind(this, n));
    }) : n == null ? t.addEventListener(e, i.bind(this)) : t.addEventListener(e, i.bind(this, n)));
  }
  /**
   * Tips: remove events in the unmount(), unegister event for an HTMLElement or an array of HTMLElements
   * @param { String } type
   * @param { HTMLElement } el
   * @param { function } func
   */
  off(e, t, i) {
    t != null && (h(t) && t.length > 0 ? t.forEach((n) => {
      n.removeEventListener(e, i.bind(this));
    }) : t.removeEventListener(e, i.bind(this)));
  }
  /**
   * Emit a custom event
   * @param { String } eventName
   * @param { HTMLElement } el
   */
  emit(e, t = document) {
    const i = new CustomEvent(e);
    t.dispatchEvent(i);
  }
  /**
   * Call function of a component, from a component
   * @param { String } func
   * @param { Object } args
   * @param { String } pieceName
   * @param { String } pieceId
   */
  call(e, t, i, n) {
    Object.keys(this.piecesManager.currentPieces).forEach((r) => {
      r == i && Object.keys(this.piecesManager.currentPieces[r]).forEach((c) => {
        n != null ? c == n && this.piecesManager.currentPieces[r][c].piece[e](t) : this.piecesManager.currentPieces[r][c].piece[e](t);
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
  l as piecesManager
};
