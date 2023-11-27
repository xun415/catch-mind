import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import { Grid, GridItem } from "@chakra-ui/react";

const GameRoomPage = () => {
    const { socket } = useSocketContext()

    useEffect(() => {
        if (socket) {
            socket.on('dd', data => {

            })
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
            <GridItem gridArea={'bar'}>bar</GridItem>
            <GridItem gridArea={'playerList'} h={100}>playerList</GridItem>
            <GridItem gridArea={'canvas'} h={100}>canvas</GridItem>
            <GridItem gridArea={'chatting'}>chatting</GridItem>
        </Grid>
    )
}

export default GameRoomPage