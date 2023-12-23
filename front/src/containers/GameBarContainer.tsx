import GameBar from "@components/organisms/GameBar";
import {copyText} from "../utils/browser/clipboard";
import {useGameRoomStore} from "../stores/useGameRoomStore";

const GameBarContainer = () => {
    const { currentPlayer, currentRound, timePerRound, totalRound } = useGameRoomStore()
    return (
        <GameBar />
    )
}

export default GameBarContainer