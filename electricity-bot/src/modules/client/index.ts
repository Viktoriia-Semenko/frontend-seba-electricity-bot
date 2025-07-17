import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import { convertToType } from '../convertToType';
import {SESSION_KEY} from '../../constants/session';

//const link = `${API_MOCK}`

const UserSchema = Type.Object({
    id: Type.String(),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    gender: Type.Union([
        Type.Literal('male'),
        Type.Literal('female'),
        Type.Literal('other'),
    ]),
    token: Type.String(),
    timeZone: Type.Optional(Type.String()),
});

export const LoginRequestSchema = Type.Object({
    username: Type.String(),
    password: Type.String()
});

export type LoginRequest = Static<typeof LoginRequestSchema>;

export type User = Static<typeof UserSchema>

export const initUserAPI = (fetchAPI: typeof fetch) => {

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

        const response = await fetchAPI(`/user/me`, {
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

    const updateUser = async (payload: {
        firstName?: string;
        lastName?: string;
        gender?: string;
        timeZone?: string;
    }): Promise<User> => {
        const token = getToken();

        const response = await fetchAPI(`/user/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        const data = await response.json();

        try {
            return convertToType(data, UserSchema);
        } catch {
            throw new Error('Data is not valid');
        }
    }

    const uploadAvatar = async (file: File): Promise<User> => {
        const token = getToken();
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await fetchAPI(`/user/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload avatar');
        }

        const data = await response.json();

        try {
            return convertToType(data, UserSchema);
        } catch {
            throw new Error('Data is not valid');
        }
    }

    const deleteAvatar = async (): Promise<User> => {
        const token = getToken();
        const response = await fetchAPI(`/user/avatar`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete avatar');
        }

        const data = await response.json();

        try {
            return convertToType(data, UserSchema);
        } catch {
            throw new Error('Data is not valid');
        }
    }

    const getAvatar = async (): Promise<string> => {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetchAPI(`/user/avatar`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('Failed to fetch avatar: Authentication error (invalid or missing token)');
            } else if (response.status >= 500 && response.status < 600) {
                throw new Error('Failed to fetch avatar: Server error');
            } else {
                throw new Error(`Failed to fetch avatar: HTTP status ${response.status}`);
            }
        }

        const blob = await response.blob();

        return URL.createObjectURL(blob);
    }

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
        getCurrentUser,
        updateUser,
        uploadAvatar,
        deleteAvatar,
        getAvatar
    };
};