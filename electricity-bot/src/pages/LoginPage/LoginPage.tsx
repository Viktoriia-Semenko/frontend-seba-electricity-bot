import styles from './LoginPage.module.css';
import { LoginForm } from '../../Components/LoginForm/LoginForm';
import { Header } from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { initUserAPI } from '../../modules/client';
import { AppPreview } from '../../Components/AppPreview/AppPreview';
import { useState } from 'react';
import { useUserContext } from '../../context/UserContext';

const api = initUserAPI(fetch);

export const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { setUser } = useUserContext();

    const handleLogin = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const response = await api.loginUser(values);

            const token = response.token;
            api.saveToken(token);
            localStorage.setItem('bot-session', token);

            const res = await fetch('http://localhost:8080/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch user');

            const data = await res.json();

            setUser({
                name: data.firstName,
                surname: data.lastName,
                gender: data.gender || 'other',
            });

            navigate('/');
        } catch (error) {
            alert('Login failed: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <AppPreview />
            <div className={styles.loginZone}>
                <div className={styles.header}>
                    <Header title="Login" pageType="login" />
                </div>
                <div className={styles.formWrapper}>
                    <LoginForm onSub={handleLogin} isDisabled={loading} />
                </div>
            </div>
        </div>
    );
};
