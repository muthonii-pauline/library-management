import { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "../Components/AddBook";
import BookList from "../Components/BookList";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/books")
      .then((res) => {
        setBooks(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddBook = (newBook) => {
    setBooks([...books, newBook]);
  };

  return (
    <div
      className="books-container"
      style={{ display: "flex", gap: "2rem", padding: "1rem" }}
    >
      <div className="books-form" style={{ flex: 1 }}>
        <h2 className="text-center mb-3">Add Book</h2>
        {loading && <p>Loading books...</p>}
        {error && <p className="text-danger">⚠️ Error: {error.message}</p>}
        {!loading && !error && <AddBook onAdd={handleAddBook} />}
      </div>

      <div className="books-list" style={{ flex: 2 }}>
        <h3 className="text-center mb-3">Library Collection</h3>
        {!loading && !error && <BookList books={books} setBooks={setBooks} />}
      </div>
    </div>
  );
}

export default Books;
