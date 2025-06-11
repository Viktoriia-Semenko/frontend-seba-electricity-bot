import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginForm } from '../Components/LoginForm/LoginForm.tsx';

const meta = {
    title: 'Example/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        isDisabled: false,
        registerUrl: "#"
    }
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    args: {
        onSub: () => {},
        isDisabled: false,
        registerUrl: "#"
    }
};