import type { Meta, StoryObj } from "@storybook/react";
import Timer from "@components/ui/Timer/index";
import {useEffect, useState} from "react";
import {Button} from "@chakra-ui/react";

const meta: Meta<typeof Timer> = {
    component: Timer,
    title: 'ui/Timer',
    argTypes: {
        initSeconds: {
            control: 'number',
            description: '타이머 초기 시작 시간',
            defaultValue: 180
        },
        start: {
            control: 'boolean',
            description: '타이머 시작 여부',
            defaultValue: false
        }
    }
}

export default meta;

type Story = StoryObj<typeof Timer>

export const Default: Story = {
    render: (args) => {
        const { start } = args
        const [isStarted, setIsStarted] = useState(start)
        useEffect(() => {
            setIsStarted(start)
        }, [start]);

        return (
            <div>
                start: {String(isStarted)} <Button onClick={() => setIsStarted(prev => !prev)}>{isStarted? '정지': '시작'}</Button>
                <Timer key={args.initSeconds} {...args} />
            </div>
        )
    }
}


