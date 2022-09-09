import { Color, Move, Piece } from "./piece"

type BoardCell = Piece | null



export class Board {
  board: BoardCell[][]

  constructor(pieces: Piece[] = []) {
    this.board = new Array(8).fill(null)
    this.board = this.board.map(() => new Array(8).fill(null))
    pieces.forEach(p => this.board[p.lin][p.col] = new Piece(p.color, p.type, p.lin, p.col))
  }

  clone() {
    return new Board([
      ...this.getPieces(Color.BLACK),
      ...this.getPieces(Color.WHITE),
    ])
  }

  getPieces(color: Color) {
    const pieces: Piece[] = []
    for (let lin = 0; lin < 8; lin++) {
      for (let col = 0; col < 8; col++) {
        const p = this.board[lin][col]
        if (p && p.color === color) {
          pieces.push(p)
        }
      }
    }
    return pieces
  }

  isValid(lin: number, col: number) {
    return lin >= 0 && lin <= 7 && col >= 0 && col <= 7
  }

  isBusy(lin: number, col: number) {
    return !this.isValid(lin, col) || this.board[lin][col] != null
  }

  isAdversary(piece: Piece, lin: number, col: number) {
    return this.isValid(lin, col) && this.isBusy(lin, col) && piece.color !== this.board[lin][col]?.color
  }

  getMoves(color: Color) {
    const pieces = this.getPieces(color)
    const moves = pieces.flatMap(p => p.getMoves(this))
    return moves
  }

  execMove(move: Move) {
    const piece = this.board[move.piece.lin][move.piece.col]
    if (piece) {
      this.board[move.piece.lin][move.piece.col] = null
      piece.lin = move.lin
      piece.col = move.col
      this.board[piece.lin][piece.col] = piece
    }
  }

  print() {
    for (let lin = 7; lin >= 0; lin--) {
      const line = []
      for (let col = 0; col < 8; col++) {
        const p = this.board[lin][col]
        if (p) {
          if (p.color === Color.BLACK) {
            line.push(p.toChar())
          }
          else {
            line.push(p.toChar().toUpperCase())
          }
        }
        else {
          line.push('_')
        }
      }
      console.log(line.join(' '))
    }
  }

}