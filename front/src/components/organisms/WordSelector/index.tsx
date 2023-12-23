import {Button, Center, Flex, Text} from "@chakra-ui/react";
import {color} from "../../../constant/color";

type Props = {
    words: string[]
    isCurrentPlayer: boolean
    onSelectWord: (word: string) => void
}
const WordSelector = ({ words, isCurrentPlayer, onSelectWord }: Props) => {

    return <Center bg={color.회색} w={'100%'} h={'100%'}>
        {
            isCurrentPlayer?
                <Flex gap={4}>
                    <>
                    {
                        words.map(word => (
                            <Button
                                key={'word_select_option'+word}
                                colorScheme={'green'}
                                onClick={() => onSelectWord(word)}>{word}</Button>
                        ))
                    }
                    </>
                </Flex>
                :
                <Text>단어 선택 중입니다...</Text>
        }

    </Center>
}

export default WordSelector