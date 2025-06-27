import { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "../Components/AddBook";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBooks([]); // fallback
      });
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <AddBook onAdd={(book) => setBooks([...books, book])} />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Available Copies</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(books) && books.length > 0 ? (
            books.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.available_copies}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No books available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
