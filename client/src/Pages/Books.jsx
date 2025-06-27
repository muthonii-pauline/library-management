import { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "../Components/AddBook"; // Ensure this path is correct
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
    <div>
      <h1>📚 Books</h1>

      {loading && <p>Loading books...</p>}
      {error && (
        <p>⚠️ Error loading books: {error.message}</p>
      )}

      {!loading && !error && (
        <>
          <AddBook onAdd={handleAddBook} />
          <BookList books={books} setBooks={setBooks} />
        </>
      )}
    </div>
  );
}

export default Books;
