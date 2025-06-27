// Components/UserList.jsx
import { useState } from "react";
import axios from "axios";
import EditUser from "./EditUser";

function UserList({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = async (id) => {
    await axios.delete(`/api/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleUpdate = (updated) => {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
  };

  return (
    <ul>
      {users.map((user) =>
        editingUser?.id === user.id ? (
          <EditUser
            key={user.id}
            user={user}
            onUpdate={handleUpdate}
            onCancel={() => setEditingUser(null)}
          />
        ) : (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => setEditingUser(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        )
      )}
    </ul>
  );
}

export default UserList;
