import { Panel, panels, PanelState, activatePanel } from './panels'

// possible game states
export enum State {
  PLAYING,
  LISTENING,
  IDLE
}

// game data  object
export class GameData {
  state: State = State.IDLE
  difficulty: number = 0
  sequence: Panel[] = []
  playingIndex: number = 0
  gapTime: number = 0.5
  guessSequence: Panel[] = []
  lockedInput: boolean = true
  reset() {
    this.difficulty = 0
    this.sequence = []
    this.guessSequence = []
    this.lockedInput = true
    this.playingIndex = -1
    this.gapTime = 0.5
  }
  resetPlaying() {
    this.playingIndex = -1
    this.gapTime = 0.5
    this.sequence = []
    this.guessSequence = []
  }
}

// system to play the color sequences
export class PlaySequence implements ISystem {
  game: GameData
  constructor(gameData) {
    this.game = gameData
  }
  update(dt: number) {
    if (this.game.state === State.PLAYING) {
      this.game.gapTime -= dt
      if (this.game.gapTime < 0) {
        const color = this.game.sequence[this.game.playingIndex]
        activatePanel(color)
        this.game.gapTime = 0.5
        this.game.playingIndex += 1
        if (this.game.playingIndex === this.game.sequence.length) {
          this.game.state = State.LISTENING
        }
      }
    }
  }
}

export function newGame(gameData: GameData) {
  if (gameData.difficulty === 0) {
    gameData.reset()
  } else {
    gameData.resetPlaying()
  }
  const sequence = randomSequence(gameData.difficulty + 1)
  gameData.sequence = sequence
  gameData.state = State.PLAYING
}

export function randomSequence(difficulty: number): Panel[] {
  const pool = Object.keys(Panel)
  const arr: Panel[] = []

  for (let i = 0; i < difficulty; i++) {
    const index = Math.floor(Math.random() * pool.length)
    const key = pool[index] as keyof typeof Panel
    const panel = Panel[key] as Panel
    arr.push(panel)
  }

  return arr
}

export function checkGuess(gameData: GameData, color: Panel) {
  gameData.guessSequence.push(color)
  log(gameData.guessSequence)
  if (gameData.sequence[gameData.guessSequence.length - 1] !== color) {
    lose(gameData)
    return
  }
  if (gameData.guessSequence.length === gameData.sequence.length) {
    // Winner winner chicken dinner
    log('You win! Keep going!')
    gameData.difficulty += 1
    newGame(gameData)
    return
  }
}

export function lose(gameData: GameData) {
  log('You lose!')
  gameData.reset()
  gameData.state = State.IDLE
  for (const panel of panels.entities) {
    const p = panel.getComponent(PanelState)
    p.activate()
  }
}
