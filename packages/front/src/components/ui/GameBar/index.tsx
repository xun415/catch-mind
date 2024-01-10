import {Flex, HStack, PinInput, PinInputField, Text} from "@chakra-ui/react";
import {E_GAME_STATUS, GAME_STATUS} from "../../../constant/game";
import {ReactNode} from "react";
import { v4 as uuid } from 'uuid';
import Timer from "@components/ui/Timer";
import {COLOR} from "@assets/styles/color.css";

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
            <Flex h={'100%'} borderRadius={'0 0 20px 20px'} border={`2px solid ${COLOR.lightGray}`} borderTop={0} flexDirection={'column'} alignItems={'center'}>
                <Text>{currentRound} / {totalRound} 라운드</Text>

                <Flex justifyContent={'space-between'} w={'100%'} px={4}>
                    {
                        gameStatus === GAME_STATUS.게임중?
                            <Timer initSeconds={timePerRound} start={gameStatus === GAME_STATUS.게임중} /> as ReactNode : null
                    }
                    {
                        (gameStatus === GAME_STATUS.게임중 && isMyTurn) ?
                            <HStack>
                                <PinInput isDisabled defaultValue={currentAnswer ?? ''} size={'sm'}>
                                    {
                                        Array.from({length:currentAnswer?.length?? 0})
                                            .map((_) =><PinInputField key={uuid()} />) as ReactNode
                                    }
                                </PinInput>
                            </HStack> as ReactNode
                             : null
                    }
                    {
                        (gameStatus === GAME_STATUS.게임중 && !isMyTurn) ?  <HStack>
                            <PinInput isDisabled placeholder={'_'} size={'sm'}>
                                {
                                    Array.from({length: currentAnswerLength??0})
                                        .map((_) => <PinInputField key={uuid()}  />) as ReactNode
                                }
                            </PinInput>
                        </HStack> as ReactNode : null
                    }
                    <div></div>
                </Flex>
            </Flex>
    )
}

export default GameBar