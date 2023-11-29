import {useSocketContext} from "@contexts/socket";
import {useEffect, useRef, useState} from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import {useLocation} from "react-router-dom";
import * as webRTCHandler from "../../utils/webRTCHandler";
import {useUserContext} from "@contexts/user/UserContext";
import {Stream} from "stream";
import GameBarContainer from "../../containers/GameBarContainer";

const GameRoomPage = () => {
    const { socket } = useSocketContext()
    const { username } = useUserContext()
    const isRoomHost = new URLSearchParams(useLocation().search).get('isHost') === 'true'
    const [roomId, setRoomId] = useState<string | undefined>(new URLSearchParams(useLocation().search).get('id')?? undefined)
    const playersStreamRefs = useRef<Map<string, Stream>>(new Map())

    console.log(isRoomHost)

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
                console.log('[방 생성 성공] 방 아이디: ', data)
                const { roomId } = data
                setRoomId(roomId)
            })

            // peer 연결 준비 요청 받을 시 (방 입장시 server 에서 이벤트 발생)
            socket.on('conn-prepare', (data: {connUserSocketId: string}) => {
                console.log('[conn-prepare] ', data)
                const { connUserSocketId } = data;

                // peer connection 준비
                webRTCHandler.prepareNewPeerConnection(connUserSocketId, false, (data) => {
                    socket.emit('conn-signal', data)
                }, (stream, connUserSocketId) => {
                    playersStreamRefs.current.set(connUserSocketId, stream)
                })

                // 준비 완료 이벤트 전달
                socket.emit('conn-init', { connUserSocketId })
            })

            socket.on('conn-signal', data => {
                webRTCHandler.handleSignalingData(data)
            })
        }
        return () => {
            if (socket) {
                socket.emit('disconnect')
            }
        }
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
            {
                Array.from(playersStreamRefs.current?.keys()).map(key => {
                    console.log(playersStreamRefs.current.get(key))
                })
            }
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
                <GridItem gridArea={'playerList'} h={100}>playerList</GridItem>
                <GridItem gridArea={'canvas'} h={100}>canvas</GridItem>
                <GridItem gridArea={'chatting'}>chatting</GridItem>
            </Grid>
        </>
    )
}

export default GameRoomPage