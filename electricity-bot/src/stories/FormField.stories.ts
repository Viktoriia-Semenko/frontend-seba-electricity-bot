import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from '../Components/FormField/FormField';

const meta: Meta<typeof FormField> = {
    title: 'Example/FormField',
    component: FormField,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const TextInput: Story = {
    args: {
        label: 'First Name',
        name: 'firstName',
        placeholder: 'Your First Name',
        value: '',
        type: 'text',
        onChange: () => {},
    },
};

export const TextInputWithError: Story = {
    args: {
        label: 'Device UID',
        name: 'uid',
        placeholder: '12345678',
        value: '12345678',
        type: 'text',
        error: 'This device UID is already added',
        onChange: () => {},
    },
};

export const SelectInput: Story = {
    args: {
        label: 'Gender',
        name: 'gender',
        placeholder: 'Your Gender',
        value: '',
        type: 'select',
        options: ['Male', 'Female', 'Other'],
        onChange: () => {},
    },
};

export const SelectWithValue: Story = {
    args: {
        label: 'Time zone',
        name: 'timezone',
        placeholder: 'Your time zone',
        value: 'UTC+2',
        type: 'select',
        options: ['UTC+1', 'UTC+2', 'UTC+3'],
        onChange: () => {},
    },
};
