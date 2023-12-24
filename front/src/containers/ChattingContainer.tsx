import {Box, VStack} from "@chakra-ui/react";
import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Message} from "../types/data";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import useUserStore from "../stores/useUserStore";

const ChattingContainer = () => {
    const { socket } = useSocketContext()
    const { username } = useUserStore()
    const { id: roomId } = useGameRoomStore()
    const [messages, setMessages] = useState<Message[]>([])

    const onSendMessage = (message: string) => {
        const newMessage: Message = {
            type: 'guess',
            senderName: username,
            content: message
        }

        if (socket) {
            socket.emit('guess-answer', {
                roomId,
                ...newMessage
            })
        }
        setMessages(prev => [...prev, newMessage])
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
        <VStack borderRadius={'1px solid black'} w={'100%'} h={'100%'}>
            <>
            {
                messages.map((message) => (
                    <span>{message.content}</span>
                ))
            }
            </>
        </VStack>
    )
}

export default ChattingContainer