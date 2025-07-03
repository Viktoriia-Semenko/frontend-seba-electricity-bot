import styles from './AppPreview.module.css';
import appPreview from './phone.png';

export const AppPreview = () => {
    return (
        <div className={styles.phoneZone}>
            <img src={appPreview} alt="App preview" className={styles.phoneImage} />
        </div>
    );
};
