import { useEffect, useState } from "react";
import axios from "axios";
import BorrowBook from "../Components/BorrowBook";
import BorrowList from "../Components/BorrowList";

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
    axios
      .get(`${API_BASE_URL}/api/borrows`)
      .then((res) => setBorrows(res.data))
      .catch(() => setError("Failed to load borrow records"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddBorrow = (record) => {
    setBorrows((prev) => [...prev, record]);
  };

  if (loading) return <p>Loading borrow records...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const sortedBorrows = [...borrows].sort((a, b) => b.id - a.id);

  return (
    <div className="borrows-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="borrows-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Borrow a Book</h2>
        <BorrowBook onAdd={handleAddBorrow} />
      </div>

      <div className="borrows-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Borrow Records</h3>
        <BorrowList borrows={sortedBorrows} setBorrows={setBorrows} />
      </div>
    </div>
  );
}

export default Borrows;
