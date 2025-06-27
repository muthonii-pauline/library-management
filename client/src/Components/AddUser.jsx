import { useState, useEffect } from "react";
import axios from "axios";
import AddUser from "../Components/AddUser";
import ConfirmDialog from "../Components/ConfirmDialog";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inline editing state
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Delete confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Add user handler passed to AddUser component
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    // Optional: jump to last page if paginating
    setCurrentPage(Math.ceil((users.length + 1) / recordsPerPage));
  };

  // Inline editing functions
  const startEdit = (user) => {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
  };

  const saveEdit = async (id) => {
    if (!editName.trim() || !editEmail.trim()) return;
    try {
      const res = await axios.patch(`/api/users/${id}`, {
        name: editName,
        email: editEmail,
      });
      setUsers(users.map((u) => (u.id === id ? res.data : u)));
      cancelEdit();
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    await axios.delete(`/api/users/${id}`);
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleConfirm = () => {
    if (pendingDeleteId !== null) {
      handleDelete(pendingDeleteId);
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setConfirmMessage("");
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
    setConfirmMessage("");
  };

  // Filter & paginate users
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / recordsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Users</h2>

      <div className="mb-4">
        <AddUser onAdd={handleAddUser} />
      </div>

      {error && (
        <div className="alert alert-danger">Error: {error.message}</div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by name or email"
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div>
          Page {currentPage} of {totalPages}
          <button
            className="btn btn-sm btn-outline-primary mx-1"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-bordered border-primary table-hover shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user) => (
              <tr key={user.id}>
                <td>
                  {editId === user.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editId === user.id ? (
                    <input
                      type="email"
                      className="form-control"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="text-center">
                  {editId === user.id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => saveEdit(user.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setPendingDeleteId(user.id);
                          setConfirmMessage(`Delete user ${user.name}?`);
                          setConfirmOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message={confirmMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default Users;
