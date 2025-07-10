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
            const user = await api.loginUser(values);
            api.saveToken(user.token);
            navigate('/home');
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
