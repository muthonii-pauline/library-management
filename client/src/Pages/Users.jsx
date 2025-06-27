// Pages/Users.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "../Components/AddUser";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <AddUser onAdd={(user) => setUsers([...users, user])} />
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
