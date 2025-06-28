import { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "../Components/AddBook";
import BookList from "../Components/BookList";

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("/api/books").then((res) => setBooks(res.data));
  }, []);

  const handleAddBook = (book) => {
    setBooks((prev) => [...prev, book]);
  };

  return (
    <div className="books-container d-flex flex-wrap gap-4 justify-content-between">
      <div
        className="books-form flex-grow-1"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="text-center">Add a Book</h2>
        <AddBook onAdd={handleAddBook} />
      </div>

      <div className="books-list flex-grow-2" style={{ flex: "1 1 60%" }}>
        <h3 className="text-center">Library Collection</h3>
        <BookList books={books} setBooks={setBooks} />
      </div>
    </div>
  );
}

export default Books;
