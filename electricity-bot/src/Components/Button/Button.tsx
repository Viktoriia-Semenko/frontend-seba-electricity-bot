import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonProps {
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
    type?: 'default' | 'inverse';
}

export const Button = ({ title, onClick, isDisabled, type = 'default' }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={classNames(styles.btn, {
                [styles.inverse]: type === 'inverse',
                [styles.default]: type === 'default',
            })}
        >
            {title}
        </button>
    );
};
