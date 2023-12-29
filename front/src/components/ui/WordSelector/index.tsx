import {Button, Center, Flex, Text} from "@chakra-ui/react";
import {COLOR} from "@assets/styles/color.css";

type Props = {
    words: string[]
    isDrawPlayer: boolean
    onSelectWord: (word: string) => void
}
const WordSelector = ({ words, isDrawPlayer, onSelectWord }: Props) => {

    return <Center bg={COLOR.lightGray} w={'100%'} h={'100%'} borderRadius={'xl'}>
        {
            isDrawPlayer?
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