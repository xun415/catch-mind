import GameBar from "@components/ui/GameBar";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import useUserStore from "../stores/useUserStore";

const GameBarContainer = () => {
    const { username } = useUserStore()
    const { drawPlayer, currentRound, roomConfig: {totalRound, timePerRound}, gameStatus, currentAnswer, currentAnswerLength } = useGameRoomStore()
    // 현재 플레이 여부
    const isMyTurn = drawPlayer?.username === username

    return (
        <GameBar
            isMyTurn={isMyTurn}
            totalRound={totalRound}
            currentRound={currentRound}
            gameStatus={gameStatus}
            timePerRound={timePerRound}
            currentAnswer={currentAnswer}
            currentAnswerLength={currentAnswerLength}
        />
    )
}

export default GameBarContainer