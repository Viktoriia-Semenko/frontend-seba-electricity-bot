import type {Meta, StoryObj} from "@storybook/react-vite";

import {fn} from "storybook/test";

import {UserCard} from "../Components/UserCard/UserCard.tsx";

const meta = {
    title: 'Example/UserCard',
    component: UserCard,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
    args: {
        name: 'Taras',
        surname: 'Shevchenko',
        sex: 'male',
        onClick: fn(() => alert('User card clicked!'))
    },
} satisfies Meta<typeof UserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MaleSex: Story = {
    args: {
        name: 'Taras',
        surname: 'Shevchenko',
        sex: 'male'
    },
};

export const FemaleSex: Story = {
    args: {
        name: 'Lesya',
        surname: 'Ukrainka',
        sex: 'female'
    },
};

export const OtherSex: Story = {
    args: {
        name: 'Ivan',
        surname: 'Franko',
        sex: 'other'
    },
};

export const WithImage: Story = {
    args: {
        name: 'Taras',
        surname: 'Shevchenko',
        image: 'https://knu.ua/img/kobzar.jpg',
    },
};