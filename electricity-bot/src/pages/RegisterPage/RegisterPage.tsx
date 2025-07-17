import styles from './RegisterPage.module.css';
import { useRef, useState } from 'react';
import { RegistrationForm } from '../../Components/RegistrationForm/RegistrationForm';
import { useNavigate } from 'react-router-dom';
import { initUserAPI } from '../../modules/client';
import { AppPreview } from '../../Components/AppPreview/AppPreview';

const api = initUserAPI(fetch);

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [isDisabled, setIsDisabled] = useState(false);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsDisabled(true);

        try {
            const payload = {
                firstName: firstNameRef.current?.value || '',
                lastName: lastNameRef.current?.value || '',
                email: emailRef.current?.value || '',
                password: passwordRef.current?.value || '',
                gender: genderRef.current?.value || '',
            };

            const user = await api.registerUser(payload);
            api.saveToken(user.token);
            navigate('/home');
        } catch (error) {
            alert('Registration failed: ' + (error as Error).message);
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <AppPreview className={styles.phoneZone}/>
            <div className={styles.registerZone}>
                <div className={styles.header}>
                    <RegistrationForm
                        onSub={handleSubmit}
                        isDis={isDisabled}
                        firstNameRef={firstNameRef}
                        lastNameRef={lastNameRef}
                        genderRef={genderRef}
                        emailRef={emailRef}
                        passwordRef={passwordRef}
                    />
                </div>
            </div>
        </div>
    );
};
