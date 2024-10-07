import React from 'react';
import './Buttom.css'; // Make sure to create this file for the styling

const Button = () => {
  return (
    <div className="button-container">
        <p className="connect-message">Connect with the developer via username <span className="username">ChatSpatium</span></p>
        <img src="./ChatSpatium2.png" alt="Logo" className="logo" />
      <p className="copyright">© 2024 ChatSpatium. All rights reserved.</p>
    </div>
  );
};

export default Button;