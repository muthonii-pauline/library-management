import { useState, useEffect } from "react";

export default function BorrowForm({ onSubmit }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    book_id: "",
    status: "borrowed",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
    fetch("/api/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <select name="user_id" value={form.user_id} onChange={handleChange}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <select name="book_id" value={form.book_id} onChange={handleChange}>
        <option value="">Select Book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.title}
          </option>
        ))}
      </select>
      <button type="submit">Borrow</button>
    </form>
  );
}
