import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import type { ReactNode } from 'react';

interface User {
    id?: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other';
    token?: string;
    email: string;
    avatar?: string;
    timeZone?: string;
}

interface UserContextProps {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
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
