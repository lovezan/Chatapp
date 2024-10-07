import React from "react";
import "./detail.css";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import Button from './Buttom';

import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReciverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReciverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Let's Build Big Network Togeather</p>
      </div>
      <div className="info">
        <div className="option">
          {/* <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div> */}
          {/* <div className="photos">
            <div className="photoItem">
              <div className="photsDetail">
                <img
                  src="https://www.imagineonline.store/cdn/shop/files/iPhone_15_Pink_PDP_Image_Position-1__en-IN.jpg?v=1694605258"
                  alt=""
                />
                <span>photo_2020_1.png</span>
              </div>
              <img src="./download.png" alt="" />
            </div>
            <div className="photoItem">
              <div className="photsDetail">
                <img
                  src="https://www.imagineonline.store/cdn/shop/files/iPhone_15_Pink_PDP_Image_Position-1__en-IN.jpg?v=1694605258"
                  alt=""
                />
                <span>photo_2020_1.png</span>
              </div>
              <img src="./download.png" alt="" />
            </div>
          </div> */}
          {/* <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div> */}
          <button onClick={handleBlock}>
            {isCurrentUserBlocked
              ? "You Are Blocked"
              : isReciverBlocked
              ? "User Blocked"
              : "Block User"}
          </button>
        </div>
      </div>

      {/* Add Logout button at the end of the detail component */}
      <button className="logout" onClick={() => auth.signOut()}>
        Logout
      </button>
      <Button />
    </div>
  );
};

export default Detail;
