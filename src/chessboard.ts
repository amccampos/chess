import 'cm-chessboard/assets/styles/cm-chessboard.css'

// @ts-ignore
import { COLOR, Chessboard as Board, MARKER_TYPE } from 'cm-chessboard'
import { Chess, Move } from 'chess.js'
import { createDiv } from './ui'
import { UserPlayer } from './user_player'
import { AIPlayer } from './ai_player'
import { Player } from './player'

interface MoveCallback {
  (move: Move): void
}

async function wait(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  })
}

export class ChessBoard {
  private _elm: HTMLElement
  private _chess: Chess
  private _board
  private _currrentPlayer: number
  private _players: Player[]
  private _moveCallback: MoveCallback | undefined

  get element() { return this._elm }
  get chess() { return this._chess }
  get board() { return this._board }

  constructor() {
    this._elm = createDiv({ style: "width: 400px" })
    this._chess = new Chess()
    this._board = new Board(this._elm, {
      position: this._chess.fen(),
      sprite: { url: "assets/images/chessboard-sprite-staunty.svg" },
      style: { moveFromMarker: MARKER_TYPE.square, moveToMarker: MARKER_TYPE.square },
      orientation: COLOR.white
    })
    this._players = [
      new UserPlayer(this, COLOR.white),
      new AIPlayer(this, COLOR.black)
    ]
    this._currrentPlayer = 0
    this.start()
  }

  reset() {
    this._chess.reset()
    this._board.setPosition(this._chess.fen(), true)
    this._currrentPlayer = 0
  }

  onMove(moveCallback: MoveCallback) {
    this._moveCallback = moveCallback
  }

  async start() {
    this.reset()
    return new Promise<string>(async resolve => {
      while(true) {
        await wait(50)
        const player = this._players[this._currrentPlayer]
        const move = await player.play()
        await wait(500)
        if (this._moveCallback && move) {
          this._moveCallback(move)
        }
        if (this.chess.isGameOver()) {
          console.log('Game over')
          const playerName = player.color === COLOR.white ? 'white' : 'black'
          resolve(`Player ${playerName} won`)
          break
        }
        this._currrentPlayer = (this._currrentPlayer + 1) % 2
      }
    })
  }
}
