import React from "react";
import "./ConfirmationModal.css"; // Add your styling for the modal

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onConfirm}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
