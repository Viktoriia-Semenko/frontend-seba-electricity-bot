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
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<{ status: Device['status']; lastChange: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!user?.email) return;
        api.getDevicesByUser(user.email)
            .then(res => {
                setDevices(res.devices);

                if(!selectedDevice && res.devices.length) {
                    setSelectedDevice(res.devices[0].uuid);
                }
            })
            .catch(err => {
                console.error('Error fetching devices:', err);
                setError('Failed to fetch devices');
            })
            .finally(() => setLoading(false));
    }, [user, api, selectedDevice]);

    useEffect(() => {
        if (!selectedDevice) return setCurrentStatus(null);
        setLoading(true);

        api.getDeviceStatus(selectedDevice)
            .then(res => {
                setCurrentStatus({status: res.status, lastChange: res.lastChange});
                setError(null);
            })
            .catch(err => {
                console.error('Error fetching device status:', err);
                setError('Failed to fetch device status');
            })
            .finally(() => setLoading(false));
    }, [selectedDevice, api]);

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
                        name={selectedDevice ? devices.find(d => d.uuid === selectedDevice)?.name || selectedDevice : 'No Device Selected'}
                        status={currentStatus.status}
                        timestamp={currentStatus.lastChange}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await api.getDeviceStatus(selectedDevice!);
                                setCurrentStatus({status: res.status, lastChange: res.lastChange});
                            } catch (err) {
                                console.error('Error fetching device status:', err);
                                setError('Failed to fetch device status');
                            }
                            finally {
                                setLoading(false);
                            }
                        }}
                    />
                </div>
            )}

            <div className={styles.deviceSelector}>
                {devices.map((device) => (
                    <button
                        key={device.uuid}
                        className={`${styles.dot} ${selectedDevice === device.uuid ? styles.activeDot : ''}`}
                        onClick={() => setSelectedDevice(device.uuid)}
                        title={device.name ?? device.uuid} />
                ))}
            </div>

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