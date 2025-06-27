import React from "react";

function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        textAlign: "center",
      }}>
        <p>{message}</p>
        <div style={{ marginTop: "20px" }}>
          <button onClick={onConfirm} style={{ marginRight: "10px" }}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
