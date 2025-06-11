import './Sensor.css';
import apartmentIcon from './img/apartamentSensor-icon.svg';
import officeIcon from './img/officeSensor-icon.svg';

export interface SensorCardProps {
    label: string;
    timestamp: string;
    type: 'apartment' | 'office';
    onClick?: () => void;
}

export const SensorCard = ({ label, timestamp, type, onClick }: SensorCardProps) => {
    const icon = type === 'office' ? officeIcon : apartmentIcon;

    return (
        <div className="sensor-card" onClick={onClick}>
            <div className="sensor-icon-circle">
                <img src={icon} alt={`${type} icon`} className="sensor-icon" />
            </div>
            <div className="sensor-info">
                <p className="sensor-label">{label}</p>
                <p className="sensor-timestamp">{timestamp}</p>
            </div>
        </div>
    );
};