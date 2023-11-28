import IndexForm from "@components/organisms/IndexForm";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "@contexts/user/UserContext";
import {useState} from "react";
import JoinRoomModal from "@components/organisms/JoinRoomModal";

const IndexFormContainer = () => {
    let navigate = useNavigate()
    const { setUsername } = useUserContext()
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
    const onSubmitRoomId = (roomId: string) => {
        /**
         * todo: 유효한 방 여부 api 확인
         *
         * 유효하면 세팅페이지로 이동, 에러시 에러 메세지 세팅
          */
        console.log('roomId: ', roomId)
        setJoinRoomErrorMessage('없다')
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