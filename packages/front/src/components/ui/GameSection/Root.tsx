import {E_GAME_STATUS, GAME_STATUS} from "../../../constant/game";
import {JSX, Children} from "react";
import {Center} from "@chakra-ui/react";
// @ts-ignore
import {isAllowedChildComponent, validateChildCount} from "@utils/reactChild";
import {Player} from "../../../types/data";
import {COLOR} from "@assets/styles/color.css";
import {getFirstElement} from "@utils/array";
import DrawingCanvas from "./DrawingCanvas";
import GameSetting from "./GameSetting";
import WordSelector from './WordSelector'
import GameResult from "./GameResult";

type Props = {
    gameStatus: E_GAME_STATUS
    players: Player[]
    userId: string | undefined
    drawPlayerId: string | undefined
    children: JSX.Element[]
}

const Root = ({ children, gameStatus, userId, drawPlayerId, players}: Props) => {
    validateChildCount(children, { GameSetting: 1, DrawingCanvas: 1, WordSelector: 1, GameResult: 1 })
    if (!isAllowedChildComponent(children, GameSetting, DrawingCanvas, WordSelector, GameResult)) {
        throw Error('[GameArea] 허용되지 않은 children 이 포함되어 있습니다.')
    }
    const isMyTurn = userId === drawPlayerId

    const GameSettingComp = getFirstElement(Children.map(children, (child) => child.type === GameSetting ? child : null))

    const DrawingCanvasComp = getFirstElement(Children.map(children, (child) => child.type === DrawingCanvas ? child : null))

    const WordSelectorComp = getFirstElement(Children.map(children, (child) => child.type === WordSelector ? child : null))

    const GameResultComp = getFirstElement(Children.map(children, (child) => child.type === GameResult ? child : null))
    return (
        <Center height={'100%'} w={'100%'} bg={gameStatus === GAME_STATUS.게임중 ? COLOR.lightGray : ''} border={`1px solid ${COLOR.gray}`} borderRadius={'xl'} p={2} overflow={'auto'}>
            {gameStatus === GAME_STATUS.설정중 && GameSettingComp}
            {gameStatus === GAME_STATUS.단어선택중 && WordSelectorComp}
            {gameStatus === GAME_STATUS.게임중 && isMyTurn && DrawingCanvasComp}
            {gameStatus === GAME_STATUS.종료 && GameResultComp}
             {/* 플레이어 비디오(음성, 캔버스) */}
             {
                 players
                     .filter(player => player.id !== userId)
                     .map(player =>
                         <video
                             style={{
                                 display:
                                     // 게임중일때 술래의 화면만 표시
                                     gameStatus === GAME_STATUS.게임중 && player.id === drawPlayerId ?
                                         'block' : 'none',
                                 width: '100%',
                                 height: '100%'
                             }}
                             key={`${player.socketId}-video`}
                             id={`${player.socketId}-video`}
                             autoPlay
                         />
                     )
             }
        </Center>
    )
}

export default Root