import { useState, useEffect } from "react";
import axios from "axios";
import ConfirmDialog from "../Components/ConfirmDialog";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Edit states
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [pendingEditId, setPendingEditId] = useState(null);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const triggerAddConfirm = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    setConfirmMessage(`Add new user "${newName}" to the system?`);
    setPendingNewUser({ name: newName, email: newEmail });
    setConfirmOpen(true);
  };

  const triggerEditConfirm = (id) => {
    setConfirmMessage(`Save changes for "${editName}"?`);
    setPendingEditId(id);
    setConfirmOpen(true);
  };

  const triggerDeleteConfirm = (id, name) => {
    setConfirmMessage(`Remove user "${name}" from the system?`);
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (pendingNewUser) {
      try {
        const res = await axios.post("/api/users", pendingNewUser);
        setUsers([...users, res.data]);
        setNewName("");
        setNewEmail("");
        setCurrentPage(Math.ceil((users.length + 1) / recordsPerPage));
      } catch (err) {
        alert("Error adding user: " + err.message);
      }
      setPendingNewUser(null);
    }

    if (pendingEditId) {
      try {
        const res = await axios.patch(`/api/users/${pendingEditId}`, {
          name: editName,
          email: editEmail,
        });
        setUsers(users.map((u) => (u.id === pendingEditId ? res.data : u)));
        cancelEdit();
      } catch (err) {
        alert("Error saving changes: " + err.message);
      }
      setPendingEditId(null);
    }

    if (pendingDeleteId !== null) {
      try {
        await axios.delete(`/api/users/${pendingDeleteId}`);
        setUsers(users.filter((u) => u.id !== pendingDeleteId));
      } catch (err) {
        alert("Error deleting user: " + err.message);
      }
      setPendingDeleteId(null);
    }

    setConfirmOpen(false);
    setConfirmMessage("");
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setConfirmMessage("");
    setPendingNewUser(null);
    setPendingEditId(null);
    setPendingDeleteId(null);
  };

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
      <h2 className="text-center mb-4">Library Users</h2>

      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {/* Add Form */}
        <div className="card shadow-sm p-3" style={{ minWidth: "280px", flex: "0 0 30%" }}>
          <h5 className="mb-3">Add New User</h5>
          <form onSubmit={triggerAddConfirm} className="d-grid gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary mt-2">
              Register User
            </button>
          </form>
        </div>

        {/* User Table */}
        <div style={{ flex: "1 1 60%" }}>
          {error && (
            <div className="alert alert-danger">Error: {error.message}</div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-2">
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
                            onClick={() => triggerEditConfirm(user.id)}
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
                            onClick={() => triggerDeleteConfirm(user.id, user.name)}
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
        </div>
      </div>

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
