import './History.css';

export interface HistoryCardProps {
    sensorName: string;
    status: 'restored' | 'lost';
    time: string | number;
    isLast?: boolean;
}

export const HistoryCard = ({ sensorName, status, time, isLast = false }: HistoryCardProps) => {
    const isRestored = status === 'restored';
    const statusText = isRestored ? 'Electricity restored' : 'Electricity lost';
    const statusClass = isRestored ? 'green' : 'red';

    const formattedTime = new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });


    return (
        <div className={`history-card ${isLast ? 'no-border' : ''}`}>
            <div className="status-block">
                <div className={`status-indicator ${statusClass}`} />
                <div className="sensor-time">{formattedTime}</div>
            </div>

            <div className="sensor-info">
                <div className="sensor-name">{sensorName}</div>
                <div className="sensor-status">{statusText}</div>
            </div>
        </div>
    );
};
