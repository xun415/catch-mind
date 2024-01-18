import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Message} from "../types/data";
import {useGameRoomStore} from "../stores/useGameRoomStore";
import ChatSection from "@components/ui/ChatSection";

const ChattingContainer = () => {
    const { socket } = useSocketContext()
    const { id: roomId } = useGameRoomStore()
    const [messages, setMessages] = useState<Message[]>([])

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
        <ChatSection messages={messages} onSendMessage={onSendMessage} />
    )
}

export default ChattingContainer