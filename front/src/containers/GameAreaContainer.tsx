import {forwardRef, MutableRefObject, useEffect, useRef} from "react";
import {Stream} from "stream";
import * as webRTCHandler from "../utils/webRTCHandler";
import {useSocketContext} from "@contexts/socket";
import {useStreamContext} from "@contexts/stream";
import {Player} from "../types/data";

type Props = {
    players: Player[]
}
const GameAreaContainer = ({ players }: Props) => {
    const { socket } = useSocketContext()
    const { streamsRef } = useStreamContext()

    useEffect(() => {
        players.forEach(player => {
            const videoEL = document.getElementById(`${player.socketId}-video`) as HTMLVideoElement
            if (streamsRef?.current?.[player.socketId]) {
                // @ts-ignore
                videoEL.srcObject = streamsRef.current?.[player.socketId]
                console.log('streamsRef.current?.[player.socketId]: ', streamsRef.current?.[player.socketId])
            }
        })
    }, [players])
    return (
        <div style={{ width: '1000px', height: '1000px', border: '1px solid black'}}>
            {
                players.map(player => <video key={`${player.socketId}-video`} id={`${player.socketId}-video`} autoPlay width={'100px'} height={'100px'}></video>)
            }
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