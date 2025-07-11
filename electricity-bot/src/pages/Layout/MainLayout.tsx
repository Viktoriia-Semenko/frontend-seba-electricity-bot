import styles from './MainLayout.module.css';
import { UserCard } from '../../Components/UserCard/UserCard';
import { Button } from '../../Components/Button/Button';
import { Header } from '../../Components/Header/Header';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';

interface MainLayoutProps {
    children: ReactNode;
    page: 'home' | 'history' | 'settings';
}

export const MainLayout = ({ children, page }: MainLayoutProps) => {
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();

    useEffect(() => {
        const token = localStorage.getItem('bot-session');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:8080/user/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    console.error("Unauthorized access, redirecting to login.");
                    localStorage.removeItem('bot-session');
                    navigate('/login');
                    return;
                }

                const data = await res.json();

                setUser({
                    name: data.firstName,
                    surname: data.lastName,
                    gender: data.gender || 'other',
                });
            } catch (err) {
                console.error('Auth error:', err);
                localStorage.removeItem('bot-session');
                navigate('/login');
            }
        };

        if (!user) {
            fetchUser();
        }
    }, [navigate, setUser, user]);

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
                        onClick={() => navigate('/home')}
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
