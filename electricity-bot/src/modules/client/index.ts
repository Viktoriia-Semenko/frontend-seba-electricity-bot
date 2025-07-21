import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import { convertToType } from '../convertToType';
import {SESSION_KEY, USER_TIMEZONE} from '../../constants/session';
import { API_ROUTES } from '../../constants/apiRoutes';

const UserSchema = Type.Object({
    id: Type.Number(),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    gender: Type.Union([
        Type.Literal('male'),
        Type.Literal('female'),
        Type.Literal('other'),
    ]),
    token:  Type.Optional(Type.String()),
    timeZone: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    avatarUrl: Type.Optional(Type.String()),
});

export const LoginRequestSchema = Type.Object({
    email: Type.String(),
    password: Type.String()
});

export type LoginRequest = Static<typeof LoginRequestSchema>;

export type User = Static<typeof UserSchema>

export const initUserAPI = (fetchAPI: typeof fetch) => {

    const loginUser = async (credentials: LoginRequest): Promise<User> => {
        const response = await fetchAPI(API_ROUTES.AUTH.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        let token: string;
        const rawToken = await response.text();
        console.log(rawToken)

        try {
            token = JSON.parse(rawToken).token;
        } catch  {
            token = rawToken.trim();
        }

        saveToken(token);

        let data;
        try {
            data = await getCurrentUser();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            console.warn('Could not fetch user, fallbacking');
        }

        const user = convertToType(data, UserSchema);
        return { ...user, token };
    };

    const registerUser = async (payload: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        gender: string;
    }): Promise<User> => {
        const bodyPayload = {
            ...payload,
            role: 'user' as const, // Assuming role is always 'user'
        }
        const response = await fetchAPI(API_ROUTES.AUTH.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPayload)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        let token: string;
        const rawToken = await response.text();
        console.log(rawToken)

        try {
            token = JSON.parse(rawToken).token;
        } catch  {
            token = rawToken.trim();
        }

        saveToken(token);

        let data;
        try {
            data = await getCurrentUser();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            console.warn('Could not fetch user, fallbacking');
            data = {
                id: 0,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                gender: payload.gender
            };
        }

        const user = convertToType(data, UserSchema);
        return { ...user, token };
    };

    const getCurrentUser = async (): Promise<User> => {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetchAPI(API_ROUTES.AUTH.CURRENT_USER, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }

        const data = await response.json();
        let user: User;

        try {
            user = convertToType(data, UserSchema);
        } catch {
            throw new Error('Data is not valid');
        }

        if (data.avatarUrl) {
            return user
        }

        try {
            user.avatarUrl = await getAvatar();
        } catch (error) {
            if (error instanceof Error && error.message?.includes('404')) {
                console.warn('Avatar not found, continuing without it');
                user.avatarUrl = undefined;
            } else {
                throw error;
            }
        }

        return user;
    };

    const updateUser = async (payload: {
        firstName?: string;
        lastName?: string;
        gender?: string;
        timeZone?: string;
    }): Promise<User> => {
        const token = getToken();

        const response = await fetchAPI(API_ROUTES.AUTH.CURRENT_USER, {
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
        const response = await fetchAPI(API_ROUTES.AUTH.AVATAR, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload avatar');
        }

        const text = await response.text();
        if (!text) {
            throw new Error('Empty response from server'); // або повертай fallback
        }

        const data = JSON.parse(text);
        return convertToType(data, UserSchema);
    }

    const deleteAvatar = async (): Promise<User> => {
        const token = getToken();
        const response = await fetchAPI(API_ROUTES.AUTH.AVATAR, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete avatar');
        }

        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return {
                id: 0,
                firstName: '',
                lastName: '',
                email: '',
                gender: 'other',
                timeZone: null
            };
        }

        const text = await response.text();
        if (!text) {
            throw new Error('Empty response from server');
        }

        const data = JSON.parse(text);
        return convertToType(data, UserSchema);
    }

    const getAvatar = async (): Promise<string> => {
        const token = getToken();
        if (!token) throw new Error('No token found');

        const response = await fetchAPI(API_ROUTES.AUTH.AVATAR, {
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
        localStorage.removeItem(USER_TIMEZONE);
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