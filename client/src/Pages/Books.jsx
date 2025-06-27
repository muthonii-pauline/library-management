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
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Books</h1>

      {loading && <p>Loading books...</p>}
      {error && (
        <p style={{ color: "red" }}>⚠️ Error loading books: {error.message}</p>
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

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    marginTop: "1rem",
  },
  listItem: {
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
};

export default Books;
