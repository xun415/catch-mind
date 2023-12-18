import {useEffect, useState} from "react";
import {useSocketContext} from "@contexts/socket";
import {useStreamContext} from "@contexts/stream";
import {Player, RoomConfig} from "../types/data";
import useUserStore from "../stores/useUserStore";
import DrawingArea from "@components/organisms/DrawingArea";
import {Center} from "@chakra-ui/react";
import GameSetting from "@components/organisms/GameSetting";
import {GAME_STATUS} from "../constant/game";
import {useGameRoomStore} from "../stores/useGameRoomStore";

const initRoomConfig = {
    totalRound: 3,
    maxPlayerNumber: 4,
    timePerRound: 120
}



type Props = {
    isRoomHost: boolean
    players: Player[]
    connectedSocketIds: string[]
}
const GameAreaContainer = ({ isRoomHost, players,connectedSocketIds }: Props) => {
    const { socket } = useSocketContext()
    const username = useUserStore(store => store.username)
    const { streamsRef } = useStreamContext()
    // 게임방 설정
    const [roomConfig, setRoomConfig] = useState(initRoomConfig)
    // 게임방 상태
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.설정중)

    // 게임 설정 변경 시
    const onConfigChange = (newOption) => {
        if (socket) {
            socket.emit('change-room-config', newOption)
        }
        setRoomConfig(prev => {
            const newConfig = { ...prev }
            newConfig[newOption.key] = newOption.value

            return newConfig
        })
    }

    // host 게임 시작 버튼 클릭 시
    const onClickStartGame = () => {
        if (socket) {
            socket.emit('start-game')
        }
    }

    useEffect(() => {
        if (socket) {
            // 게임 시작 이벤트 시
            socket.on('start-game', () => {
                setGameStatus(GAME_STATUS.단어선택중)
            })

            // 게임 설정 이벤트 시
            socket.on('change-room-config', (data: RoomConfig) => {
                setRoomConfig(data)
            })
        }
    }, [])

    useEffect(() => {
        connectedSocketIds.forEach(socketId => {
            const mySocketId = players.find(player => player.username === username).socketId
            if (socketId !== mySocketId) {
                const videoEL = document.getElementById(`${socketId}-video`) as HTMLVideoElement
                videoEL.srcObject = streamsRef.current![socketId]
                videoEL.autoplay = true
            }

        })
    }, [players, connectedSocketIds])

    /**
     * todo
     * [step1] 게임 설정
     *
     * [step2] 게임중
     * 차례에 맞는 화면 보여줌.
     * 본인 차례일 경우 DrawingArea 노출
     * 본인 차례 아닐 시 진행중인 플레이어의 비디오 노출 (그 외는 audio만 재생되도록)
     *
     * [step3] 게임 종료
     * 등수 노출
     */

    return (
        <Center h={'full'}>
            {
                players
                    .filter(player => player.username !== username)
                    .map(player =>
                        <video key={`${player.socketId}-video`} id={`${player.socketId}-video`} autoPlay width={'800px'} height={'800px'}></video>)
            }
            {/*<DrawingArea />*/}
            {
                gameStatus === GAME_STATUS.설정중 ?
                    <GameSetting isRoomHost={isRoomHost} onOptionChange={onConfigChange} roomConfig={roomConfig} onClickStartGame={onClickStartGame}/>
                    : null
            }
            {
                (gameStatus === GAME_STATUS.게임중)
            }


        </Center>
    )
}

export default GameAreaContainer