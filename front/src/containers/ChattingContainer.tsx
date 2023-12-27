import {Box, Button, Flex, Input, VStack} from "@chakra-ui/react";
import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Message} from "../types/data";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import useUserStore from "../stores/useUserStore";
import dayjs from "dayjs";

const ChattingContainer = () => {
    const { socket } = useSocketContext()
    const { id: roomId } = useGameRoomStore()
    const [messages, setMessages] = useState<Message[]>([])
    const [userInput, setUserInput] = useState('')

    const onSendMessage = (message: string) => {
        if (socket) {
            socket.emit('guess-answer', {
                roomId,
                answer: message
            })
        }
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
        <Flex flexDir={'column'} justifyContent={'space-between'} p={2} borderRadius={'1px solid black'} w={'100%'} h={'100%'}>
            <Box>
            {
                messages.map((message) => (
                    <div key={`message_${dayjs()}_${message.content}`}>{message.content}</div>
                ))
            }
            </Box>
            <Flex gap={1}>
                <Input value={userInput} onChange={event => setUserInput(event.target.value)}></Input>
                <Button onClick={() => {
                    onSendMessage(userInput)
                    setUserInput('')
                }}>제출</Button>
            </Flex>
        </Flex>
    )
}

export default ChattingContainer