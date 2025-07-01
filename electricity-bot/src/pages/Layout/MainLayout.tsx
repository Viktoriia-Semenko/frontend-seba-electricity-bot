import styles from './MainLayout.module.css';
import { UserCard } from '../../Components/UserCard/UserCard';
import { Button } from '../../Components/Button/Button';
import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    page: 'home' | 'history' | 'settings';
}

export const MainLayout = ({ children, page }: MainLayoutProps) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : { name: '', surname: '', gender: 'other' };

    return (
        <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
                <div className={styles.userCard}>
                    <UserCard name={user.name} surname={user.surname} sex={user.gender} />
                </div>
                <nav className={styles.nav}>
                    <Button title="Home" type={page === 'home' ? 'active' : 'inactive'} />
                    <Button title="History" type={page === 'history' ? 'active' : 'inactive'} />
                    <Button title="Settings" type={page === 'settings' ? 'active' : 'inactive'} />
                </nav>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
};
