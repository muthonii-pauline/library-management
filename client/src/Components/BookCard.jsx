export default function BookCard({ book }) {
  return (
    <div className="card">
      <h3>{book.title}</h3>
      <p>By {book.author}</p>
      <p>Available: {book.available_copies}</p>
    </div>
  );
}
