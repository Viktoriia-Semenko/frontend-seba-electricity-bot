import { SignButton } from '../Components/SignButton/SignButton.tsx';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta: Meta<typeof SignButton> = {
    title: 'Example/SignButton',
    component: SignButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        title: 'Add',
        isDisabled: false,
        onClick: fn(() => alert('Register/Login clicked'))
    },
};

export default meta;
type Story = StoryObj<typeof SignButton>;

export const SignIn: Story = {
    args: {
        title: 'Sign In'
    },
};

export const SignUp: Story = {
    args: {
        title: 'Continue'
    },
};