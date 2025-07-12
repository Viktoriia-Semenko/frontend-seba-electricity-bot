import {useUserContext} from "../../context/UserContext.tsx";
import {initUserAPI} from "../../modules/client";
import React, {type FormEvent, useState} from "react";
import styles from './SettingsPage.module.css';
import {ActionButton} from "../../Components/ActionButton/ActionButton.tsx";
import {API_MOCK} from "../../constants/session.ts";

import userCardImage from '../../Components/UserCard/img/user-card.svg'
import femaleImage from '../../Components/UserCard/img/femal-user-image.png'
import otherCardImage from '../../Components/UserCard/img/other-user-image.png'

function defaultImage(sex: 'male'|'female'|'other') {
    if (sex === 'male') {
        return userCardImage;
    }

    if (sex === 'female') {
        return femaleImage;
    }

    return otherCardImage;
}

export const SettingsPage = () => {
    const { user, setUser } = useUserContext();
    const api = initUserAPI(fetch);

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [gender, setGender] = useState(user?.gender || 'other');
    const [timeZone, setTimeZone] = useState(user?.timeZone || '');
    const [avatar, setAvatar] = useState<File|null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar || null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localFile = URL.createObjectURL(file);
        setPreviewAvatar(localFile);

        setUser(prev => prev
            ? { ...prev, avatar: localFile }
            : prev
        );

        try {
            const updated = await api.uploadAvatar(file);
            const serverAvatar = updated.avatar ? `${API_MOCK}${updated.avatar}` : localFile;

            setUser(prev => prev
                ? { ...prev, avatar: serverAvatar }
                : prev
            );
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            alert('Failed to upload avatar');
        }
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            await api.updateUser({ firstName, lastName, gender, timeZone });

            setUser(prev => prev ?
                    { ...prev, firstName, lastName, gender, timeZone }
                    : prev
            );

            if (previewAvatar === null) {
                await api.deleteAvatar();

                setUser(prev => prev ?
                { ...prev, avatar: undefined } : prev)

            }
            else if (avatar) {
                const updated = await api.uploadAvatar(avatar);
                const newAvatar = updated.avatar ? `${API_MOCK}${updated.avatar}` : previewAvatar!;

                setUser(prev => prev ?
                    {...prev, avatar: newAvatar } : prev
                );

                setPreviewAvatar(newAvatar);
                setAvatar(null);
            }

            alert('User information updated successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to update user information');
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className={styles.settingsPage}>
            <div className={styles.settingsPageUserInfo}>
                <img className={styles.avatar} src={previewAvatar ?? user.avatar ?? defaultImage(user.gender)} alt="avatar"/>
                <div className={styles.userInfo}>
                    <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                </div>

            </div>

            <div className="settings-page__edit-info">
                <form onSubmit={onSubmit} className={styles.form}>
                    <label>First Name
                        <input
                            className={styles.settingsInputField}
                            name="firstName"
                            type="text"
                            value={firstName}
                            placeholder={user?.firstName || 'First Name'}
                            onChange={(e) => setFirstName(e.target.value)}/>
                    </label>
                    <label>Last Name
                        <input
                            className={styles.settingsInputField}
                            name="lastName"
                            type="text"
                            value={lastName}
                            placeholder={user?.lastName || 'Last Name'}
                            onChange={(e) => setLastName(e.target.value)}/>
                    </label>
                    <label>
                        Gender
                        <select className={styles.settingsSelect} name="gender" value={gender} onChange={e => setGender(e.target.value as "male" | "female" | "other")}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label>
                        Time Zone
                        <input
                            className={styles.settingsInputField}
                            type="text"
                            value={timeZone}
                            placeholder={user?.timeZone || 'Time Zone'}
                            onChange={(e) => setTimeZone(e.target.value)}/>
                    </label>

                    <div className={styles.avatarContainer}>
                        <label className={styles.avatarLabel}>
                            {previewAvatar
                                ? 'Change Avatar'
                                : 'Upload Avatar'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className={styles.avatarInput}
                            />
                        </label>

                        {previewAvatar && (
                            <div className={styles.avatarPreview}>
                                <img
                                    className={styles.avatarPreviewImage}
                                    src={previewAvatar ?? user.avatar}  alt="avatar preview"/>

                                <button type='button'
                                        className={styles.avatarRemoveButton}
                                        onClick={() => {
                                            setPreviewAvatar(null);
                                            setAvatar(null);

                                            setUser(prev => prev
                                                ? { ...prev, avatar: undefined }
                                                : prev);
                                        }}> Remove </button>

                            </div>
                        )}
                    </div>

                    <div className={styles.saveButtonContainer}>
                        <ActionButton type="submit" title="Save" />
                    </div>

                </form>
            </div>
            <div className="settings-page__devices-info"></div>
            <div className="settings-page__danger-zone"></div>
        </div>
    );
}