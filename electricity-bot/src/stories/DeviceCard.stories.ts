import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { DeviceCard } from '../Components/DeviceCard/DeviceCard.tsx';

const meta = {
    title: 'Example/DeviceCard',
    component: DeviceCard,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {
        name: 'Device Name',
        status: 'online',
        onClick: fn(() => alert('Device clicked!'))
    },
} satisfies Meta<typeof DeviceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {
    args: {
        name: 'Offline Device',
        status: 'offline',
    },
};

export const Online: Story = {
    args: {
        name: 'Online Device',
        status: 'online',
    },
};
