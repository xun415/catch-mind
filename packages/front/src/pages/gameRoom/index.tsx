import {useSocketContext} from "@contexts/socket";
import { useEffect, useState} from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import {useLocation} from "react-router-dom";
// @ts-ignore
import * as webRTCHandler from "@utils/webRTCHandler";
import GameBarContainer from "../../containers/GameBarContainer";
import PlayerListContainer from "../../containers/PlayerListContainer";
import GameAreaContainer from "../../containers/GameAreaContainer";
import ChattingContainer from "../../containers/ChattingContainer";
import {useStreamContext} from "@contexts/stream";
import {Player} from "../../types/data";
import useUserStore from "../../stores/useUserStore";
import {useNavigate} from "react-router-dom";
import {useGameRoomStore} from "../../stores/useGameRoomStore";
import {SignalData} from "simple-peer";
import {GAME_EVENT} from "@catch-mind/common/constants/socketEvent";


const GameRoomPage = () => {
    const { socket } = useSocketContext()
    const navigate = useNavigate()
    const username = useUserStore(store => store.username)
    const isRoomHost = new URLSearchParams(useLocation().search).get('isHost') === 'true'
    const { streamsRef } = useStreamContext()
    const {players, setPlayers, setId: setRoomId, id: roomId} = useGameRoomStore()
    const [connectedSocketIds, setConnectedSocketIds] = useState<string[]>([])

    useEffect(() => {
        if (socket) {
            // 오디오 접근 및 방 생성 요청
            webRTCHandler.setLocalAudioStream(() => {
                isRoomHost?
                    socket.emit(GAME_EVENT.방_만들기, { username })
                    :
                    socket.emit(GAME_EVENT.방_참여, { username, roomId })
            }, () => {
                alert('오디오 접근에 실패했습니다.')
                navigate('/')
            })

            // 방 생성 성공 시
            socket.on('room-created', (data: {roomId: string}) => {
                const { roomId } = data
                setRoomId(roomId)
            })

            socket.on('conn-signal', (data: {signal: SignalData, connUserSocketId: string}) => {
                webRTCHandler.handleSignalingData(data)
                setConnectedSocketIds(prev => [...prev, data.connUserSocketId])
            })

            // peer 연결 준비 요청 받을 시 (방 입장시 server 에서 이벤트 발생)
            socket.on('conn-prepare', (data: {connUserSocketId: string}) => {
                const { connUserSocketId } = data;

                // peer connection 준비
                webRTCHandler.prepareNewPeerConnection(connUserSocketId, false, (data: {
                    signal: SignalData
                    connUserSocketId: string
                }) => {
                    socket.emit('conn-signal', data)
                }, (stream: MediaStream, connUserSocketId: string) => {
                    if (streamsRef.current) {
                        streamsRef.current![connUserSocketId] = stream
                    }
                })

                // 준비 완료 이벤트 전달
                socket.emit('conn-init', { connUserSocketId })
            })

            socket.on('conn-init', (data: {connUserSocketId: string}) => {
                const { connUserSocketId } = data
                webRTCHandler.prepareNewPeerConnection(connUserSocketId, true, (data: {
                    signal: SignalData
                    connUserSocketId: string
                }) => {
                    socket.emit('conn-signal', data)
                }, (stream: MediaStream, connUserSocketId: string) => {
                    if (streamsRef.current) {
                        streamsRef.current![connUserSocketId] = stream
                        setConnectedSocketIds(prev => [...prev, connUserSocketId])
                    }
                })
            })

            socket.on('player-update', (data: { players: Player[] }) => {
                // 순위에 맞게 정렬
                setPlayers(data.players.sort((a, b) => b.score - a.score))
            })

        }
        return () => {
            if (socket) {
                socket.emit('disconnect')
            }
        }
    },[])

    return (
        <Grid
            minW={'320px'}
            minH={{base: '700px', md: '620px' }}
            gap={2}
            h={'100%'}
            gridTemplateAreas={{
                base: `
                    "bar bar"
                    "canvas canvas"
                    "playerList chatting"
                `,
                md: `
                    "bar bar bar"
                    "playerList canvas chatting"
                    "playerList canvas chatting"
                `
            }}
            gridTemplateRows={'60px 50% 30%'}
            gridTemplateColumns={{
                base: '1fr 1fr',
                md: '1fr 2fr 1fr'
            }}
        >
            <GridItem gridArea={'bar'}>
                <GameBarContainer />
            </GridItem>
            <GridItem gridArea={'playerList'}>
                <PlayerListContainer players={players}/>
            </GridItem>
            <GridItem gridArea={'canvas'}>
                <GameAreaContainer roomId={roomId} isRoomHost={isRoomHost} players={players} connectedSocketIds={connectedSocketIds}/>
            </GridItem>
            <GridItem gridArea={'chatting'}>
                <ChattingContainer />
            </GridItem>
        </Grid>
    )
}

export default GameRoomPage