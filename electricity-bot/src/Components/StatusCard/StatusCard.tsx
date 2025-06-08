import './styles.css'

import OnlineImg from './img/home-icon-online.png'
import OfflineImg from './img/home-icon-offline.png'

export interface StatusCardProps {
    status: 'ON' | 'OFF' | 'error';
    timestamp: string;
    onClick?: () => void;
}

export const StatusCard = ({ status, timestamp, onClick }: StatusCardProps) => {
    const statusImage = status === 'ON' ? OnlineImg : OfflineImg;
    const formattedTimestamp = new Date(timestamp).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const capitalizedStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
        <div className="status-card" onClick={onClick}>
            <div className="status-card__header">
                <img src={statusImage} alt="Status Icon" className="status-icon" />
                <h2 className='status-card__title'>Power: <span
                    className={`status-value status-${status.toLowerCase()}`}>{capitalizedStatus}</span>
                </h2>
            </div>
            <p className='last-change'>{`Last change: ${formattedTimestamp}`}</p>
        </div>
    );
};