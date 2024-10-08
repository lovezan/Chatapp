// PasswordResetModal.js
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth"; // Ensure you import sendPasswordResetEmail
import { auth } from "../../lib/firebase"; // Adjust the import based on your Firebase setup
import "./PasswordResetPopup.css"; // Create a CSS file for styling

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setEmail("");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <p className="modal-message">{message}</p>}
        </form>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PasswordResetModal;
