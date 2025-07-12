import {StatusCard} from "../../Components/StatusCard/StatusCard.tsx";
import {DeviceCard} from "../../Components/DeviceCard/DeviceCard.tsx";
import styles from './MainPage.module.css';
import {initDeviceModule} from "../../modules/device";
import {useUserContext} from "../../context/UserContext.tsx";
import {useEffect, useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {ActionButton} from "../../Components/ActionButton/ActionButton.tsx";

interface Device {
    uuid: string;
    name?: string;
    status: 'ON' | 'OFF' | 'error';
    lastChange: string;
}

export const MainPage = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const api = useMemo(() => initDeviceModule(fetch), []);

    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<{ status: Device['status']; lastChange: string } | null>(null);

    useEffect(() => {
        if(!user?.email) return;
        let isMounted = true;

        api.getDevicesByUser(user.email)
            .then(res => {
                if(!isMounted) return;
                setDevices(res.devices);

                const firstDevice = res.devices?.[0]?.uuid;

                if (firstDevice && !localStorage.getItem('device-uuid')) {
                    localStorage.setItem('device-uuid', firstDevice);
                }
            })
            .catch(err => {
                if(!isMounted) return;
                setError(err.message);
            });

        return () => {
            isMounted = false;
        }
    }, [user?.email, api]);

    useEffect(() => {
        const uuid = localStorage.getItem('device-uuid');
        if (!uuid) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        api.getDeviceStatus(uuid)
            .then(res => {
                if (!isMounted) return;
                setCurrentStatus({ status: res.status, lastChange: res.lastChange });
            })
            .catch(err => {
                if (!isMounted) return;
                setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        }
    }, [api]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }
    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            {currentStatus && (
                <div className={styles.statusSection}>
                    <StatusCard
                        status={currentStatus.status}
                        timestamp={currentStatus.lastChange}
                        onClick={async () => {
                            const uuid = localStorage.getItem('device-uuid')!;
                            const sr = await api.getDeviceStatus(uuid);
                            setCurrentStatus({ status: sr.status, lastChange: sr.lastChange });
                        }}
                    />
                </div>
            )}

            <div className={styles.devicesSection}>
                <h2 className={styles.devicesSectionHeader}>My Devices</h2>

                {devices.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>It is time to add your first device! :)</p>
                        <ActionButton onClick={() => navigate('/settings')} title="Add" />
                    </div>
                ) : (
                    <div className={styles.deviceContainer}>
                        {devices.map(d => (
                            <DeviceCard
                                key={d.uuid}
                                name={d.name ?? d.uuid}
                                status={d.status === 'ON' ? 'online' : 'offline'}
                                onClick={() => {
                                    localStorage.setItem('device-uuid', d.uuid);
                                    navigate(`/history?uuid=${d.uuid}`);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};