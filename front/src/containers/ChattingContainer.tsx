import {Box, Button, Divider, Flex, HStack, Input, VStack} from "@chakra-ui/react";
import {useSocketContext} from "@contexts/socket";
import {ReactNode, useEffect, useState} from "react";
import {Message} from "../types/data";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import { v4 as uuidv4 } from 'uuid';
import {COLOR} from "@assets/styles/color.css";

const ChattingContainer = () => {
    const { socket } = useSocketContext()
    const { id: roomId } = useGameRoomStore()
    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState('')

    const onSendMessage = () => {
        if (socket) {
            socket.emit('guess-answer', {
                roomId,
                answer: userInput
            })
        }
        setUserInput('')
    }

    useEffect(() => {
        if (socket) {
            socket.on('message', (data: Message) => {
                setMessages(prev => ([...prev, data]))
            })
        }
        }
    , [])
    return (
        <Flex
            as={'section'}
            flexDir={'column'}
            justifyContent={'space-between'}
            p={2} border={`2px solid ${COLOR.lightGray}`}
            borderRadius={'xl'} w={'100%'} h={'100%'}
        >
            <VStack gap={2} overflowY={'auto'} h={'100%'}>
                {
                    messages.map((message) => (
                        <Box
                            key={`message_${uuidv4()}_${message.content}`}
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
                <Input placeholder={'message...'} value={userInput} onChange={event => setUserInput(event.target.value)}></Input>
                <Button colorScheme={'green'} onClick={onSendMessage}>Send</Button>
            </Flex>
        </Flex>
    )
}

export default ChattingContainer