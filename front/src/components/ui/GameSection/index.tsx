import WordSelector from "./WordSelector";
import DrawingCanvas from './DrawingCanvas'
import GameSetting from './GameSetting'
import Root from "./Root";

const GameSection = Object.assign(Root, {
    WordSelector,
    DrawingCanvas,
    GameSetting
})

export default GameSection