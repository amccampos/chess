import './style.css'
import { createButton, createHeading, setChildren } from './ui'
import { ChessBoard } from './chessboard'

const title = createHeading('Chess AI')
const message = createHeading('User player is white', 4)
const startButton = createButton('Reset game', () => chessboard.start(), { id: 'start-btn'})
const chessboard = new ChessBoard()

function name(color: string) {
  return color === 'w' ? 'White' : 'Black'
}

setChildren('app', [ title, chessboard.element, startButton, message ])

chessboard.onMove(move => {
  let text: string
  if (chessboard.chess.isGameOver()) {
    text = `Player ${name(move.color)} won.`
  }
  else if (move.color === 'w') {
    text = `Now, it is Black's turn.`
  }
  else {
    text = `White, it's your turn now.`
  }
  message.innerText = text
})