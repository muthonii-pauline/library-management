import { useState } from "react";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function BorrowList({ borrows, setBorrows }) {
  const [editingBorrow, setEditingBorrow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingReturnId, setPendingReturnId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const handleDelete = async (id) => {
    await axios.delete(`/api/borrows/${id}`);
    setBorrows(borrows.filter((b) => b.id !== id));
  };

  const markReturned = async (id) => {
    try {
      const res = await axios.patch(`/api/borrows/${id}/return`);
      setBorrows(borrows.map((b) => (b.id === id ? res.data : b)));
    } catch (err) {
      console.error("Failed to mark as returned:", err);
    }
  };

  const handleConfirm = () => {
    if (pendingReturnId !== null) {
      markReturned(pendingReturnId);
    } else if (pendingDeleteId !== null) {
      handleDelete(pendingDeleteId);
    }
    setConfirmOpen(false);
    setPendingReturnId(null);
    setPendingDeleteId(null);
    setConfirmMessage("");
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingReturnId(null);
    setPendingDeleteId(null);
    setConfirmMessage("");
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow) =>
            editingBorrow?.id === borrow.id ? (
              <tr key={borrow.id}>
                <td colSpan="5">Editing not implemented</td>
              </tr>
            ) : (
              <tr key={borrow.id}>
                <td>{borrow.user?.name}</td>
                <td>{borrow.book?.title}</td>
                <td>{borrow.borrow_date?.slice(0, 10)}</td>
                <td>
                  {borrow.status === "borrowed"
                    ? "Borrowed"
                    : `Returned on ${borrow.return_date?.slice(0, 10)}`}
                </td>
                <td>
                  {borrow.status === "borrowed" && (
                    <button
                      onClick={() => {
                        setPendingReturnId(borrow.id);
                        setConfirmMessage("Are you sure you want to mark this borrow as returned?");
                        setConfirmOpen(true);
                      }}
                    >
                      Mark Returned
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPendingDeleteId(borrow.id);
                      setConfirmMessage("Are you sure you want to delete this borrow?");
                      setConfirmOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default BorrowList;
