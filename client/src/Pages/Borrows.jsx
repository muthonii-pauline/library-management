import { useEffect, useState } from "react";
import axios from "axios";
import BorrowBook from "../Components/BorrowBook";
import BorrowList from "../Components/BorrowList";

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/borrows")
      .then((res) => setBorrows(res.data))
      .catch((err) => {
        console.error("Error fetching borrows:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddBorrow = (newBorrow) => {
    setBorrows([...borrows, newBorrow]);
  };

  return (
    <div className="borrows-container">
      <div className="borrows-form mb-4">
        <h2 className="text-center">📘 Borrow a Book</h2>
        {error && <p className="text-danger">⚠️ Error: {error.message}</p>}
        <BorrowBook onAdd={handleAddBorrow} />
      </div>

      <div className="borrows-list">
        <h3 className="text-center">Borrow Records</h3>
        {loading ? (
          <p>Loading borrow records...</p>
        ) : (
          <BorrowList borrows={borrows} setBorrows={setBorrows} />
        )}
      </div>
    </div>
  );
}

export default Borrows;
