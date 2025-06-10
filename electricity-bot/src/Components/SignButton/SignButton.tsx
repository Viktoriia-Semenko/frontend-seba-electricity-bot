import './styles.css';

interface SignButtonProps {
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

export const SignButton = ({ title, onClick, isDisabled}: SignButtonProps) => {
    return (
        <button className='sign-button' onClick={onClick} disabled={isDisabled}>{title}</button>
    );
};