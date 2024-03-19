import { piecesManager } from "./piecesManager";

export class Piece extends HTMLElement {
  constructor(name,{ stylesheets = [] } = {}) {
    super();

    this.name = name;
    this.template = document.createElement("template");
    this.piecesManager = piecesManager;

    this.stylesheets = stylesheets;

    if (this.innerHTML != " ") {
      this.baseHTML = this.innerHTML;
    }
  }

  registerStylesheet(loadStylesheet) {
    this.stylesheets.push(loadStylesheet);
  }

  //
  // Basic Custom Elements functions
  //
  connectedCallback(firstHit = true) {
    if (firstHit) {
      // Add the piece to the PiecesManager
      if (typeof this.cid == "string") {
        this.cid = this.cid;
      } else {
        this.cid = `c${this.piecesManager.piecesCount++}`;
      }

      this.piecesManager.addPiece({
        name: this.name,
        id: this.cid,
        piece: this,
      });
    }

    this.privatePremount();

    if(this.baseHTML != " ") {
      this.template.innerHTML = this.render();
      this.appendChild(this.template.cloneNode(true).content);
    }

    this.privateMount();
  }

  render() {
    if (this.baseHTML != undefined) {
      return this.baseHTML;
    }
  }

  disconnectedCallback() {
    this.privateUnmount();
  }

  adoptedCallback() {
    this.adopted();
  }

  // Lifecycle - step : 0
  privatePremount() {
    this.innerHTML = "";

    if (this.log) {
      console.log("🚧 premount", this.name);
    }

    this.loadStyles();
    this.premount();
  }

  premount(){}

  // Lifecycle - step : 1
  privateMount() {
    if (this.log) {
      console.log("🔨 mount", this.name);
    }

    this.mount();
  }

  mount() {}

  // Lifecycle - step : 2
  privateUpdate() {
    if (this.log) {
      console.log("🔃 update", this.name);
    }

    this.privateUnmount(true);
    this.connectedCallback(false);
  }
  update() {}

  // Lifecycle - step : 3
  privateUnmount(update = false) {
    if(!update) {
      this.piecesManager.removePiece({
        name: this.name,
        id: this.cid,
      });
    }

    if (this.log) {
      console.log("👋 unmount", this.name);
    }
    this.unmount();
  }

  unmount() {}

  // Check for update
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;

    this.privateUpdate();
  }

  // Simple query to return an HTMLElement
  $(query) {
    return this.querySelectorAll(query);
  }

  //
  // Event Managment
  //
  addEvent(type, el, func, params = null) {
    if(el != null) {
      if(el.length > 0) {
        el.forEach(item => {
          item.addEventListener(type, func.bind(this,params));
        });
      } else {
        el.addEventListener(type, func.bind(this,params));
      }
      
    }
  }

  removeEvent(type, el, func) {
    if(el != null) {
      if(el.length > 0) {
        el.forEach(item => {
          item.removeEventListener(type, func.bind(this));
        });
      } else {
        el.removeEventListener(type, func.bind(this));
      }
    }
  }

  // Call function anywhere
  call(func, args, pieceName, pieceId) {
    Object.keys(this.piecesManager.currentPieces).forEach((name) => {

      if (name == pieceName) {
        Object.keys(this.piecesManager.currentPieces[name]).forEach((id) => {
          if (pieceId != undefined) {
            if (id == pieceId) {
              let piece = this.piecesManager.currentPieces[name][id].piece;
              piece[func](args);
            }
          } else {
            let piece = this.piecesManager.currentPieces[name][id].piece;
            piece[func](args);
          }
        });
      }
    });
  }

  // Dynamically load styles in the page
  async loadStyles() {
    for (let i = 0; i < this.stylesheets.length; i++) {
      await this.stylesheets[i]();
    }
  }

  get log() {
    return typeof this.getAttribute("log") == "string";
  }

  get cid() {
    return this.getAttribute("cid");
  }

  set cid(cid) {
    return this.setAttribute("cid", cid);
  }

  get properties() {
    return Object.values(this.attributes)
      .map((a) => `${a.name}="${a.value}"`)
      .join(" ");
  }
}
