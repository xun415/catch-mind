import {Box, Button, Divider, Flex, Input, VStack} from "@chakra-ui/react";
import {COLOR} from "@assets/styles/color.css";
import {v4 as uuidv4} from "uuid";
import {ReactNode, useEffect, useRef, useState} from "react";
import {Message} from "../../../types/data";

type Props = {
    messages: Message[]
    onSendMessage: (value: string) => void
}

const ChatSection = ({ messages, onSendMessage }: Props) => {
    const messageWrapRef = useRef<HTMLDivElement | null>(null)
    const [userInput, setUserInput] = useState('')
    const onSend = () => {
        onSendMessage(userInput)
        setUserInput('')
    }

    // 메세지 추가 시 스크롤 최하단 이동
    useEffect(() => {
        if (messageWrapRef.current) {
            messageWrapRef.current!.scrollTop = messageWrapRef.current!.scrollHeight
        }
    }, [messages])

    return (
        <Flex
            as={'section'}
            flexDir={'column'}
            justifyContent={'space-between'}
            p={2} border={`2px solid ${COLOR.lightGray}`}
            borderRadius={'xl'} w={'100%'} h={'100%'}
        >
            <VStack ref={messageWrapRef} gap={2} overflowY={'auto'} h={'100%'}>
                {
                    messages.map((message) => (
                        <Box
                            key={uuidv4()}
                            p={2} borderRadius={'md'} bg={COLOR.lightGray}
                            w={'full'}
                            textAlign={message.type === 'notice' ? 'center': 'left'}
                        >
                            <p>{message.type !=='notice' && `${message.senderName}:`} {message.content}</p>
                        </Box>
                    )) as ReactNode
                }
            </VStack>
            <Divider />
            <Flex gap={1} mt={2}>
                <Input
                    placeholder={'message...'}
                    value={userInput}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            event.preventDefault()
                            onSend()
                        }
                    }}
                    onChange={event => setUserInput(event.target.value)}
                />
                <Button colorScheme={'green'} onClick={onSend}>Send</Button>
            </Flex>
        </Flex>
    )
}

export default ChatSection