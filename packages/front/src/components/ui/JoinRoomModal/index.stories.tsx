import {Meta, StoryObj} from "@storybook/react";
import JoinRoomModal from "./index";
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof JoinRoomModal> = {
    component: JoinRoomModal,
    title: 'ui/JoinRoomModal',
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: '모달 표시 여부'
        },
        errorMessage: {
            control: 'text',
            description: '에러 메세지'
        },

    }
}

export default meta;

type Story = StoryObj<typeof JoinRoomModal>

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: action('onClose'),
        onSubmitRoomId: action('onSubmitRoomId'),
        onChangeInputValue: action('onChangeInputValue'),
    }
}

export const WithErrorMessage: Story = {
    args: {
        ...Default.args,
        errorMessage: 'This is an error message',
    }
}
