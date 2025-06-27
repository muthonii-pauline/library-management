import { useEffect, useState } from "react";
import axios from "axios";
import BorrowBook from "../Components/BorrowBook";

const API = import.meta.env.VITE_API_BASE_URL;

function Borrows() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    axios.get(`${API}/borrows`).then((res) => setBorrows(res.data));
  }, []);

  function markReturned(id) {
    axios
      .patch(`${API}/borrows/${id}`, {
        status: "returned",
        return_date: new Date().toISOString(),
      })
      .then((res) => {
        setBorrows(borrows.map((b) => (b.id === id ? res.data : b)));
      });
  }

  return (
    <div>
      <h2>Borrows</h2>
      <BorrowBook onBorrowed={(b) => setBorrows([...borrows, b])} />
      <ul>
        {borrows.map((b) => (
          <li key={b.id}>
            User {b.user_id} borrowed Book {b.book_id} on{" "}
            {new Date(b.borrow_date).toLocaleDateString()}— Status:{" "}
            <strong>{b.status}</strong>
            {b.status === "borrowed" && (
              <button onClick={() => markReturned(b.id)}>Mark Returned</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Borrows;
