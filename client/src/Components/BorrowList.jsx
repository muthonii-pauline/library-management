import { useState } from "react";
import axios from "axios";

function BorrowList({ borrows, setBorrows }) {
  const [editingBorrow, setEditingBorrow] = useState(null);

  const handleDelete = async (id) => {
    await axios.delete(`/api/borrows/${id}`);
    setBorrows(borrows.filter((b) => b.id !== id));
  };

  const markReturned = async (id) => {
    try {
      const res = await axios.patch(`/api/borrows/${id}/return`);
      setBorrows(borrows.map((b) => (b.id === id ? res.data : b)));
    } catch (err) {
      console.error("Failed to mark as returned:", err);
    }
  };

  return (
    <ul>
      {borrows.map((borrow) =>
        editingBorrow?.id === borrow.id ? (
          // For simplicity, editing borrow is not implemented here
          <li key={borrow.id}>Editing not implemented</li>
        ) : (
          <li key={borrow.id}>
            User {borrow.user?.name} borrowed {borrow.book?.title} on{" "}
            {borrow.borrow_date?.slice(0, 10)}
            {borrow.status === "borrowed" ? (
              <button onClick={() => markReturned(borrow.id)}>Mark Returned</button>
            ) : (
              <> - Returned on {borrow.return_date?.slice(0, 10)}</>
            )}
            <button onClick={() => handleDelete(borrow.id)}>Delete</button>
          </li>
        )
      )}
    </ul>
  );
}

export default BorrowList;
