// Pages/Borrows.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import BorrowBook from "../Components/BorrowBook";

function Borrows() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    axios.get("/api/borrows").then((res) => setBorrows(res.data));
  }, []);

  const markReturned = async (id) => {
    try {
      const res = await axios.patch(`/api/borrows/${id}`, {
        status: "returned",
        return_date: new Date().toISOString(),
      });
      setBorrows(borrows.map((b) => (b.id === id ? res.data : b)));
    } catch (err) {
      console.error("Failed to mark as returned:", err);
    }
  };

  return (
    <div>
      <h1>Borrow Records</h1>
      <BorrowBook onAdd={(record) => setBorrows([...borrows, record])} />
      <ul>
        {borrows.map((b) => (
          <li key={b.id}>
            User {b.user?.name} borrowed {b.book?.title} on{" "}
            {b.borrow_date?.slice(0, 10)}
            {b.status === "borrowed" ? (
              <button onClick={() => markReturned(b.id)}>Mark Returned</button>
            ) : (
              <> - Returned on {b.return_date?.slice(0, 10)}</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Borrows;
