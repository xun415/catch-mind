import {Box, Center, Flex, HStack, PinInput, PinInputField, Text} from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import {E_GAME_STATUS, GAME_STATUS} from "../../../constant/game";
import {ReactNode, useEffect, useState} from "react";
import Timer from "@components/ui/Timer";

type Props = {
    isMyTurn: boolean
    currentRound: number
    totalRound: number
    gameStatus: E_GAME_STATUS
    timePerRound: number
    currentAnswer: string | null
    currentAnswerLength: number | null
}


const GameBar = ({ isMyTurn, currentRound, totalRound, timePerRound, gameStatus, currentAnswer, currentAnswerLength }: Props) => {
    /**
     * - 라운드, 잔여시간
     * - 단어 영역
     */
    return (
        <Center h={'60px'}  w={'100%'}>
            <Flex w={'90%'} h={'100%'} borderRadius={'0 0 20px 20px'} border={'1px solid black'} borderTop={0} flexDirection={'column'} alignItems={'center'}>
                <Flex alignItems={'center'}>
                    <>
                        {
                            gameStatus === GAME_STATUS.게임중? <Timer initSeconds={timePerRound} start={gameStatus === GAME_STATUS.게임중} /> : null
                        }
                    </>
                    <div>{currentRound} / {totalRound} 라운드</div>
                    <>
                        {
                            (gameStatus === GAME_STATUS.게임중 && isMyTurn) ?
                                <HStack>
                                    <PinInput isDisabled defaultValue={currentAnswer ?? ''}>
                                        {
                                            Array.from({length:currentAnswer?.length?? 0})
                                                .map(v =><PinInputField />) as ReactNode
                                        }
                                    </PinInput>
                                </HStack>
                                 : null
                        }
                        {
                            (gameStatus === GAME_STATUS.게임중 && !isMyTurn) ?  <HStack>
                                <PinInput isDisabled placeholder={'_'}>
                                    {
                                        Array.from({length: currentAnswerLength??0})
                                            .map(_ => <PinInputField />) as ReactNode
                                    }
                                </PinInput>
                            </HStack> : null
                        }
                    </>
                </Flex>
            </Flex>
        </Center>
    )
}

export default GameBar