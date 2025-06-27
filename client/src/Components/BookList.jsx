import { useState } from "react";
import axios from "axios";
import EditBook from "./EditBook";

function BookList({ books, setBooks }) {
  const [editingBook, setEditingBook] = useState(null);

  const handleDelete = async (id) => {
    await axios.delete(`/api/books/${id}`);
    setBooks(books.filter((b) => b.id !== id));
  };

  const handleUpdate = (updated) => {
    setBooks(books.map((b) => (b.id === updated.id ? updated : b)));
    setEditingBook(null);
  };

  return (
    <ul>
      {books.map((book) =>
        editingBook?.id === book.id ? (
          <EditBook
            key={book.id}
            book={book}
            onUpdate={handleUpdate}
            onCancel={() => setEditingBook(null)}
          />
        ) : (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} —{" "}
            <em>{book.available_copies}</em> copies available
            <button onClick={() => setEditingBook(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        )
      )}
    </ul>
  );
}

export default BookList;
