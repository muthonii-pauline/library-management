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
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) =>
          editingUser?.id === user.id ? (
            <tr key={user.id}>
              <td colSpan="3">
                <EditUser
                  user={user}
                  onUpdate={handleUpdate}
                  onCancel={() => setEditingUser(null)}
                />
              </td>
            </tr>
          ) : (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

export default UserList;
