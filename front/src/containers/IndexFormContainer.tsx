import IndexForm from "@components/organisms/IndexForm";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "@contexts/user/UserContext";

const IndexFormContainer = () => {
    let navigate = useNavigate()
    const { setNickname } = useUserContext()

    // 방 참여하기 로직
    const joinRoomHandler = (nickname: string) => {
        setNickname(nickname)
        console.log('[joinRoomHandler]')
        // todo: 방 코드 입력
        // navigate('/gameSetting')
    }

    // 방 만들기 로직
    const createRoomHandler = (nickname: string) => {
        console.log('[createRoomHandler]')
        setNickname(nickname)
        navigate('/gameSetting?isHost=true')
    }

    return (
        <IndexForm joinRoomHandler={joinRoomHandler} createRoomHandler={createRoomHandler} />
    )
}

export default IndexFormContainer