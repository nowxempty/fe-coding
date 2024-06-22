import React from 'react';
import UserProfileIcon from "../../../../components/Icon/UserProfileIcon"
import './UserItem.css';

const UserItem = ({ profileImage, name, ready }) => {
    return (
        <div className="user-item">
            <div className="user-profile-image">
                {profileImage ? (
                    <img src={profileImage} alt={`${name}'s profile`} />
                ) : (
                    <UserProfileIcon />
                )}
            </div>
            <h3>{name}</h3>
            <p className={`user-status ${ready ? 'ready' : 'not-ready'}`}>
                {ready ? '준비 완료' : '준비 중'}
            </p>
        </div>
    );
}

export default UserItem;
