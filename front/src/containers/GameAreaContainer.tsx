import {useEffect, useState} from "react";
import {useSocketContext} from "@contexts/socket";
import {useStreamContext} from "@contexts/stream";
import {Player, RoomConfig} from "../types/data";
import useUserStore from "../stores/useUserStore";
import DrawingArea from "@components/organisms/DrawingArea";
import {Center, VStack} from "@chakra-ui/react";
import GameSetting from "@components/organisms/GameSetting";
import {GAME_STATUS} from "../constant/game";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import {css} from "@emotion/react";
import WordSelector from "@components/organisms/WordSelector";
import GameBar from "@components/organisms/GameBar";
import {room} from "@apis/room";

const initRoomConfig = {
    totalRound: 3,
    maxPlayerNumber: 4,
    timePerRound: 120
}

type Props = {
    roomId?: string
    isRoomHost: boolean
    players: Player[]
    connectedSocketIds: string[]
}

const GameAreaContainer = ({ roomId, isRoomHost, players, connectedSocketIds }: Props) => {
    const { socket } = useSocketContext()
    const username = useUserStore(store => store.username)
    const { streamsRef } = useStreamContext()
    // 게임방 설정
    const [roomConfig, setRoomConfig] = useState(initRoomConfig)
    // 게임방 상태
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.설정중)
    // 단어 선택 옵션 (전역 필요성 있음)
    const [wordOptions, setWordOptions] = useState([])
    // 현재 플레이어
    const {drawPlayer, setDrawPlayer } = useGameRoomStore()
    // 현재 플레이 여부
    const isMyTurn = drawPlayer?.username === username
    
    // 게임 설정 변경 시
    const onConfigChange = (newOption) => {
        if (socket) {

        setRoomConfig(prev => {
            const newConfig = {roomId, ...prev}
            newConfig[newOption.key] = newOption.value
            socket.emit('change-room-config', newConfig)

            return newConfig
        })
        }
    }

    // host 게임 시작 버튼 클릭 시
    const onClickStartGame = () => {
        if (players?.length < 2) {
            alert('참가 인원은 2명 이상이어야 합니다.')
            return;
        }
        if (socket) {
            socket.emit('finish-config', roomId)
        }
    }

    // 단어 선택지 중 선택 시
    const onSelectWord = (selectedWord: string) => {
        if (socket) {
            socket.emit('select-word', { roomId, selectedWord })
        }
    }

    // 초기 입장 시 방 설정 동기화
    useEffect(() => {
        if (isRoomHost || !roomId) return
        try {
            room(roomId).then((response) => {
                console.log(response.data.room)
                const { maxPlayerNumber, totalRound, timePerRound } = response.data.room
                console.log('[setRoomConfig] ', maxPlayerNumber, totalRound, timePerRound)
                setRoomConfig({maxPlayerNumber, totalRound, timePerRound})
            }).catch(e => e)
        } catch (e) {

        }

    }, [])
    // socket event 핸들러 등록
    useEffect(() => {
        if (socket) {
            // 게임 시작 이벤트 시
            socket.on('finish-config', (data: Player) => {
                setGameStatus(GAME_STATUS.단어선택중)
                setDrawPlayer(data)
            })

            socket.on('select-word', (data: {randomWords: string[]}) => {
                setWordOptions(data.randomWords)
            })

            // 게임 설정 이벤트 시
            socket.on('change-room-config', (data: RoomConfig) => {
                setRoomConfig(data)
            })

            // 게임 시작 시 (단어 선택 완료 후)
            socket.on('game-start', data => {
                setGameStatus(GAME_STATUS.게임중)
                /**
                 * todo
                 * game 바에 카운터, 단어(진행자), 단어수 표시
                 */
            })

            socket.on('game-session-end', (nextDrawer: Player) => {
                setGameStatus(GAME_STATUS.단어선택중)
                setDrawPlayer(nextDrawer)
                console.log('[game-session-end]')
            })
        }
    }, [])

    useEffect(() => {
        console.log('drawPlayer: ', drawPlayer)
    }, [drawPlayer])

    useEffect(() => {
        console.log('isMyTurn: ', isMyTurn)
    }, [isMyTurn])


    // video src에 wetRTC stream 할당
    useEffect(() => {
        connectedSocketIds.forEach(socketId => {
            const mySocketId = players.find(player => player.username === username).socketId
            if (socketId !== mySocketId) {
                const videoEL = document.getElementById(`${socketId}-video`) as HTMLVideoElement
                if (streamsRef.current) {
                    videoEL.srcObject = streamsRef.current[socketId]
                }
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
                gameStatus === GAME_STATUS.설정중 ?
                    <GameSetting isRoomHost={isRoomHost} onOptionChange={onConfigChange} roomConfig={roomConfig} onClickStartGame={onClickStartGame}/>
                    : null
            }
            {
                gameStatus === GAME_STATUS.단어선택중? <WordSelector isdrawPlayer={isMyTurn} words={wordOptions} onSelectWord={onSelectWord} />: null
            }
            {
                (gameStatus === GAME_STATUS.게임중 && isMyTurn) ? <DrawingArea />: null
            }
            {/* 플레이어 비디오(음성, 캔버스) */}
            {
                players
                    .filter(player => player.username !== username)
                    .map(player =>
                        <video
                            width={'400px'}
                            height={'400px'}
                            hidden={player.socketId !== drawPlayer?.socketId}
                            key={`${player.socketId}-video`}
                            id={`${player.socketId}-video`}
                            autoPlay

                        />
                    )
            }
        </Center>
    )
}

export default GameAreaContainer