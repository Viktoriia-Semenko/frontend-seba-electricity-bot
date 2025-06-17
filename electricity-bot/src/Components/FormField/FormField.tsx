import styles from './FormField.module.css';

interface FormFieldProps {
    label: string;
    type?: 'text' | 'select';
    name: string;
    value: string;
    placeholder?: string;
    options?: string[]; // тільки для select
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const FormField = ({
                              label,
                              type = 'text',
                              name,
                              value,
                              placeholder,
                              options,
                              error,
                              onChange,
                          }: FormFieldProps) => {
    return (
        <div className={styles.fieldWrapper}>
            <label className={styles.label} htmlFor={name}>{label}</label>

            {type === 'text' ? (
                <input
                    type="text"
                    name={name}
                    id={name}
                    className={`${styles.input} ${error ? styles.errorInput : ''}`}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            ) : (
                <select
                    name={name}
                    id={name}
                    className={`${styles.select} ${error ? styles.errorInput : ''}`}
                    value={value}
                    onChange={onChange}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};
