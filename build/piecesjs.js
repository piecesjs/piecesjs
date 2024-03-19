const l = async (r, e) => {
  document.getElementsByTagName(r).length > 0 && await e();
};
class h {
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
let o = new h();
class u extends HTMLElement {
  constructor(e, { stylesheets: t = [] } = {}) {
    super(), this.name = e, this.template = document.createElement("template"), this.piecesManager = o, this.stylesheets = t, this.innerHTML != " " && (this.baseHTML = this.innerHTML);
  }
  registerStylesheet(e) {
    this.stylesheets.push(e);
  }
  //
  // Basic Custom Elements functions
  //
  connectedCallback(e = !0) {
    e && (typeof this.cid == "string" ? this.cid = this.cid : this.cid = `c${this.piecesManager.piecesCount++}`, this.piecesManager.addPiece({
      name: this.name,
      id: this.cid,
      piece: this
    })), this.privatePremount(), this.baseHTML != " " && (this.template.innerHTML = this.render(), this.appendChild(this.template.cloneNode(!0).content)), this.privateMount();
  }
  render() {
    if (this.baseHTML != null)
      return this.baseHTML;
  }
  disconnectedCallback() {
    this.privateUnmount();
  }
  adoptedCallback() {
    this.adopted();
  }
  // Lifecycle - step : 0
  privatePremount() {
    this.innerHTML = "", this.log && console.log("🚧 premount", this.name), this.loadStyles(), this.premount();
  }
  premount() {
  }
  // Lifecycle - step : 1
  privateMount() {
    this.log && console.log("🔨 mount", this.name), this.mount();
  }
  mount() {
  }
  // Lifecycle - step : 2
  privateUpdate() {
    this.log && console.log("🔃 update", this.name), this.privateUnmount(!0), this.connectedCallback(!1);
  }
  update() {
  }
  // Lifecycle - step : 3
  privateUnmount(e = !1) {
    e || this.piecesManager.removePiece({
      name: this.name,
      id: this.cid
    }), this.log && console.log("👋 unmount", this.name), this.unmount();
  }
  unmount() {
  }
  // Check for update
  attributeChangedCallback(e, t, i) {
    t !== i && (this[e] = i, this.privateUpdate());
  }
  // Simple query to return an HTMLElement
  $(e) {
    return this.querySelectorAll(e);
  }
  //
  // Event Managment
  //
  addEvent(e, t, i, s = null) {
    t != null && (t.length > 0 ? t.forEach((n) => {
      n.addEventListener(e, i.bind(this, s));
    }) : t.addEventListener(e, i.bind(this, s)));
  }
  removeEvent(e, t, i) {
    t != null && (t.length > 0 ? t.forEach((s) => {
      s.removeEventListener(e, i.bind(this));
    }) : t.removeEventListener(e, i.bind(this)));
  }
  // Call function anywhere
  call(e, t, i, s) {
    Object.keys(this.piecesManager.currentPieces).forEach((n) => {
      n == i && Object.keys(this.piecesManager.currentPieces[n]).forEach((c) => {
        s != null ? c == s && this.piecesManager.currentPieces[n][c].piece[e](t) : this.piecesManager.currentPieces[n][c].piece[e](t);
      });
    });
  }
  // Dynamically load styles in the page
  async loadStyles() {
    for (let e = 0; e < this.stylesheets.length; e++)
      await this.stylesheets[e]();
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
  u as Piece,
  l as load,
  o as piecesManager
};
