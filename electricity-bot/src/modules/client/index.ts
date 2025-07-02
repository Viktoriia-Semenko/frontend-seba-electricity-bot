import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import { convertToType } from '../convertToType';

const UserSchema = Type.Object({
    id: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    gender: Type.String(),
    token: Type.String(),
    avatar: Type.Optional(Type.String()),
    timeZone: Type.Optional(Type.String()),
});

export const LoginRequestSchema = Type.Object({
    username: Type.String(),
    password: Type.String()
});

export type LoginRequest = Static<typeof LoginRequestSchema>;

export type User = Static<typeof UserSchema>

export const initUserAPI = (fetchAPI: typeof fetch) => {

    const SESSION_KEY = 'bot-session';

    const loginUser = async (credentials: LoginRequest): Promise<User> => {
        const response = await fetchAPI(`/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
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
        const response = await fetchAPI(`/register`, {
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

    const getCurrentUser = async (): Promise<User> => {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetchAPI('/user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }

        const data = await response.json();

        try {
            return convertToType(data, UserSchema);
        } catch {
            throw new Error('Data is not valid');
        }
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
        removeToken,
        getCurrentUser
    };
};