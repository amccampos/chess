// @ts-ignore
import { INPUT_EVENT_TYPE, MARKER_TYPE } from 'cm-chessboard'
import { Move } from 'chess.js'
import { ChessBoard } from "./chessboard"
import { Player } from './player'

export class UserPlayer implements Player {
  constructor(private chessboard: ChessBoard, public readonly color: string) {
  }

  async play() {
    return new Promise<Move>((resolve) => {
      this.chessboard.board.enableMoveInput((event: any) => {
        this.chessboard.board.removeMarkers(MARKER_TYPE.dot)

        switch (event.type) {
          case INPUT_EVENT_TYPE.moveInputStarted:
            const moves = this.chessboard.chess.moves({ square: event.square, verbose: true })
            this.showUserMoves(moves as Move[])
            return moves.length > 0

          case INPUT_EVENT_TYPE.validateMoveInput:
            const move = this.chessboard.chess.move({
              from: event.squareFrom,
              to: event.squareTo
            })
            if (move) {
              event.chessboard.disableMoveInput()
              event.chessboard.state.moveInputProcess.then(() => resolve(move))
            } else {
              console.warn("invalid move", move)
              return false
            }
            break;
        }
        return true
      }, this.color)
    })
  }


  private showUserMoves(moves: Move[]) {
    for (const move of moves) { // draw dots on possible squares
      if (typeof move !== 'string') {
        this.chessboard.board.addMarker(MARKER_TYPE.dot, move.to)
      }
    }
  }
}