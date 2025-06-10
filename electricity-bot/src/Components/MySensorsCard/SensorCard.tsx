import './Sensor.css';
import homeIcon from './img/apartamentSensor-icon.svg';

export interface SensorCardProps {
    label: string;
    timestamp: string;
    image?: string;
    onClick?: () => void;
}

export const SensorCard = ({label, timestamp, image = homeIcon, onClick,}: SensorCardProps) => {
    return (
        <div className="sensor-card" onClick={onClick}>
            <img src={image} alt="Sensor icon" className="sensor-icon" />
            <div className="sensor-info">
                <h2 className="sensor-label">{label}</h2>
                <p className="sensor-timestamp">{timestamp}</p>
            </div>
        </div>
    );
};