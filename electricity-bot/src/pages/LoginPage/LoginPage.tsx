import styles from './LoginPage.module.css';
import { LoginForm } from '../../Components/LoginForm/LoginForm';
import { Header } from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { initUserAPI } from '../../modules/client';
import { AppPreview } from '../../Components/AppPreview/AppPreview';
import {useRef, useState} from 'react';
import { useUserContext } from '../../context/UserContext';
import {Navigate} from "react-router-dom";
import {SESSION_KEY} from "../../constants/session.ts";

const api = initUserAPI(fetch);

export const LoginPage = () => {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);
    const { setUser } = useUserContext();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem(SESSION_KEY);
    if (token) {
        return <Navigate to="/home" replace />;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsDisabled(true);

        try {
            const payload = {
                username: emailRef.current?.value || '',
                password: passwordRef.current?.value || '',
            };

            const user = await api.loginUser(payload);
            api.saveToken(user.token);

            const profile = await api.getCurrentUser();
            let avatarUrl: string | null = null;
            try {
                avatarUrl = await api.getAvatar();
            } catch (error) {
                console.error('Failed to fetch avatar:', error);
                avatarUrl = null; // Fallback value
            }
            setUser({
                id: profile.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                gender: profile.gender as 'male'|'female'|'other',
                avatarUrl: avatarUrl,
                timeZone: profile.timeZone,
            });

            navigate('/home');

        } catch (error) {
            alert('Login failed: ' + (error as Error).message);
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <AppPreview className={styles.phoneZone} />
            <div className={styles.loginZone}>
                <div className={styles.header}>
                    <Header title="Login" pageType="login" />
                </div>
                <div className={styles.formWrapper}>
                    <LoginForm onSub={handleLogin} isDis={isDisabled} emailRef={emailRef} passwordRef={passwordRef} />
                </div>
            </div>
        </div>
    );
};