import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonProps {
    title: string;
    onClick?: () => void;
    isDisabled?: boolean;
    type?: 'active' | 'inactive';
}

export const Button = ({ title, onClick, isDisabled, type = 'inactive' }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={classNames(styles.btn, {
                [styles.active]: type === 'active',
                [styles.inactive]: type === 'inactive',
            })}
        >
            {title}
        </button>
    );
};
