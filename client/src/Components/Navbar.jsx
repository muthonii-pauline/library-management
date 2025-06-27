import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <h1>Library System</h1>
      <Link to="/">Home</Link>
      <Link to="/books">Books</Link>
      <Link to="/users">Users</Link>
      <Link to="/borrows">Borrows</Link>
    </nav>
  );
}
