import { Piece } from './Piece';

export interface PieceData {
  name: string;
  id: string;
  piece: Piece;
}

export interface CurrentPieces {
  [pieceName: string]: {
    [pieceId: string]: PieceData;
  };
}

/**
 * Manager for all active pieces
 */
export class Manager {
  /** Number of pieces loaded (mounted) */
  loadedPiecesCount: number;

  /** Total count of pieces created */
  piecesCount: number;

  /** All currently active pieces */
  currentPieces: CurrentPieces;

  constructor();

  /**
   * Add a piece to the manager
   * @param piece - Piece data to add
   */
  addPiece(piece: PieceData): void;

  /**
   * Remove a piece from the manager
   * @param piece - Piece data to remove
   */
  removePiece(piece: Pick<PieceData, 'name' | 'id'>): void;
}

/**
 * Global pieces manager
 */
export const piecesManager: Manager;
