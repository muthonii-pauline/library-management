import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get(`${API}/books`).then((res) => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> by {b.author} - {b.available_copies}{" "}
            copies
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Books;
