import { useEffect, useMemo, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { initDeviceModule } from '../../modules/device';
import { HistoryCard } from '../../Components/History/History';
import styles from './HistoryPage.module.css';

type Device = {
    uuid: string;
    name?: string;
    status: 'ON' | 'OFF' | 'error';
    lastChange: string | null;
};

type HistoryItem = {
    timestamp: string;
    status: 'ON' | 'OFF' | 'error';
    sensorName: string;
};

export const HistoryPage = () => {
    const { user } = useUserContext();
    const api = useMemo(() => initDeviceModule(fetch), []);
    const [, setDevices] = useState<Device[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.email) {
            setError('Missing user');
            setLoading(false);
            return;
        }

        api.getDevicesByUser(user.email)
            .then(async (deviceRes) => {
                setDevices(deviceRes.devices);

                const historyResults = await Promise.all(
                    deviceRes.devices.map(async (device) => {
                        try {
                            const res = await api.getDeviceHistory(device.uuid);
                            return res.history.map(item => ({
                                ...item,
                                sensorName: device.name ?? device.uuid
                            }));
                        } catch {
                            console.warn(`No history for device ${device.uuid}`);
                            return [];
                        }
                    })
                );

                const allHistory = historyResults.flat();

                setHistory(allHistory);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load devices or history');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, api]);


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

    if (history.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <p>No history available yet. Connect a device or wait for activity to appear.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date} className={styles.section}>
                    <h2 className={styles.sectionTitle}>{formatDateLabel(date)}</h2>
                    <div className={styles.cardList}>
                        {items.map((item, idx) => (
                            <HistoryCard
                                key={idx}
                                sensorName={item.sensorName}
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
