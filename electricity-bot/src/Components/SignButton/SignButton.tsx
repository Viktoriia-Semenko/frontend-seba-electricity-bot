import './styles.css';

interface SignButtonProps {
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
    htmlType?:  "button" | "submit" | "reset" | undefined;
}

export const SignButton = ({ title, onClick, isDisabled, htmlType = "button"}: SignButtonProps) => {
    return (
        <button type={htmlType} className='sign-button' onClick={onClick} disabled={isDisabled}>{title}</button>
    );
};