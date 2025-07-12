import styles from './MainLayout.module.css';
import { UserCard } from '../../Components/UserCard/UserCard';
import { Button } from '../../Components/Button/Button';
import { Header } from '../../Components/Header/Header';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import {SESSION_KEY} from "../../constants/session.ts";
import {initUserAPI} from "../../modules/client";

interface MainLayoutProps {
    children: ReactNode;
    page: 'home' | 'history' | 'settings';
}

export const MainLayout = ({ children, page }: MainLayoutProps) => {
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();

    useEffect(() => {
        const token = localStorage.getItem(SESSION_KEY);
        if (!token) {
            navigate('/login');
            return;
        }

        if (!user) {
            initUserAPI(fetch).getCurrentUser()
                .then(data => {
                    setUser({
                        name: data.firstName,
                        surname: data.lastName,
                        gender: ['male', 'female', 'other'].includes(data.gender) ? data.gender as 'male' | 'female' | 'other' : 'other',
                        email: data.email,
                    });
                }).catch(() => {
                    localStorage.removeItem(SESSION_KEY);
                    navigate('/login');
                });
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
