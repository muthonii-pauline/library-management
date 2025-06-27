import { useState } from "react";
import axios from "axios";
import EditBook from "./EditBook";
import ConfirmDialog from "./ConfirmDialog";

function BookList({ books, setBooks }) {
  const [editingBook, setEditingBook] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDelete = async (id) => {
    await axios.delete(`/api/books/${id}`);
    setBooks(books.filter((b) => b.id !== id));
  };

  const handleUpdate = (updated) => {
    setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
    setEditingBook(null);
  };

  const handleConfirm = () => {
    if (pendingDeleteId !== null) {
      handleDelete(pendingDeleteId);
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Available Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) =>
            editingBook?.id === book.id ? (
              <tr key={book.id}>
                <td colSpan="5">
                  <EditBook
                    book={book}
                    onUpdate={handleUpdate}
                    onCancel={() => setEditingBook(null)}
                  />
                </td>
              </tr>
            ) : (
              <tr key={book.id}>
                <td>
                  <strong>{book.title}</strong>
                </td>
                <td>{book.author}</td>
                <td>{book.genre || "—"}</td>
                <td>{book.available_copies}</td>
                <td>
                  <button
                    onClick={() => setEditingBook(book)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setPendingDeleteId(book.id);
                      setConfirmOpen(true);
                    }}
                    className="btn btn-sm btn-danger"
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
        message="Are you sure you want to delete this book?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default BookList;
