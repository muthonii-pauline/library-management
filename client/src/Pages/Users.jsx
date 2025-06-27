import { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "../Components/AddUser";

const API = import.meta.env.VITE_API_BASE_URL;

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${API}/users`).then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <AddUser onUserAdded={(u) => setUsers([...users, u])} />
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}) - Books: {u.borrowed_books.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
