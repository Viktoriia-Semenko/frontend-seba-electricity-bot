import styles from './MainLayout.module.css';
import { UserCard } from '../../Components/UserCard/UserCard';
import { Button } from '../../Components/Button/Button';
import { Header } from '../../Components/Header/Header';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    page: 'home' | 'history' | 'settings';
}

interface User {
    name: string;
    surname: string;
    gender: 'male' | 'female' | 'other';
}

export const MainLayout = ({ children, page }: MainLayoutProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('bot-session');

        if (!token) {
            navigate('/login');
            return;
        }

        // until there is no backend then fetch will be changed
        const fetchUser = async () => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            setUser({
                name: 'Test',
                surname: 'User',
                gender: 'female',
            });
        };

        fetchUser();
    }, [navigate]);

    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.userCard}>
                    <UserCard
                        name={user.name}
                        surname={user.surname}
                        sex={user.gender}
                    />
                </div>
                <nav className={styles.nav}>
                    <Button
                        title="Home"
                        type={page === 'home' ? 'active' : 'inactive'}
                        onClick={() => navigate('/')}
                    />
                    <Button
                        title="History"
                        type={page === 'history' ? 'active' : 'inactive'}
                        onClick={() => navigate('/history')}
                    />
                    <Button
                        title="Settings"
                        type={page === 'settings' ? 'active' : 'inactive'}
                        onClick={() => navigate('/settings')}
                    />
                </nav>
            </aside>
            <main className={styles.content}>
                <Header title={capitalize(page)} pageType="main" />
                {children}
            </main>
        </div>
    );
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);