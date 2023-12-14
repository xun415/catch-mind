import {useSocketContext} from "@contexts/socket";
import { useEffect, useState} from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import {useLocation} from "react-router-dom";
import * as webRTCHandler from "../../utils/webRTCHandler";
import GameBarContainer from "../../containers/GameBarContainer";
import PlayerListContainer from "../../containers/PlayerListContainer";
import GameAreaContainer from "../../containers/GameAreaContainer";
import ChattingContainer from "../../containers/ChattingContainer";
import {useStreamContext} from "@contexts/stream";
import {Player} from "../../types/data";
import useUserStore from "../../stores/useUserStore";

const GameRoomPage = () => {
    const { socket } = useSocketContext()
    const username = useUserStore(store => store.username)
    const isRoomHost = new URLSearchParams(useLocation().search).get('isHost') === 'true'
    const [roomId, setRoomId] = useState<string | undefined>(new URLSearchParams(useLocation().search).get('id')?? undefined)
    const { streamsRef } = useStreamContext()
    const [players, setPlayers] = useState<Player[]>([])
    const [connectedSocketIds, setConnectedSocketIds] = useState<string[]>([])

    useEffect(() => {
        if (socket) {
            // 오디오 접근 및 방 생성 요청
            webRTCHandler.setLocalAudioStream(() => {
                isRoomHost?
                    socket.emit('create-new-room', { username })
                    :
                    socket.emit('join-room', { username, roomId })
            }, () => {
                alert('오디오 접근에 실패했습니다.')
            })

            // 방 생성 성공 시
            socket.on('room-created', (data: {roomId: string}) => {
                const { roomId } = data
                setRoomId(roomId)
            })



            socket.on('conn-signal', data => {
                webRTCHandler.handleSignalingData(data)
                setConnectedSocketIds(prev => [...prev, data.connUserSocketId])
            })

            // peer 연결 준비 요청 받을 시 (방 입장시 server 에서 이벤트 발생)
            socket.on('conn-prepare', (data: {connUserSocketId: string}) => {
                const { connUserSocketId } = data;

                // peer connection 준비
                webRTCHandler.prepareNewPeerConnection(connUserSocketId, false, (data) => {
                    socket.emit('conn-signal', data)
                }, (stream, connUserSocketId) => {
                    if (streamsRef.current) {
                        streamsRef.current[connUserSocketId] = stream
                    }
                })

                // 준비 완료 이벤트 전달
                socket.emit('conn-init', { connUserSocketId })
            })

            socket.on('conn-init', (data: {connUserSocketId: string}) => {
                const { connUserSocketId } = data
                webRTCHandler.prepareNewPeerConnection(connUserSocketId, true, (data) => {
                    socket.emit('conn-signal', data)
                }, (stream, connUserSocketId) => {
                    if (streamsRef.current) {
                        streamsRef.current[connUserSocketId] = stream
                        setConnectedSocketIds(prev => [...prev, connUserSocketId])
                    }
                })
            })

            socket.on('player-update', (data: { players: Player[] }) => {
                // 순위에 맞게 정렬
                setPlayers(data.players.sort((a, b) => b.score - a.score))
            })

        }
        // return () => {
        //     if (socket) {
        //         socket.emit('disconnect')
        //     }
        // }
    },[])

    /**
     * todo
     *
     * 유저 목록
     * 게임 세팅 & 캔버스 영역
     * 이벤트 & 채팅 영역
     *
     * - webRTC peer stream 위치 고려 (캔버스 영역의 스트림와, 음성)
     */
    return (
        <>
            <Grid
                border={'1px solid black'}
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
                gridTemplateRows={{
                    base: '48px 50vh 30vh',
                    md: '48px min-content min-content'
                }}
                gridTemplateColumns={{
                    base: '1fr 1fr',
                    md: 'min-content auto 300px'
                }}
            >
                <GridItem gridArea={'bar'}>
                    <GameBarContainer roomId={roomId} />
                </GridItem>
                <GridItem gridArea={'playerList'} h={100}>
                    <PlayerListContainer players={players}/>
                </GridItem>
                <GridItem gridArea={'canvas'} h={100}>
                    <GameAreaContainer players={players} connectedSocketIds={connectedSocketIds}/>
                </GridItem>
                <GridItem gridArea={'chatting'}>
                    <ChattingContainer />
                </GridItem>
            </Grid>
        </>
    )
}

export default GameRoomPage