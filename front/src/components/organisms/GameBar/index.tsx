import {Box, Center, Flex, Text} from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";

type Props = {
    roomId: string | undefined
    onClickCopyRoomId: () => void
    currentRound: number | undefined
}

const GameBar = ({ roomId, onClickCopyRoomId }: Props) => {
    /**
     * - 방아이디
     * - 라운드, 잔여시간
     * - 단어 영역
     */
    return (
        <Center>
            <Flex w={'90%'} borderRadius={'0 0 20px 20px'} border={'1px solid black'} borderTop={'0'} flexDirection={'column'} alignItems={'center'}>
                <Flex alignItems={'center'}>
                    <Text>RoomId: {roomId ?? ''}</Text>
                    <>
                        {roomId? <AiOutlineCopy onClick={onClickCopyRoomId}/> : null}
                    </>
                </Flex>
            </Flex>
        </Center>
    )
}

export default GameBar