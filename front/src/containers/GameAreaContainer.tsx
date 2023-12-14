import {forwardRef, MutableRefObject, useEffect, useRef} from "react";
import {Stream} from "stream";
import * as webRTCHandler from "../utils/webRTCHandler";
import {useSocketContext} from "@contexts/socket";
import {useStreamContext} from "@contexts/stream";
import {Player} from "../types/data";
import useUserStore from "../stores/useUserStore";
import DrawingArea from "@components/organisms/DrawingArea";

type Props = {
    players: Player[]
    connectedSocketIds: string[]
}
const GameAreaContainer = ({ players,connectedSocketIds }: Props) => {
    const { socket } = useSocketContext()
    const username = useUserStore(store => store.username)
    const { streamsRef } = useStreamContext()

    useEffect(() => {
        connectedSocketIds.forEach(socketId => {
            const mySocketId = players.find(player => player.username === username).socketId
            if (socketId !== mySocketId) {
                const videoEL = document.getElementById(`${socketId}-video`) as HTMLVideoElement
                videoEL.srcObject = streamsRef.current![socketId]
                videoEL.autoplay = true
            }

        })
        // players.forEach(player => {
        //     // 본인 제외
        //     if (player.username === username) {
        //         return;
        //     }
        //     console.log('player:', player)
        //     const videoEL = document.getElementById(`${player.socketId}-video`) as HTMLVideoElement
        //     const streamMap = streamsRef.current
        //     if (streamsRef?.current?.[player.socketId]) {
        //         console.log(`${player.socketId} stream: `, streamsRef.current?.[player.socketId])
        //
        //         // @ts-ignore
        //         videoEL.srcObject = streamsRef.current[player.socketId]
        //         videoEL.autoplay = true
        //     }
        // })
    }, [players, connectedSocketIds])


    return (
        <div style={{ width: '1000px', height: '1000px', border: '1px solid black'}}>
            {
                players
                    .filter(player => player.username !== username)
                    .map(player =>
                        <video key={`${player.socketId}-video`} id={`${player.socketId}-video`} autoPlay width={'800px'} height={'800px'}></video>)
            }
            <DrawingArea />
            {/*{*/}
            {/*    streamsRef.current && Object.keys(streamsRef.current)?.map(playerSocketId => {*/}
            {/*        const stream = streamsRef?.current?.[playerSocketId]*/}
            {/*        return (*/}
            {/*            <video id={`${playerSocketId}-video`} autoPlay srcObject={stream} width={'100px'} height={'100px'}></video>*/}
            {/*        )*/}
            {/*    })*/}
            {/*}*/}

        </div>
    )
}

export default GameAreaContainer