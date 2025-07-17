import styles from './AppPreview.module.css';
import appPreview from './phone.png';

type AppPreviewProps = {
    className?: string;
};

export const AppPreview = ({ className }: AppPreviewProps) => {
    return (
        <div className={className}>
            <img src={appPreview} alt="App preview" className={styles.phoneImage} />
        </div>
    );
};
