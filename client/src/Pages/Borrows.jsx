// Pages/Borrows.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import BorrowBook from "../Components/BorrowBook";
import BorrowList from "../Components/BorrowList";

function Borrows() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    axios.get("/api/borrows").then((res) => setBorrows(res.data));
  }, []);

  return (
    <div>
      <h1>Borrow Records</h1>
      <BorrowBook onAdd={(record) => setBorrows([...borrows, record])} />
      <BorrowList borrows={borrows} setBorrows={setBorrows} />
    </div>
  );
}

export default Borrows;
