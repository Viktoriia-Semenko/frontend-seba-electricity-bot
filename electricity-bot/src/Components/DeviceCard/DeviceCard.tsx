import './styles.css'

export interface DeviceCardProps {
    name: string;
    status: 'online' | 'offline';
    onClick?: () => void;
}

export const DeviceCard = ({ name, status, onClick }: DeviceCardProps) => {
    return (
        <div className="device-card" onClick={onClick}>
            <h2 className="device-name">{name}</h2>
            <p className={`device-status ${status}`}>{status === 'online' ? 'Online' : 'Offline'}</p>
        </div>
    );
};