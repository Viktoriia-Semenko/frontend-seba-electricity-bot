import './styles.css';

interface ActionButtonProps {
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

export const ActionButton = ({ title, onClick, isDisabled}: ActionButtonProps) => {
    return (
        <button className='action-button' onClick={onClick} disabled={isDisabled}>{title}</button>
    );
};
