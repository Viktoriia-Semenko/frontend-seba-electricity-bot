import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SensorCard } from '../Components/MySensorsCard/SensorCard';

const meta = {
    title: 'Example/SensorCard',
    component: SensorCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        label: 'Apartment sensor',
        timestamp: '1 month ago',
        onClick: fn(() => alert('No new updates!')),
    },
} satisfies Meta<typeof SensorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTime: Story = {
    args: {
        timestamp: '5 minutes ago',
    },
};