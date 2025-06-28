import React, { useEffect } from "react";

function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="modal show fade d-block"
        tabIndex="-1"
        role="dialog"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Modal Dialog */}
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "500px", width: "90%" }}
        >
          <div className="modal-content border border-primary shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Confirm Action</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body">
              <p className="fs-5">{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmDialog;
