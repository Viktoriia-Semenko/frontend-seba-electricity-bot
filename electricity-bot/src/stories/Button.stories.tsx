import { Button } from '../Components/Button/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        title: 'Home',
        type: 'default',
    },
};

export const Inverse: Story = {
    args: {
        title: 'Settings',
        type: 'inverse',
    },
};

export const Disabled: Story = {
    args: {
        title: 'History',
        isDisabled: true,
    },
};
