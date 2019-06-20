
import { PushButton, ButtonState } from './modules/buttons'
import { LightUpPanels, PanelState, Panel, panels, activatePanel } from './modules/panels';
import { PlaySequence, GameData, State, checkGuess, randomSequence } from './modules/gameData';

// Create an object to hold the gameState

let gameData = new GameData()


// Stat systems 

engine.addSystem(new PlaySequence(gameData))

engine.addSystem(new LightUpPanels())
   
engine.addSystem(new PushButton())


// // a message bus to sync state for all players
export const sceneMessageBus = new MessageBus()



// Materials

let greenOn = new Material()
greenOn.albedoColor = Color3.FromHexString("#00ff00")
greenOn.emissiveColor = Color3.FromHexString("#00ff00")

let greenOff = new Material()
greenOff.albedoColor = Color3.FromHexString("#008800")

let redOn = new Material()
redOn.albedoColor = Color3.FromHexString("#ff0000")
redOn.emissiveColor = Color3.FromHexString("#ff0000")

let redOff = new Material()
redOff.albedoColor = Color3.FromHexString("#880000")

let yellowOn = new Material()
yellowOn.albedoColor = Color3.FromHexString("#ffff00")
yellowOn.emissiveColor = Color3.FromHexString("#ffff00")

let yellowOff = new Material()
yellowOff.albedoColor = Color3.FromHexString("#888800")

let blueOn = new Material()
blueOn.albedoColor = Color3.FromHexString("#0000ff")
blueOn.emissiveColor = Color3.FromHexString("#0000ff")

let blueOff = new Material()
blueOff.albedoColor = Color3.FromHexString("#000088")


// INITIAL ENTITIES

// board and panels
let board = new Entity()
board.addComponent(new GLTFShape("models/Simon.gltf"))
board.addComponent(new Transform({
  position: new Vector3(8, 2.2, 8),
  rotation: Quaternion.Euler(90, 0, 180),
  scale: new Vector3(0.7, 0.7, 0.7)
})) 
engine.addEntity(board)

let green = new Entity()
green.addComponent(greenOff)
green.addComponent(new PlaneShape())
green.addComponent(new PanelState(greenOn, greenOff, Panel.GREEN))
green.addComponent(new Transform({
  position: new Vector3(1, 0.05, -1),
  rotation: Quaternion.Euler(90, 180, 0),
  scale: new Vector3(2, 2, 2)
}))
green.setParent(board)
green.addComponent(new OnClick(e => {
  if (gameData.state == State.LISTENING){
    activatePanel(Panel.GREEN)
    checkGuess(gameData, Panel.GREEN)
  }
}))
engine.addEntity(green)

let red = new Entity()
red.addComponent(new PlaneShape())
red.addComponent(new PanelState(redOn, redOff, Panel.RED))
red.addComponent(new Transform({
  position: new Vector3(1, 0.05, 1),
  rotation: Quaternion.Euler(90, 180, 0),
  scale: new Vector3(2, 2, 2)
}))
red.setParent(board)
red.addComponent(redOff)
red.addComponent(new OnClick(e => {
  if (gameData.state == State.LISTENING){
    activatePanel(Panel.RED)
    checkGuess(gameData, Panel.RED)
  }
}))
engine.addEntity(red)

let yellow = new Entity()
yellow.addComponent(new PlaneShape())
yellow.addComponent(new PanelState(yellowOn, yellowOff, Panel.YELLOW))
yellow.addComponent(new Transform({
  position: new Vector3(-1, 0.05, -1),
  rotation: Quaternion.Euler(90, 180, 0),
  scale: new Vector3(2, 2, 2)
}))
yellow.setParent(board)
yellow.addComponent(yellowOff)
yellow.addComponent(new OnClick(e => {
  if (gameData.state == State.LISTENING){
    activatePanel(Panel.YELLOW)
    checkGuess(gameData, Panel.YELLOW)
  }
}))
engine.addEntity(yellow)

let blue = new Entity()
blue.addComponent(new PlaneShape())
blue.addComponent(new PanelState(blueOn, blueOff, Panel.BLUE))
blue.addComponent(new Transform({
  position: new Vector3(-1, 0.05, 1),
  rotation: Quaternion.Euler(90, 180, 0),
  scale: new Vector3(2, 2, 2)
}))
blue.setParent(board)
blue.addComponent(blueOff)
blue.addComponent(new OnClick(e => {
  if (gameData.state == State.LISTENING){
    activatePanel(Panel.BLUE)
    checkGuess(gameData, Panel.BLUE)
  }
}))
engine.addEntity(blue)

// central button
let button = new Entity()
button.setParent(board)
button.addComponent(new Transform({
  position: new Vector3(0, 0.05, 0),
  rotation: Quaternion.Euler(0, 180, 0)
}))
button.addComponent(new GLTFShape("models/Simon_Button.gltf"))
button.addComponent(new ButtonState(0.07, -0.05))
button.addComponent(new OnClick(e => {
	
	const sequence = randomSequence(gameData.difficulty + 1)
	log("new game! ", sequence )
	sceneMessageBus.emit("pushButton",{})
	sceneMessageBus.emit("newRound", {colors: sequence, difficulty: gameData.difficulty})

}))
engine.addEntity(button)

// push button down
sceneMessageBus.on("pushButton", () => {	
	button.getComponent(ButtonState).pressed = true

  });

// update game data
sceneMessageBus.on("newRound", (info) => {		
	if (info.difficulty == 0) {
		gameData.reset()
	  }else {
		gameData.resetPlaying()
	  }
	gameData.sequence = info.colors
	gameData.difficulty = info.difficulty
  	gameData.state = State.PLAYING
  });




// background
let environment = new Entity()
environment.addComponent(new Transform({
  position : new Vector3(8, 0.05, 8),
  scale: new Vector3(1.6, 1.6, 1.6)
}))
environment.addComponent(new GLTFShape("models/Simon_scene.gltf"))
engine.addEntity(environment)



