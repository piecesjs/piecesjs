class Manager {
  constructor() {
    this.loadedPiecesCount = 0;
    this.piecesCount = 0;
    this.currentPieces = {};
  }

  addPiece(piece) {
    if (typeof this.currentPieces[piece.name] != 'object') {
      this.currentPieces[piece.name] = {};
    }
    this.currentPieces[piece.name][piece.id] = piece;
  }

  removePiece(piece) {
    delete this.currentPieces[piece.name][piece.id];
  }
}

export let piecesManager = new Manager();
