import React from 'react';
import "./userinfo.css"
import { useUserStore } from '../../../lib/userStore';

const UserInfo = () => {

  const { currentUser} = useUserStore();


  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="User Avatar" className="avatar" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="More Options" className="icon" />
        <img src="./video.png" alt="Video Call" className="icon" />
        <img src="./edit.png" alt="Edit Profile" className="icon" />
      </div>
    </div>
  );
};

export default UserInfo;
