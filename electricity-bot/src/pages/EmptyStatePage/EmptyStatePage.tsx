import { ActionButton } from '../../Components/ActionButton/ActionButton';

export const EmptyStatePage = () => {
    return (
        <div style={{ color: 'white' }}>
            <h2>Add device to see the data</h2>
            <ActionButton title="Add" onClick={() => console.log('Navigate to device creation')} />
        </div>
    );
};
