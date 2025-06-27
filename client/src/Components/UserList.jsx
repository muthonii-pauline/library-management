import { useState } from "react";
import axios from "axios";
import EditUser from "./EditUser";
import ConfirmDialog from "./ConfirmDialog";

function UserList({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete.id);
    }
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
  };

  return (
    <>
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
                  <button onClick={() => confirmDelete(user)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          message={`Are you sure you want to delete "${userToDelete?.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}

export default UserList;
