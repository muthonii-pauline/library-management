// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Users from "./Pages/Users";
import Books from "./Pages/Books";
import Borrows from "./Pages/Borrows";

function App() {
  return (
    <Router>
      <nav>
        <NavLink to="/">Users</NavLink> | <NavLink to="/books">Books</NavLink> |{" "}
        <NavLink to="/borrows">Borrows</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/books" element={<Books />} />
        <Route path="/borrows" element={<Borrows />} />
      </Routes>
    </Router>
  );
}

export default App;
