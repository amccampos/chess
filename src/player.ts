import { Move } from 'chess.js'

export interface Player {
  readonly color: string
  play: () => Promise<Move> 
}