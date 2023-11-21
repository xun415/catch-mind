import IndexForm from "@components/organisms/IndexForm";
import {useSocketContext} from "@contexts/socket";

const IndexFormContainer = () => {
    const { socket } = useSocketContext()

    const joinRoomHandler = (nickname: string) => {
        // 방 참여하기 로직
        console.log('[joinRoomHandler] nickname: ', nickname)
    }

    const createRoomHandler = (nickname: string) => {
        // 방 만들기 로직
        console.log('[createRoomHandler] nickname: ', nickname)
    }

    return (
        <IndexForm joinRoomHandler={joinRoomHandler} createRoomHandler={createRoomHandler} />
    )
}

export default IndexFormContainer