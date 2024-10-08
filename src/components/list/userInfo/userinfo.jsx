import React from "react";
import "./userinfo.css";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase"; // Adjust the path based on your project structure
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon

const UserInfo = () => {
  const { currentUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user using Firebase auth
      // You may also want to reset your user store or handle any other cleanup here
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="userinfo">
      <div className="user">
        <img
          src={currentUser.avatar || "./avatar.png"}
          alt="User Avatar"
          className="avatar"
        />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt className="logout-icon" /> {/* Use React Icon here */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
