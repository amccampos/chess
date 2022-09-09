import { Chess, Color, Move } from 'chess.js'
import { ChessBoard } from "./chessboard"
import { Player } from './player'

import { evaluateBoard } from './evaluation'

interface MoveValue {
  move: Move | null
  value: number
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean, sum: number, color: Color): MoveValue {
  var children = game.moves({ verbose: true });

  // Sort moves randomly, so the same move isn't always picked on ties
// @ts-ignore
  children.sort((a: any, b: any) => 0.5 - Math.random())

  var currMove;
  // Maximum depth exceeded or node is a terminal node (no children)
  if (depth === 0 || children.length === 0) {
    return {
      move: null,
      value: sum
    }
  }

  // Find maximum/minimum from list of 'children' (possible moves)
  let maxValue = Number.NEGATIVE_INFINITY;
  let minValue = Number.POSITIVE_INFINITY;
  let bestMove = null
  for (let i = 0; i < children.length; i++) {
    currMove = children[i];

    // Note: in our case, the 'children' are simply modified game states
    const currPrettyMove = game.move(currMove) as Move
    const newSum = evaluateBoard(currPrettyMove, sum, color);
    const bestChild = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer, newSum, color)

    game.undo();

    if (isMaximizingPlayer) {
      if (bestChild.value > maxValue) {
        maxValue = bestChild.value;
        bestMove = currPrettyMove;
      }
      if (bestChild.value > alpha) {
        alpha = bestChild.value
      }
    }
    else {
      if (bestChild.value < minValue) {
        minValue = bestChild.value;
        bestMove = currPrettyMove;
      }
      if (bestChild.value < beta) {
        beta = bestChild.value
      }
    }
    if (alpha >= beta) {
      break
    }
  }

  if (isMaximizingPlayer) {
    return {
      move: bestMove,
      value: maxValue
    }
  }
  else {
    return {
      move: bestMove,
      value: minValue
    }
  }
}

// ------------------------------------------------------------------

export class AIPlayer implements Player {
  constructor(private chessboard: ChessBoard, public readonly color: string) {
  }

  async play() {
    return new Promise<Move>((resolve) => {
      const { move } = minimax(this.chessboard.chess, 3, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, 0, 'b')
      if (move) {
        this.chessboard.chess.move({ from: move.from, to: move.to })
        this.chessboard.board.setPosition(this.chessboard.chess.fen(), true)
        resolve(move)
      }
    })
  }

}
