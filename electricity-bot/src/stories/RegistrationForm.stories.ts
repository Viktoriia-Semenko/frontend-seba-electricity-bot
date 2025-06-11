import type { Meta, StoryObj } from '@storybook/react-vite';

import { RegistrationForm } from '../Components/RegistrationForm/RegistrationForm.tsx';

const meta = {
    title: 'Example/RegistrationForm',
    component: RegistrationForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};