import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { StatusCard } from '../Components/StatusCard/StatusCard.tsx';

const meta = {
    title: 'Example/StatusCard',
    component: StatusCard,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {
        status: 'ON',
        timestamp: new Date().toISOString(),
        onClick: fn(() => alert('Status clicked!'))
    },
} satisfies Meta<typeof StatusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {
    args: {
        status: 'OFF',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        onClick: fn(() => alert('Status clicked!'))
    },
};

export const Online: Story = {
    args: {
        status: 'ON',
        timestamp: new Date().toISOString(),
        onClick: fn(() => alert('Status clicked!'))
    },
};

export const Error: Story = {
    args: {
        status: 'error',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        onClick: fn(() => alert('Status clicked!'))
    },
};
