import { PushButton, ButtonState } from './modules/buttons'
import {
  LightUpPanels,
  PanelState,
  Panel,
  panels,
  activatePanel
} from './modules/panels'
import {
  PlaySequence,
  GameData,
  State,
  newGame,
  checkGuess
} from './modules/gameData'

// Create an object to hold the gameState

const gameData = new GameData()

// Stat systems

engine.addSystem(new PlaySequence(gameData))

engine.addSystem(new LightUpPanels())

engine.addSystem(new PushButton())

// Materials

const greenOn = new Material()
greenOn.albedoColor = Color3.FromHexString('#00ff00')
greenOn.emissiveColor = Color3.FromHexString('#00ff00')

const greenOff = new Material()
greenOff.albedoColor = Color3.FromHexString('#008800')

const redOn = new Material()
redOn.albedoColor = Color3.FromHexString('#ff0000')
redOn.emissiveColor = Color3.FromHexString('#ff0000')

const redOff = new Material()
redOff.albedoColor = Color3.FromHexString('#880000')

const yellowOn = new Material()
yellowOn.albedoColor = Color3.FromHexString('#ffff00')
yellowOn.emissiveColor = Color3.FromHexString('#ffff00')

const yellowOff = new Material()
yellowOff.albedoColor = Color3.FromHexString('#888800')

const blueOn = new Material()
blueOn.albedoColor = Color3.FromHexString('#0000ff')
blueOn.emissiveColor = Color3.FromHexString('#0000ff')

const blueOff = new Material()
blueOff.albedoColor = Color3.FromHexString('#000088')

// INITIAL ENTITIES

// board and panels
const board = new Entity()
board.addComponent(new GLTFShape('models/Simon.gltf'))
board.addComponent(
  new Transform({
    position: new Vector3(8, 2.2, 8),
    rotation: Quaternion.Euler(90, 0, 180),
    scale: new Vector3(0.7, 0.7, 0.7)
  })
)
engine.addEntity(board)

const green = new Entity()
green.addComponent(greenOff)
green.addComponent(new PlaneShape())
green.addComponent(new PanelState(greenOn, greenOff, Panel.GREEN))
green.addComponent(
  new Transform({
    position: new Vector3(1, 0.05, -1),
    rotation: Quaternion.Euler(90, 180, 0),
    scale: new Vector3(2, 2, 2)
  })
)
green.setParent(board)
green.addComponent(
  new OnPointerDown(
    (e) => {
      if (gameData.state === State.LISTENING) {
        activatePanel(Panel.GREEN)
        checkGuess(gameData, Panel.GREEN)
      }
    },
    { button: ActionButton.POINTER, hoverText: 'GREEN' }
  )
)
engine.addEntity(green)

const red = new Entity()
red.addComponent(new PlaneShape())
red.addComponent(new PanelState(redOn, redOff, Panel.RED))
red.addComponent(
  new Transform({
    position: new Vector3(1, 0.05, 1),
    rotation: Quaternion.Euler(90, 180, 0),
    scale: new Vector3(2, 2, 2)
  })
)
red.setParent(board)
red.addComponent(redOff)
red.addComponent(
  new OnPointerDown(
    (e) => {
      if (gameData.state === State.LISTENING) {
        activatePanel(Panel.RED)
        checkGuess(gameData, Panel.RED)
      }
    },
    { button: ActionButton.POINTER, hoverText: 'RED' }
  )
)
engine.addEntity(red)

const yellow = new Entity()
yellow.addComponent(new PlaneShape())
yellow.addComponent(new PanelState(yellowOn, yellowOff, Panel.YELLOW))
yellow.addComponent(
  new Transform({
    position: new Vector3(-1, 0.05, -1),
    rotation: Quaternion.Euler(90, 180, 0),
    scale: new Vector3(2, 2, 2)
  })
)
yellow.setParent(board)
yellow.addComponent(yellowOff)
yellow.addComponent(
  new OnPointerDown(
    (e) => {
      if (gameData.state === State.LISTENING) {
        activatePanel(Panel.YELLOW)
        checkGuess(gameData, Panel.YELLOW)
      }
    },
    { button: ActionButton.POINTER, hoverText: 'YELLOW' }
  )
)
engine.addEntity(yellow)

const blue = new Entity()
blue.addComponent(new PlaneShape())
blue.addComponent(new PanelState(blueOn, blueOff, Panel.BLUE))
blue.addComponent(
  new Transform({
    position: new Vector3(-1, 0.05, 1),
    rotation: Quaternion.Euler(90, 180, 0),
    scale: new Vector3(2, 2, 2)
  })
)
blue.setParent(board)
blue.addComponent(blueOff)
blue.addComponent(
  new OnPointerDown(
    (e) => {
      if (gameData.state === State.LISTENING) {
        activatePanel(Panel.BLUE)
        checkGuess(gameData, Panel.BLUE)
      }
    },
    { button: ActionButton.POINTER, hoverText: 'BLUE' }
  )
)
engine.addEntity(blue)

// central button
const button = new Entity()
button.setParent(board)
button.addComponent(
  new Transform({
    position: new Vector3(0, 0.05, 0),
    rotation: Quaternion.Euler(0, 180, 0)
  })
)
button.addComponent(new GLTFShape('models/Simon_Button.gltf'))
button.addComponent(new ButtonState(0.07, -0.05))
button.addComponent(
  new OnPointerDown(
    (e) => {
      newGame(gameData)
      button.getComponent(ButtonState).pressed = true
    },
    { button: ActionButton.POINTER, hoverText: 'Start!' }
  )
)
engine.addEntity(button)

// background
const environment = new Entity()
environment.addComponent(
  new Transform({
    position: new Vector3(8, 0.05, 8),
    scale: new Vector3(1.6, 1.6, 1.6)
  })
)
environment.addComponent(new GLTFShape('models/Simon_scene.gltf'))
engine.addEntity(environment)
