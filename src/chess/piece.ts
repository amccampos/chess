import { Board } from "./board"

export enum Type {
  PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING
}

export enum Color {
  WHITE, BLACK
}

export interface Move {
  piece: Piece
  lin: number
  col: number
}

export class Piece {
  constructor(
    public color: Color,
    public type: Type,
    public lin: number,
    public col: number
  ) {}

  getMoves(board: Board) {
    switch(this.type) {
      case Type.PAWN:   return this.getPawnMoves(board)
      case Type.ROOK:   return this.getRunMoves(board, [[-1, 0], [1, 0], [0, -1], [0, 1]])
      case Type.KNIGHT: return this.getStepMoves(board, [[-2, -1], [-2, 1], [-1, 2], [1, 2], [2, -1], [2, 1], [-1, -2], [1, -2]])
      case Type.BISHOP: return this.getRunMoves(board, [[-1, -1], [1, -1], [-1, 1], [1, 1]])
      case Type.QUEEN:  return this.getRunMoves(board, [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]])
      case Type.KING:   return this.getStepMoves(board, [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]])
    }
    return []
  }

  toChar() {
    switch (this.type) {
      case Type.PAWN:   return 'p';
      case Type.ROOK:   return 'r';
      case Type.KNIGHT: return 't';
      case Type.BISHOP: return 'b';
      case Type.QUEEN:  return 'q';
      case Type.KING:   return 'k';
    }
  }

  getPawnMoves(board: Board) {
    const moves: Move[] = []
    const piece = this
    const dir = this.color == Color.WHITE ? 1 : -1
    let lin = this.lin + dir
    let col = this.col
    if (!board.isBusy(lin, col)) {
      moves.push({ piece, lin, col })
      const isFirstMove = (
        (this.color === Color.WHITE && this.lin === 1) ||
        (this.color === Color.BLACK && this.lin === 6)
      )
      lin = this.lin + 2 * dir
      if (isFirstMove && !board.isBusy(lin, col)) {
        moves.push({ piece, lin, col })
      }
    }
    lin = this.lin + dir
    col = this.col - 1
    if (board.isAdversary(this, lin, col)) {
      moves.push({ piece, lin, col })
    }
    col = this.col + 1
    if (board.isAdversary(this, lin, col)) {
      moves.push({ piece, lin, col })
    }
    return moves
  }

  private getRunMoves(board: Board, movements: number[][]) {
    const moves: Move[] = []
    const piece = this
    movements.forEach(([l, c]) => {
      let lin = this.lin + l
      let col = this.col + c
      while (!board.isBusy(lin, col)) {
        moves.push({ piece, lin, col })
        lin += l
        col += c
      }
      if (board.isAdversary(piece, lin, col)) {
        moves.push({ piece, lin, col })
      }
    })
    return moves
  }

  private getStepMoves(board: Board, movements: number[][]) {
    const moves: Move[] = []
    const piece = this
    movements.forEach(([l, c]) => {
      let lin = this.lin + l
      let col = this.col + c
      if (!board.isBusy(lin, col) || board.isAdversary(piece, lin, col)) {
        moves.push({ piece, lin, col })
      }
    })
    return moves
  }

}