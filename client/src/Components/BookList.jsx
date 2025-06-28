import { useState } from "react";
import axios from "axios";

function BookList({ books, setBooks }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

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
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by title"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        {pageCount > 1 && (
          <div>
            Page {currentPage} of {pageCount}
            <button
              className="btn btn-sm btn-outline-primary mx-1"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered border-primary table-hover shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Available</th>
              <th className="text-center">Actions</th>
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
                  <td className="text-center">
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
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre || "—"}</td>
                  <td>{book.available_copies}</td>
                  <td className="text-center">
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
    </div>
  );
}

export default BookList;
