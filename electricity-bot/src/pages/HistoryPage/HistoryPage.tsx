import { useEffect, useMemo, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { initDeviceModule } from '../../modules/device';
import { HistoryCard } from '../../Components/History/History';
import styles from './HistoryPage.module.css';

type Device = {
    uuid: string;
    name?: string;
    status: 'ON' | 'OFF' | 'error';
    lastChange: string;
};

type HistoryItem = {
    timestamp: string;
    status: 'ON' | 'OFF' | 'error';
};

export const HistoryPage = () => {
    const { user } = useUserContext();
    const api = useMemo(() => initDeviceModule(fetch), []);
    const [devices, setDevices] = useState<Device[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const uuid = localStorage.getItem('device-uuid');
        if (!user?.email || !uuid) {
            setError('Missing user or device ID');
            setLoading(false);
            return;
        }

        Promise.all([
            api.getDevicesByUser(user.email),
            api.getDeviceHistory(uuid)
        ])
            .then(([deviceRes, historyRes]) => {
                setDevices(deviceRes.devices);
                setHistory(historyRes.history);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load history data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, api]);

    const uuid = localStorage.getItem('device-uuid');
    const deviceName = devices.find(d => d.uuid === uuid)?.name ?? 'Unknown device';

    const grouped = useMemo(() => {
        const result: Record<string, HistoryItem[]> = {};
        history.forEach(item => {
            const dateObj = new Date(item.timestamp);
            const key = dateObj.toISOString().split('T')[0];
            if (!result[key]) result[key] = [];
            result[key].push(item);
        });
        return result;
    }, [history]);



    const formatDateLabel = (dateString: string) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const given = new Date(dateString);

        const isSameDay = (a: Date, b: Date) =>
            a.getDate() === b.getDate() &&
            a.getMonth() === b.getMonth() &&
            a.getFullYear() === b.getFullYear();

        if (isSameDay(given, today)) return 'Today';
        if (isSameDay(given, yesterday)) return 'Yesterday';

        return given.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };



    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className={styles.section}>
                    <h2 className={styles.sectionTitle}>{formatDateLabel(date)}</h2>
                    <div className={styles.cardList}>
                        {items.map((item, idx) => (
                            <HistoryCard
                                key={idx}
                                sensorName={deviceName}
                                status={item.status === 'ON' ? 'restored' : 'lost'}
                                time={item.timestamp}
                                isLast={idx === items.length - 1}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
