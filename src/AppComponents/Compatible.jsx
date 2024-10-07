import React from "react";
import "./Compatible.css"; // Ensure the styling file is created and updated

const Compatible = () => {
  return (
    <div className="compatibility-message-container">
      <img src="./ChatSpatium2.png" alt="Logo" />
      <div className="compatibility-message">
        No compatible width with this device
        <br />
        <span className="use-pc-message">Use PC || Tab to use the app</span>
      </div>
    </div>
  );
};

export default Compatible;
