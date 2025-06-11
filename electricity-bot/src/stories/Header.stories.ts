import type {Meta, StoryObj} from "@storybook/react-vite";

import {Header} from "../Components/Header/Header.tsx";

const meta = {
    title: 'Example/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        title: "Header Title",
    },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
    args: {
        title: "Main",
        pageType: 'main'
    },
};

export const Login: Story = {
    args: {
        title: "Login",
        pageType: 'login'
    },
}