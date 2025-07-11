import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginForm } from '../Components/LoginForm/LoginForm.tsx';
import React from "react";
import {action} from "storybook/actions";

const emailInput     = document.createElement('input');
const passwordInput  = document.createElement('input');

const emailRef:     React.RefObject<HTMLInputElement> = { current: emailInput };
const passwordRef:  React.RefObject<HTMLInputElement> = { current: passwordInput };


const meta = {
    title: 'Example/LoginForm',
    component: LoginForm,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        onSub: action('onSubmit'),
        isDis: false,
        emailRef,
        passwordRef
    }
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
    args: {
        onSub: () => {},
        isDis: false,
        emailRef,
        passwordRef
    }
};