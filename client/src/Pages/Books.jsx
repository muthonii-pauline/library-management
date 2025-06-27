// Pages/Books.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "../Components/AddBook";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("/api/books").then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h1>Books</h1>
      <AddBook onAdd={(book) => setBooks([...books, book])} />
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            {b.title} by {b.author} - {b.available_copies} copies
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
