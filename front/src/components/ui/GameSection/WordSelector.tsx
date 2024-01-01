import {Button, Center, Text} from "@chakra-ui/react";

type Props = {
    words: string[]
    isDrawPlayer: boolean
    onSelectWord: (word: string) => void
}
const WordSelector = ({ words, isDrawPlayer, onSelectWord }: Props) => {

    return (
        isDrawPlayer?
            <Center gap={4}>
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
            </Center>
            :
            <Text>단어 선택 중입니다...</Text>
        )
}

export default WordSelector