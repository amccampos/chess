import { Board } from "./board";
import { Color, Piece, Type } from "./piece";

const ascii_1 = '1'.charCodeAt(0)
const ascii_a = 'a'.charCodeAt(0)
// retorna [lin, col] da string de uma posição (ex: 'a5')
function posToInt(pos: string) {
  const col = pos.charCodeAt(0) - ascii_a
  const lin = pos.charCodeAt(1) - ascii_1
  return [lin, col]
}

// retorna a string de uma posição (ex: 'a5') de um par linha, coluna.
// function intToPos(lin: number, col: number) {
//   return String.fromCharCode(ascii_a + col) + String.fromCharCode(ascii_1 + lin)
// }

function p(color: Color, type: Type, pos: string) {
  const [lin, col] = posToInt(pos)
  return new Piece(color, type, lin, col)
}

export const root = new Board([
  // peças brancas
  p(Color.WHITE, Type.PAWN,   "a2"),
  p(Color.WHITE, Type.PAWN,   "b2"),
  p(Color.WHITE, Type.PAWN,   "c2"),
  p(Color.WHITE, Type.PAWN,   "d2"),
  p(Color.WHITE, Type.PAWN,   "e2"),
  p(Color.WHITE, Type.PAWN,   "f2"),
  p(Color.WHITE, Type.PAWN,   "g2"),
  p(Color.WHITE, Type.PAWN,   "h2"),
  p(Color.WHITE, Type.ROOK,   "a1"),
  p(Color.WHITE, Type.ROOK,   "h1"),
  p(Color.WHITE, Type.KNIGHT, "b1"),
  p(Color.WHITE, Type.KNIGHT, "g1"),
  p(Color.WHITE, Type.BISHOP, "c1"),
  p(Color.WHITE, Type.BISHOP, "f1"),
  p(Color.WHITE, Type.QUEEN,  "d1"),
  p(Color.WHITE, Type.KING,   "e1"),

  // peças pretas
  p(Color.BLACK, Type.PAWN,   "a7"),
  p(Color.BLACK, Type.PAWN,   "b7"),
  p(Color.BLACK, Type.PAWN,   "c7"),
  p(Color.BLACK, Type.PAWN,   "d7"),
  p(Color.BLACK, Type.PAWN,   "e7"),
  p(Color.BLACK, Type.PAWN,   "f7"),
  p(Color.BLACK, Type.PAWN,   "g7"),
  p(Color.BLACK, Type.PAWN,   "h7"),
  p(Color.BLACK, Type.ROOK,   "a8"),
  p(Color.BLACK, Type.ROOK,   "h8"),
  p(Color.BLACK, Type.KNIGHT, "b8"),
  p(Color.BLACK, Type.KNIGHT, "g8"),
  p(Color.BLACK, Type.BISHOP, "c8"),
  p(Color.BLACK, Type.BISHOP, "f8"),
  p(Color.BLACK, Type.QUEEN,  "d8"),
  p(Color.BLACK, Type.KING,   "e8"),
])

export class BoardState {
  children: BoardState[]

  constructor(public board: Board, public color: Color) {
    this.children = []
  }

  expand() {
    const moves = this.board.getMoves(this.color)
    this.children = moves.map(move => {
      const board = this.board.clone()
      board.execMove(move)
      const nextColor = this.color === Color.WHITE ? Color.BLACK : Color.WHITE
      return new BoardState(board, nextColor)
    })
  }
}
