import IndexForm from "@components/organisms/IndexForm";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "@contexts/user/UserContext";
import {useState} from "react";
import JoinRoomModal from "@components/organisms/JoinRoomModal";
import {getIsRoomFull} from "@apis/room";
import {AxiosError} from "axios";
import useUserStore from "../stores/useUserStore";

const IndexFormContainer = () => {
    let navigate = useNavigate()
    const setUsername = useUserStore(store => store.setUsername)
    const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false)
    const [joinRoomErrorMessage, setJoinRoomErrorMessage] = useState('')

    // 방 참여하기 로직
    const onSubmitJoinRoom = (nickname: string) => {
        console.log('[onSubmitJoinRoom]')
        setUsername(nickname)

        // 방 코드 입력 모달 표시
        setIsJoinRoomModalOpen(true)
    }

    // 참여할 방 코드 제출 시
    const onSubmitRoomId = async (roomId: string) => {
        console.log(roomId)

        try {
            const result = await getIsRoomFull(roomId)
            console.log(result)
            if (result.data.isFull) {
                setJoinRoomErrorMessage('최대 인원을 초과하였습니다.')
            } else {
                navigate(`/gameRoom?id=${roomId}`)
            }
        } catch (e) {
            if (e instanceof AxiosError && e.response.status === 404) {
                setJoinRoomErrorMessage('해당 게임방을 찾을 수 없습니다.')
            }
        }



        // navigate('/gameSetting')
    }

    // 룸아이디 에러 메세지 초기화
    const onChangeRoomIdInputValue = () => {
        if (joinRoomErrorMessage !== '') {
            setJoinRoomErrorMessage('')
        }
    }

    // 방 만들기 로직
    const onSubmitCreateRoom = (nickname: string) => {
        console.log('[onSubmitCreateRoom]')
        setUsername(nickname)
        navigate('/gameRoom?isHost=true')
    }



    return (
        <>
            <IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />
            <JoinRoomModal
                isOpen={isJoinRoomModalOpen}
                onClose={() => setIsJoinRoomModalOpen(false)}
                errorMessage={joinRoomErrorMessage}
                onSubmitRoomId={onSubmitRoomId}
                onChangeInputValue={onChangeRoomIdInputValue}
            />
        </>
    )
}

export default IndexFormContainer