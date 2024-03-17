class Manager {
  constructor() {
    this.piecesCount = 0;
    this.currentPieces = {};
  }

  addPiece(piece) {
    if (typeof this.currentPieces[piece.name] != "object") {
      this.currentPieces[piece.name] = {};
    }
    this.currentPieces[piece.name][piece.id] = piece;
  }

  removePiece(piece) {
    Object.keys(this.currentPieces).forEach((name) => {
      if (name == piece.name) {
        Object.keys(this.currentPieces[name]).forEach((id) => {
          delete this.currentPieces[name][id];
        });

        delete this.currentPieces[name];
      }
    });
  }
}

export let piecesManager = new Manager();
