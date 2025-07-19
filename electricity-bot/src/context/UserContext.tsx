import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { ReactNode } from 'react';
import { initUserAPI } from '../modules/client';
import { SESSION_KEY } from '../constants/session';

interface User {
    id?: number;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other';
    token?: string;
    email: string;
    avatarUrl?: string;
    timeZone?: string | null;
}

interface UserContextProps {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const api = useMemo(() => initUserAPI(fetch), []);

    useEffect(() => {
        const token = localStorage.getItem(SESSION_KEY);
        if (!token) {
            setIsLoading(false);
            return;
        };

        const fetchUser = async () => {
            try {
                const data = await api.getCurrentUser();
                setUser({ ...data, token });
            } catch (error) {
                console.warn('Failed to restore session:', error);
                api.removeToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser().then(() => {
            api.getAvatar().then(url => {
                setUser(prev => prev ? { ...prev, avatarUrl: url } : prev);
            }).catch(err => {
                console.warn('Failed to fetch avatar:', err);
            });
        });
    }, [api]);


    return (
        <UserContext.Provider value={{ user, setUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
