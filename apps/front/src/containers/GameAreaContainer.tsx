import { useEffect, useState} from "react";
import {useSocketContext} from "@contexts/socket";
import {useStreamContext} from "@contexts/stream";
import {Player, RoomConfig} from "../types/data";
import useUserStore from "../stores/useUserStore";
import {GAME_STATUS} from "../constant/game";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import {room} from "@apis/room";
import GameSection from "@components/ui/GameSection";
import {useSearchParams, useNavigate} from "react-router-dom";

type Props = {
    roomId: string | null
    isRoomHost: boolean
    players: Player[]
    connectedSocketIds: string[]
}

const GameAreaContainer = ({ roomId, isRoomHost, players, connectedSocketIds }: Props) => {
    const navigate = useNavigate()
    const [, setSearchParams] = useSearchParams();
    const { socket } = useSocketContext()
    const {username} = useUserStore()
    const { streamsRef } = useStreamContext()
    // 단어 선택 옵션 (전역 필요성 있음)
    const [wordOptions, setWordOptions] = useState<string[]>([])
    // 현재 플레이어, 게임 상태
    const {drawPlayer, setDrawPlayer, roomConfig, setRoomConfig, gameStatus, setGameStatus, setCurrentRound, setCurrentAnswer, setCurrentAnswerLength } = useGameRoomStore()
    // 현재 플레이 여부
    const isMyTurn = drawPlayer?.username === username
    const userId = players.find(p => p.username === username)?.id
    
    // 게임 설정 변경 시
    const onConfigChange = (newOption: {
        key: keyof RoomConfig,
        value: number
    }) => {
        if (socket) {

            const newConfig = { roomId, ...roomConfig }
            newConfig[newOption.key] = newOption.value
            socket.emit('change-room-config', newConfig)
            setRoomConfig(newConfig)
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
            setCurrentAnswer(selectedWord)
        }
    }

    const onClickLeave = () => {
        navigate('/')
    }

    // 초기 입장 시 방 설정 동기화
    useEffect(() => {
        if (isRoomHost || !roomId) return
        try {
            room(roomId).then((response) => {
                const { maxPlayerNumber, totalRound, timePerRound } = response.data.room
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
                setCurrentRound(1)
            })

            socket.on('select-word', (data: {randomWords: string[]}) => {
                setWordOptions(data.randomWords)
            })

            // 게임 설정 이벤트 시
            socket.on('change-room-config', (data: RoomConfig) => {
                setRoomConfig(data)
            })

            // 게임 시작 시 (단어 선택 완료 후)
            socket.on('game-start', (data: {wordLength: number}) => {
                setGameStatus(GAME_STATUS.게임중)
                setCurrentAnswerLength(data.wordLength)
                /**
                 * todo
                 * game 바에 카운터, 단어(진행자), 단어수 표시
                 */
            })

            socket.on('game-session-end', (data: { nextDrawer: Player, currentRound: number }) => {
                setGameStatus(GAME_STATUS.단어선택중)
                setDrawPlayer(data.nextDrawer)
                setCurrentRound(data.currentRound)
            })
            socket.on('game-end', () => {
                setGameStatus(GAME_STATUS.종료)
            })
            socket.on('set-room-host', () => {
                setSearchParams({ isHost: 'true' })
            })
        }
    }, [])


    // video src에 wetRTC stream 할당
    useEffect(() => {
        connectedSocketIds.forEach(socketId => {
            const mySocketId = players.find(player => player.username === username)?.socketId
            if (socketId !== mySocketId) {
                const videoEL = document.getElementById(`${socketId}-video`) as HTMLVideoElement
                if (streamsRef.current) {
                    videoEL.srcObject = streamsRef.current[socketId]
                }
                videoEL.autoplay = true
            }

        })
    }, [players, connectedSocketIds])

    return (
        <GameSection gameStatus={gameStatus} players={players} drawPlayerId={drawPlayer?.id} userId={userId}>
            <GameSection.GameSetting isRoomHost={isRoomHost} onOptionChange={onConfigChange} roomConfig={roomConfig} onClickStartGame={onClickStartGame} />
            <GameSection.WordSelector isDrawPlayer={isMyTurn} words={wordOptions} onSelectWord={onSelectWord} />
            <GameSection.DrawingCanvas />
            <GameSection.GameResult players={players} onClickLeave={onClickLeave} />
        </GameSection>
    )
}

export default GameAreaContainer