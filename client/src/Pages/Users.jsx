// Pages/Users.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AddUser from "../Components/AddUser";
import UserList from "../Components/UserList";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <AddUser onAdd={(user) => setUsers([...users, user])} />
      <UserList users={users} setUsers={setUsers} />
    </div>
  );
}

export default Users;
