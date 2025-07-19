import {useUserContext} from "../../context/UserContext.tsx";
import {initUserAPI} from "../../modules/client";
import React, {type FormEvent, useEffect, useMemo, useState} from "react";
import styles from './SettingsPage.module.css';
import {ActionButton} from "../../Components/ActionButton/ActionButton.tsx";
import {SESSION_KEY} from "../../constants/session.ts";
import moment from "moment-timezone";
import userCardImage from '../../Components/UserCard/img/user-card.svg'
import femaleImage from '../../Components/UserCard/img/female-user-image.png'
import otherCardImage from '../../Components/UserCard/img/other-user-image.png'
import {initDeviceModule} from "../../modules/device";
import {SensorCard} from "../../Components/MySensorsCard/SensorCard.tsx";
import {useNavigate} from "react-router-dom";

interface Device {
    uuid: string;
    name?: string;
    status: 'ON' | 'OFF' | 'error';
    lastChange: string;
}

function defaultImage(sex: 'male'|'female'|'other') {
    if (sex === 'male') return userCardImage;
    if (sex === 'female') return femaleImage;
    return otherCardImage;
}

export const SettingsPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const api = useMemo(() =>  initUserAPI(fetch), []);
    const deviceApi = useMemo(() => initDeviceModule(fetch), []);
    const timeZones = useMemo(() => moment.tz.names(), []);

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [gender, setGender] = useState(user?.gender || 'other');
    const [timeZone, setTimeZone] = useState(user?.timeZone || '');
    const [avatar, setAvatar] = useState<File|null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatarUrl || null);

    const [devices, setDevices] = useState<Device[]>([]);
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

    useEffect(() => {
        if(!user?.email) return;

        deviceApi.getDevicesByUser(user.email)
            .then(res => setDevices(res.devices))
            .catch(console.error);
    }, [user, deviceApi]);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setGender(user.gender || 'other');

            const cachedTZ = localStorage.getItem('user-timezone');
            if (user?.timeZone || cachedTZ) {
                    setTimeZone(user?.timeZone ?? cachedTZ ?? '');
            }

            setPreviewAvatar(user.avatarUrl || null);
        }
    }, [user]);

    const openDeleteModal = (device: Device) => setDeviceToDelete(device);
    const closeDeleteModal = () => setDeviceToDelete(null);
    const onDeleteDevice = async () => {
        if (!deviceToDelete) return;

        try {
            await deviceApi.deleteDevice(deviceToDelete.uuid);
            const res = await deviceApi.getDevicesByUser(user!.email);

            const selectedDevice = localStorage.getItem('device-uuid');
            if (selectedDevice === deviceToDelete.uuid) {
                localStorage.removeItem('device-uuid');
            }

            setDevices(res.devices);
            closeDeleteModal();
        } catch (error) {
            console.error('Failed to delete device:', error);
            alert('Failed to delete device');
        }
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewAvatar) {
            URL.revokeObjectURL(previewAvatar);
        }

        const localFile = URL.createObjectURL(file);
        setAvatar(file);
        setPreviewAvatar(localFile);

        setUser(prev => prev
            ? { ...prev, avatarUrl: localFile }
            : prev
        );
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
                { ...prev, avatarUrl: undefined } : prev)
            }
            else if (avatar) {
                await api.uploadAvatar(avatar);
                const url = await api.getAvatar();

                setUser(prev => prev ?
                    {...prev, avatarUrl: url } : prev
                );

                setPreviewAvatar(url);
                setAvatar(null);
            }

            localStorage.setItem('user-timezone', timeZone);

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
                <img className={styles.avatar} src={previewAvatar ?? user.avatarUrl ?? defaultImage(user.gender)} alt="avatar"/>
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
                        <select className={styles.settingsSelect}
                                value={timeZone}
                                onChange={e => setTimeZone(e.target.value)}
                                name="timeZone"
                                required>
                            <option value="" disabled>Select Time Zone</option>
                            {timeZones.map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.avatarContainer}>
                        <label className={styles.avatarLabel}>
                            {previewAvatar
                                ? 'Change Avatar'
                                : 'Upload Avatar'}
                            <input
                                name="avatar"
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
                                    src={previewAvatar ?? user.avatarUrl} alt="avatar preview"/>

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

            <div className={styles.devicesAndLogout}>
                <div className={styles.settingsPageDeviceInfo}>
                    <h2 className={styles.devicesHeader}>My Devices</h2>
                    <div className={styles.sensorsList}>
                        {devices.map((device) => {
                            const tz = user?.timeZone || moment.tz.guess();
                            const realTime = moment.tz(device.lastChange, tz).fromNow();

                            return (
                                <SensorCard key={device.uuid}
                                            label={device.name ?? device.uuid}
                                            timestamp={realTime}
                                            type={device.name?.toLowerCase().includes('office') ? 'office' : 'apartment'}
                                            onClick={() => openDeleteModal(device)} />
                            )
                        })}
                        {devices.length === 0 && <p>No device yet :(</p>}
                    </div>

                    {deviceToDelete && (
                        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
                            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                                <h2 className={styles.modalTitle}>Delete Device</h2>
                                <p>Are you sure you want to delete the device <strong>{deviceToDelete.name || deviceToDelete.uuid}</strong>?</p>
                                <div className={styles.modalButtons}>
                                    <ActionButton title="Delete" onClick={onDeleteDevice} />
                                    <button className={styles.closeModalButton} onClick={closeDeleteModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.settingsPageActions}>
                    <ActionButton title="Logout" onClick={() => {
                        localStorage.removeItem(SESSION_KEY);
                        setUser(null);
                        navigate('/login', { replace: true});
                    }} />
                </div>
            </div>
        </div>
    );
}