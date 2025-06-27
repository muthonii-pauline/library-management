import { useState } from "react";
import BorrowForm from "../components/BorrowForm";

export default function Borrows() {
  const [message, setMessage] = useState("");

  function handleBorrow(data) {
    fetch("/api/borrows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to borrow");
      })
      .then((borrow) => {
        setMessage("Successfully borrowed!");
      })
      .catch((err) => setMessage(err.message));
  }

  return (
    <div>
      <h2>Borrow Book</h2>
      <BorrowForm onSubmit={handleBorrow} />
      {message && <p>{message}</p>}
    </div>
  );
}
