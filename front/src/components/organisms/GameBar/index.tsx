import {Box, Center, Flex, Text} from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";

type Props = {
    currentRound: number | undefined
}

const GameBar = ({ currentRound }: Props) => {

    /**
     * - 라운드, 잔여시간
     * - 단어 영역
     */
    return (
        <Center h={'60px'}  w={'100%'}>
            <Flex w={'90%'} h={'100%'} borderRadius={'0 0 20px 20px'} border={'1px solid black'} borderTop={0} flexDirection={'column'} alignItems={'center'}>
                <Flex alignItems={'center'}>
                    <Text>Game Bar</Text>
                </Flex>
            </Flex>
        </Center>
    )
}

export default GameBar