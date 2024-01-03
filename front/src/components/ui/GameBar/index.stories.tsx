import GameBar from './index'
import {Meta, StoryObj} from "@storybook/react";
import {GAME_STATUS} from "../../../constant/game";

const meta: Meta<typeof GameBar> = {
    title: 'ui/GameBar',
    id: 'GameBarStories',
    component: GameBar,
    argTypes: {
        isMyTurn: { type: 'boolean', defaultValue: false, description: '현재 drawingPlayer 여부' },
        currentRound: { type: 'number' },
        totalRound: { type: 'number' },
        gameStatus: { options: Object.values(GAME_STATUS), control: { type: 'select' } },
        timePerRound: { type: 'number' },
        // 내 차례이고, 게임중일때 표시 (storybook multi-condition 미지원으로 1개 조건 부여)
        currentAnswer: { if: { arg: 'gameStatus', eq: GAME_STATUS.게임중 }, type: "string" },
        // 내 차례가 아니고, 게임중일때 표시
        currentAnswerLength: { if: { arg: 'gameStatus', eq: GAME_STATUS.게임중 } , type: 'number' },
    }
}

export default meta

type Story = StoryObj<typeof GameBar>

export const OnGameMyTurn: Story = {
    args: {
        gameStatus: GAME_STATUS.게임중,
        timePerRound: 180,
        currentRound: 1,
        totalRound: 3,
        isMyTurn: true,
        currentAnswer: '나비',
    }
}

export const OnGameNotMyTurn: Story = {
    args: {
        gameStatus: GAME_STATUS.게임중,
        timePerRound: 180,
        currentRound: 1,
        totalRound: 3,
        isMyTurn: false,
        currentAnswerLength: 3
    },
}