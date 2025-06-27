import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  return (
    <div>
      <h2>Books</h2>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
