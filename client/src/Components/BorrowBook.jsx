import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

function BorrowBook({ onBorrowed }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [data, setData] = useState({ user_id: "", book_id: "" });

  useEffect(() => {
    axios.get(`${API}/users`).then((res) => setUsers(res.data));
    axios.get(`${API}/books`).then((res) => setBooks(res.data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    axios.post(`${API}/borrows`, data).then((res) => {
      onBorrowed(res.data);
      setData({ user_id: "", book_id: "" });
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={data.user_id}
        onChange={(e) => setData({ ...data, user_id: e.target.value })}
        required
      >
        <option value="">Select User</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      <select
        value={data.book_id}
        onChange={(e) => setData({ ...data, book_id: e.target.value })}
        required
      >
        <option value="">Select Book</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <button type="submit">Borrow Book</button>
    </form>
  );
}

export default BorrowBook;
