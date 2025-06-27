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
    <>
      <div className="books-container">
        <div className="books-form">
          <h2 className="text-center">Add Book</h2>
          {loading && <p>Loading books...</p>}
          {error && <p className="text-danger">⚠️ Error: {error.message}</p>}
          {!loading && !error && <AddBook onAdd={handleAddBook} />}
        </div>

        <div className="books-list">
          <h3 className="text-center">Library Collection</h3>
          {!loading && !error && <BookList books={books} setBooks={setBooks} />}
        </div>
      </div>
    </>
  );
}

export default Books;
