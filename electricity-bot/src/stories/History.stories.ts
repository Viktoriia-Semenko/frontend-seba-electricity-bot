import type { Meta, StoryObj } from '@storybook/react-vite';
import { HistoryCard } from '../Components/History/History';

const meta = {
    title: 'Example/HistoryCard',
    component: HistoryCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        sensorName: 'Apartment sensor',
        status: 'restored',
        time: '4:20',
    },
} satisfies Meta<typeof HistoryCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Restored: Story = {
    args: {
        sensorName: 'Apartment sensor',
        status: 'restored',
        time: '4:20',
    },
};

export const Lost: Story = {
    args: {
        sensorName: 'Office sensor',
        status: 'lost',
        time: '23:56',
    },
};

export const OneCard: Story = {
    args: {
        sensorName: 'Balcony sensor',
        status: 'lost',
        time: '21:40',
        isLast: true
    }
};

