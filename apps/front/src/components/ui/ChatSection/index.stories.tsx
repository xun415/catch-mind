import {Meta, StoryObj} from "@storybook/react";
import ChatSection from "./index";
import {useState} from "react";
import {Message} from "../../../types/data";

const meta: Meta<typeof ChatSection> = {
    component: ChatSection,
    title: 'ui/ChatSection'
}

export default meta

type Story = StoryObj<typeof ChatSection>

export const withWrapper: Story = {
    render: () => {
        const [messages, setMessages] = useState<Message[]>([])
        const onSendMessage = (message: string) => {
            const newMessage: Message = {
                senderName: 'sender',
                type: 'guess',
                content: message
            }
            setMessages(prev => [...prev, newMessage])
        }
        return (
            <ChatSection messages={messages} onSendMessage={onSendMessage} />
        )
    }
}