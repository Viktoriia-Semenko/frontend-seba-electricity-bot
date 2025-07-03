import { Button } from '../Components/Button/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof Button> = {
    title: 'Example/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        title: 'Home',
        type: 'active',
    },
};

export const Inverse: Story = {
    args: {
        title: 'Settings',
        type: 'inactive',
    },
};

export const Disabled: Story = {
    args: {
        title: 'History',
        isDisabled: true,
    },
};
