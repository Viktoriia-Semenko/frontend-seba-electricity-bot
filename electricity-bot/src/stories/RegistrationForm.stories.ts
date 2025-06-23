import type { Meta, StoryObj } from '@storybook/react-vite';

import { RegistrationForm } from '../Components/RegistrationForm/RegistrationForm.tsx';
import React from 'react';
import {action} from "storybook/actions";

const meta = {
    title: 'Example/RegistrationForm',
    component: RegistrationForm
} satisfies Meta<typeof RegistrationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const firstNameInput = document.createElement('input');
const lastNameInput  = document.createElement('input');
const emailInput     = document.createElement('input');
const genderSelect   = document.createElement('select');
const passwordInput  = document.createElement('input');

const firstNameRef: React.RefObject<HTMLInputElement> = { current: firstNameInput };
const lastNameRef:  React.RefObject<HTMLInputElement> = { current: lastNameInput };
const emailRef:     React.RefObject<HTMLInputElement> = { current: emailInput };
const genderRef:    React.RefObject<HTMLSelectElement> = { current: genderSelect as HTMLSelectElement };
const passwordRef:  React.RefObject<HTMLInputElement> = { current: passwordInput };
export const Primary: Story = {
    args: {
        onSub: action('onSubmit'),
        isDis: false,
        firstNameRef,
        lastNameRef,
        emailRef,
        genderRef,
        passwordRef
    }
};