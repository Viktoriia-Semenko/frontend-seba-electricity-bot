import React from 'react';
import type {FormEventHandler} from 'react';
import styles from './RegistrationForm.module.css';
import {Header} from "../Header/Header.tsx";
import {SignButton} from "../SignButton/SignButton.tsx";
import { Link } from 'react-router-dom';

type RegistrationFormProps = {
    onSub: FormEventHandler<HTMLFormElement>;
    isDis?: boolean;
    firstNameRef: React.RefObject<HTMLInputElement | null>;
    lastNameRef: React.RefObject<HTMLInputElement | null>;
    emailRef: React.RefObject<HTMLInputElement | null>;
    genderRef: React.RefObject<HTMLSelectElement | null>;
    passwordRef: React.RefObject<HTMLInputElement | null>;
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({onSub, isDis, firstNameRef, lastNameRef, emailRef, genderRef, passwordRef}) => {
    const [firstNameError, setFirstNameError] = React.useState<string>('');
    const [lastNameError, setLastNameError] = React.useState<string>('');
    const [emailError, setEmailError] = React.useState<string>('');
    const [passwordError, setPasswordError] = React.useState<string>('');
    const [genderError, setGenderError] = React.useState<string>('');

    const validateForm = () => {
        let isValid = true;

        const firstName = firstNameRef.current?.value.trim() || '';
        const lastName = lastNameRef.current?.value.trim() || '';
        const email = emailRef.current?.value.trim() || '';
        const password = passwordRef.current?.value.trim() || '';
        const gender = genderRef.current?.value || '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!firstName) {
            setFirstNameError('First name is required');
            isValid = false;
        }
        else {
            setFirstNameError('');
        }

        if (!lastName) {
            setLastNameError('Last name is required');
            isValid = false;
        }
        else {
            setLastNameError('');
        }

        if (!gender) {
            setGenderError('Gender is required');
            isValid = false;
        }
        else {
            setGenderError('');
        }

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
            <Header title={"Registration"} pageType={"login"} />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.firstName}>
                    <input name="first-name" type="text" className={styles.input} ref={firstNameRef} placeholder={"First Name"} />
                    {firstNameError && <p className={styles.error}>* {firstNameError}</p>}
                </div>
                <div className={styles.lastName}>
                    <input name="last-name" type="text" className={styles.input} ref={lastNameRef} placeholder={"Last Name"} />
                    {lastNameError && <p className={styles.error}>* {lastNameError}</p>}
                </div>
                <div className={styles.gender}>
                    <select className={styles.select} ref={genderRef} aria-placeholder={"Gender"}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {genderError && <p className={styles.error}>* {genderError}</p>}
                </div>
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
                        Already have an account? <Link to="/login" className={styles.link}>Login</Link>
                    </p>
                    <SignButton htmlType={"submit"} title={'Sign up'} isDisabled={isDis} />
                </div>
            </form>
        </div>
    );
};