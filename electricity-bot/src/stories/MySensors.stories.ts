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
        label: 'Sensor',
        timestamp: '1 month ago',
        type: 'apartment',
        onClick: fn(() => alert('Sensor clicked!')),
    },
} satisfies Meta<typeof SensorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ApartmentSensor: Story = {
    args: {
        type: 'apartment',
        label: 'Apartment Sensor',
    },
};

export const OfficeSensor: Story = {
    args: {
        type: 'office',
        label: 'Office Sensor',
    },
};