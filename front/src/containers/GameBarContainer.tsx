import GameBar from "@components/organisms/GameBar";
import {copyText} from "../utils/browser/clipboard";

type Props = {
    roomId: string | undefined
}
const GameBarContainer = ({ roomId }: Props) => {

    const onClickCopyRoomId = () => {
        // copy to clipboard
        roomId? copyText(roomId, () => {
            alert('방 아이디가 복사되었습니다.')
        }, () => {
            alert('지원하지 않는 브라우저 입니다.')
        }) : undefined

    }
    return (
        <GameBar roomId={roomId} onClickCopyRoomId={onClickCopyRoomId}/>
    )
}

export default GameBarContainer