/**
 * Manager for all active pieces
 */
class Manager {
  constructor() {
    /**
     * Number of pieces loaded (mounted)
     * @type {number}
     */
    this.loadedPiecesCount = 0;

    /**
     * Total count of pieces created
     * @type {number}
     */
    this.piecesCount = 0;

    /**
     * All currently active pieces
     * @type {Object<string, Object<string, {name: string, id: string, piece: import('./Piece').Piece}>>}
     */
    this.currentPieces = {};
  }

  /**
   * Add a piece to the manager
   * @param {{name: string, id: string, piece: import('./Piece').Piece}} piece - Piece data to add
   */
  addPiece(piece) {
    if (typeof this.currentPieces[piece.name] != 'object') {
      this.currentPieces[piece.name] = {};
    }
    this.currentPieces[piece.name][piece.id] = piece;
  }

  /**
   * Remove a piece from the manager
   * @param {{name: string, id: string}} piece - Piece data to remove
   */
  removePiece(piece) {
    delete this.currentPieces[piece.name][piece.id];
  }
}

/**
 * Global pieces manager
 * @type {Manager}
 */
export let piecesManager = new Manager();
