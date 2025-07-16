import './styles.css';

interface ActionButtonProps {
    type?: 'button' | 'submit' | 'reset';
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

export const ActionButton = ({ title, onClick, isDisabled, type = 'button'}: ActionButtonProps) => {
    return (
        <button type={type} className='action-button' onClick={onClick} disabled={isDisabled}>{title}</button>
    );
};
