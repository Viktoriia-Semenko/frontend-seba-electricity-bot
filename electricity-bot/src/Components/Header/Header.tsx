import classNames from "classnames";
import styles from "../Header/Header.module.css";

interface HeaderProps {
    title: string;
    pageType?: 'login' | 'main';
}

export const Header = ({ title, pageType = 'login' } : HeaderProps) => {
    return (
        <div className={styles.header}>
            <p className={classNames(styles.btn, {
                [styles.login]: pageType === 'login',
                [styles.main]: pageType === 'main',
            })}>{title}</p>
        </div>
    );
};