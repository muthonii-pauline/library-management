import { useState } from "react";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function BorrowList({ borrows, setBorrows }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingReturnId, setPendingReturnId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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

  // === Search & Filter ===
  const filtered = [...borrows]
    .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date))
    .filter(
      (b) =>
        b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
   //=== Pagination===
  const totalPages = Math.ceil(filtered.length / recordsPerPage);
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

      <table className="table table-bordered border-primary">
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Book</th>
            <th>Borrow Date</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((borrow) => (
            <tr
              key={borrow.id}
              className={
                borrow.status === "borrowed" ? "table-warning" : "table-success"
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
                {borrow.status === "borrowed" && (
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => {
                      setPendingReturnId(borrow.id);
                      setConfirmMessage("Mark this book as returned?");
                      setConfirmOpen(true);
                    }}
                  >
                    Mark Returned
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setPendingDeleteId(borrow.id);
                    setConfirmMessage(
                      "Are you sure you want to delete this record from the system?"
                    );
                    setConfirmOpen(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
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
