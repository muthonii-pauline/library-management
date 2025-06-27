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
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Book</th>
          <th>Borrow Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {borrows.map((borrow) =>
          editingBorrow?.id === borrow.id ? (
            <tr key={borrow.id}>
              <td colSpan="5">Editing not implemented</td>
            </tr>
          ) : (
            <tr key={borrow.id}>
              <td>{borrow.user?.name}</td>
              <td>{borrow.book?.title}</td>
              <td>{borrow.borrow_date?.slice(0, 10)}</td>
              <td>
                {borrow.status === "borrowed"
                  ? "Borrowed"
                  : `Returned on ${borrow.return_date?.slice(0, 10)}`}
              </td>
              <td>
                {borrow.status === "borrowed" && (
                  <button onClick={() => markReturned(borrow.id)}>Mark Returned</button>
                )}
                <button onClick={() => handleDelete(borrow.id)}>Delete</button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default BorrowList;
