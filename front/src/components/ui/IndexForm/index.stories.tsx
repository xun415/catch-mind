import {Meta, StoryObj} from "@storybook/react";
import IndexForm from './index'

const meta: Meta<typeof IndexForm> = {
    component: IndexForm,
    title: 'ui/IndexForm'
}

export default meta

type Story = StoryObj<typeof IndexForm>

export const Default: Story = {}