import styles from './MainLayout.module.css';
import { UserCard } from '../../Components/UserCard/UserCard';
import { Button } from '../../Components/Button/Button';
import { Header } from '../../Components/Header/Header';
import {type ReactNode, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import {SESSION_KEY } from "../../constants/session.ts";
import { initUserAPI } from "../../modules/client";

interface MainLayoutProps {
    children: ReactNode;
    page: 'home' | 'history' | 'settings';
}

export const MainLayout = ({ children, page }: MainLayoutProps) => {
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const api = useMemo(() => initUserAPI(fetch), []);

    useEffect(() => {
        const token = localStorage.getItem(SESSION_KEY);
        if (!token) {
            navigate('/login');
            return;
        }

        if (!user) {
            api.getCurrentUser()
                .then(data =>  {
                    setUser({
                        ...data,
                        avatarUrl: undefined,
                    });
                    return api.getAvatar();
                })
                .then(url => {
                    setUser(prev => prev ? {...prev, avatarUrl:url} : prev);
                })
                .catch(error => {
                    console.error('Failed to fetch user data:', error);
                    localStorage.removeItem(SESSION_KEY);
                    navigate('/login');
                });
        }

    }, [api, navigate, setUser, user]);

    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            <button className={styles.hamburger} onClick={() => setIsSidebarOpen(prev => !prev)}>
                ☰
            </button>

            {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.userCard}>
                    <UserCard
                        firstName={user.firstName}
                        lastName={user.lastName}
                        sex={user.gender}
                        image={user.avatarUrl}
                        onClick={() => navigate('/settings')}
                    />
                </div>
                <nav className={styles.nav}>
                    <Button title="Home" type={page === 'home' ? 'active' : 'inactive'} onClick={() => navigate('/home')} />
                    <Button title="History" type={page === 'history' ? 'active' : 'inactive'} onClick={() => navigate('/history')} />
                    <Button title="Settings" type={page === 'settings' ? 'active' : 'inactive'} onClick={() => navigate('/settings')} />
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
