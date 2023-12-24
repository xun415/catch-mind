import {Button, Center, Flex, Text} from "@chakra-ui/react";
import {color} from "@assets/styles/color";

type Props = {
    words: string[]
    isdrawPlayer: boolean
    onSelectWord: (word: string) => void
}
const WordSelector = ({ words, isdrawPlayer, onSelectWord }: Props) => {

    return <Center bg={color.회색} w={'100%'} h={'100%'}>
        {
            isdrawPlayer?
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