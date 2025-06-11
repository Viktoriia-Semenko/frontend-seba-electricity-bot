import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginForm } from '../Components/LoginForm/LoginForm.tsx';

const meta = {
    title: 'Example/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};