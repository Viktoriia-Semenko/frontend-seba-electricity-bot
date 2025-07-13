import './styles.css'
import userCardImage from './img/user-card.svg'
import femaleImage from './img/female-user-image.png'
import otherCardImage from './img/other-user-image.png'

export interface UserCardProps {
    firstName?: string;
    lastName?: string;
    image?: string;
    sex?: 'male' | 'female' | 'other';
    onClick?: () => void;
}

export const UserCard = ({ firstName, lastName, sex = 'other', image, onClick }: UserCardProps) => {
    const defaultImage =
        sex === 'male' ? userCardImage :
            sex === 'female' ? femaleImage : otherCardImage;

    return (
        <div className="user-card" onClick={onClick}>
            <img
                className="user-image"
                src={image ?? defaultImage}
                alt="User"
            />
            <div className="user-name-container">
                <p className="user-name">{firstName}</p>
                <p className="user-surname">{lastName}</p>
            </div>
        </div>
    );
};
