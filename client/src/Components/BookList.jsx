import { useState } from "react";
import axios from "axios";

function BookList({ books, setBooks }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedBook, setEditedBook] = useState({});

  const booksPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );
  const pageCount = Math.ceil(filteredBooks.length / booksPerPage);

  const handleEdit = (book) => {
    setEditingId(book.id);
    setEditedBook(book);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedBook({ ...editedBook, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/api/books/${editingId}`, editedBook);
      setBooks(books.map((b) => (b.id === editingId ? res.data : b)));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update book:", err);
      alert("Update failed.");
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
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
            {paginatedBooks.map((book) =>
              editingId === book.id ? (
                <tr key={book.id}>
                  <td>
                    <input
                      name="title"
                      value={editedBook.title}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      name="author"
                      value={editedBook.author}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      name="genre"
                      value={editedBook.genre || ""}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      name="available_copies"
                      type="number"
                      min="1"
                      value={editedBook.available_copies}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </td>
                  <td>
                    <button
                      onClick={handleUpdate}
                      className="btn btn-sm btn-success me-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn btn-sm btn-secondary"
                    >
                      Cancel
                    </button>
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
                      onClick={() => handleEdit(book)}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: pageCount }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default BookList;
