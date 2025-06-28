import { useState } from "react";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function BorrowList({ borrows, setBorrows }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingReturnId, setPendingReturnId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/borrows/${id}`);
      setBorrows(borrows.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const markReturned = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/borrows/${id}/return`);
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

  // === Search & Pagination ===
  const filtered = [...borrows]
    .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date))
    .filter(
      (b) =>
        b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / recordsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by user or book"
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div>
          Page {currentPage} of {totalPages}
          <button
            className="btn btn-sm btn-outline-primary mx-1"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <table className="table table-bordered border-primary shadow-sm">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Status</th>
            <th className="text-center">Return</th>
            <th className="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No borrow records found.
              </td>
            </tr>
          ) : (
            paginated.map((borrow) => (
              <tr
                key={borrow.id}
                className={
                  borrow.status === "borrowed"
                    ? "table-warning"
                    : "table-success"
                }
              >
                <td>{borrow.user?.name}</td>
                <td>{borrow.book?.title}</td>
                <td>{borrow.borrow_date?.slice(0, 10)}</td>
                <td>
                  {borrow.status === "borrowed"
                    ? "Borrowed"
                    : `Returned on ${borrow.return_date?.slice(0, 10)}`}
                </td>
                <td className="text-center">
                  {borrow.status === "borrowed" ? (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setPendingReturnId(borrow.id);
                        setConfirmMessage("Mark this borrow as returned?");
                        setConfirmOpen(true);
                      }}
                    >
                      Mark Returned
                    </button>
                  ) : (
                    <span className="text-muted">✓ Returned</span>
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setPendingDeleteId(borrow.id);
                      setConfirmMessage("Delete this borrow record?");
                      setConfirmOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
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
