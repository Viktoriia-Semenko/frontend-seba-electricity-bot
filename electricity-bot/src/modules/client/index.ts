import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import { convertToType } from './convertToType';

const UserSchema = Type.Object({
    id: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    gender: Type.String(),
    token: Type.String()
});

export type User = Static<typeof UserSchema>

export const initUserAPI = (fetchAPI: typeof fetch) => {

    const SESSION_KEY = 'bot-session';

    const loginUser = async (email: string, password: string): Promise<User> => {
        const response = await fetchAPI(`/api/login`, { // тут буде реальне посилання
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return convertToType(data, UserSchema);
    };

    const registerUser = async (payload: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        gender: string;
    }): Promise<User> => {
        const response = await fetchAPI(`/api/register`, { // тут буде реальне посилання
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        return convertToType(data, UserSchema);
    };

    const saveToken = (token: string) => {
        localStorage.setItem(SESSION_KEY, token);
    };

    const getToken = () => {
        return localStorage.getItem(SESSION_KEY);
    };

    const removeToken = () => {
        localStorage.removeItem(SESSION_KEY);
    };

    return {
        loginUser,
        registerUser,
        saveToken,
        getToken,
        removeToken
    };
};