import styles from './LoginPage.module.css';
import { LoginForm } from '../../Components/LoginForm/LoginForm';
import { Header } from '../../Components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { initUserAPI } from '../../modules/client';
import { AppPreview } from '../../Components/AppPreview/AppPreview';
import {useRef, useState} from 'react';
import { useUserContext } from '../../context/UserContext';
import {Navigate} from "react-router-dom";

const api = initUserAPI(fetch);

export const LoginPage = () => {
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(false);
    const { setUser } = useUserContext();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem('bot-session');
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

            setUser({
                name: user.firstName,
                surname: user.lastName,
                gender: ['male', 'female', 'other'].includes(user.gender)
                    ? user.gender as 'male' | 'female' | 'other'
                    : 'other',
                email: user.email,
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
            <AppPreview />
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