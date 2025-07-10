import React from 'react';
import type {FormEventHandler} from 'react';
import styles from './LoginForm.module.css';
import {SignButton} from "../SignButton/SignButton.tsx";
import { Link } from 'react-router-dom';

type RegistrationFormProps = {
    onSub: FormEventHandler<HTMLFormElement>;
    isDis?: boolean;
    emailRef: React.RefObject<HTMLInputElement | null>;
    passwordRef: React.RefObject<HTMLInputElement | null>;
};

export const LoginForm: React.FC<RegistrationFormProps> = ({onSub, isDis, emailRef, passwordRef}) => {
    const [emailError, setEmailError] = React.useState<string>('');
    const [passwordError, setPasswordError] = React.useState<string>('');

    const validateForm = () => {
        let isValid = true;

        const email = emailRef.current?.value.trim() || '';
        const password = passwordRef.current?.value.trim() || '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            setEmailError('Email is required');
            isValid = false;
        }
        else {
            setEmailError('');
        }

        if (!password || password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            isValid = false;
        }
        else {
            setPasswordError('');
        }

        return isValid;
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (validateForm()) {
            onSub(event);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.email}>
                    <input name="email" type="email" className={styles.input} ref={emailRef} placeholder={"Email"} />
                    {emailError && <p className={styles.error}>* {emailError}</p>}
                </div>
                <div className={styles.password}>
                    <input name="password" type="password" className={styles.input} ref={passwordRef} placeholder={"Password"} />
                    {passwordError && <p className={styles.error}>* {passwordError}</p>}
                </div>
                <div className={styles.btnContainer}>
                    <p className={styles.privacyPolicy}>
                        Or register now <Link to="/register" className={styles.link}>Register</Link>
                    </p>
                    <SignButton htmlType={"submit"} title={'Sign up'} isDisabled={isDis} />
                </div>
            </form>
        </div>
    );
};