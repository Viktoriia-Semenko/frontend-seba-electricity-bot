import { ActionButton } from '../Components/ActionButton/ActionButton.tsx';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const meta: Meta<typeof ActionButton> = {
    title: 'Example/ActionButton',
    component: ActionButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        title: 'Add',
        isDisabled: false,
        onClick: fn(() => alert('Device clicked!'))
    },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Edit: Story = {
    args: {
        title: 'Edit'
    },
};

export const Save: Story = {
    args: {
        title: 'Save'
    },
};

export const Add: Story = {
    args: {
        title: 'Add'
    },
};

export const Disabled: Story = {
    args: {
        title: 'Delete',
        isDisabled: true
    },
};
