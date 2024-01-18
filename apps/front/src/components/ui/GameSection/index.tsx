import WordSelector from "./WordSelector";
import DrawingCanvas from './DrawingCanvas'
import GameSetting from './GameSetting'
import GameResult from "./GameResult";
import Root from "./Root";

const GameSection = Object.assign(Root, {
    WordSelector,
    DrawingCanvas,
    GameSetting,
    GameResult
})

export default GameSection