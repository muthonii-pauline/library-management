import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ConfirmDialog from "../Components/ConfirmDialog";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newErrors, setNewErrors] = useState({});

  // Edit states
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editErrors, setEditErrors] = useState({});

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [pendingEditId, setPendingEditId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Debounce search input to improve performance
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const validateUser = (name, email) => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";
    return errs;
  };

  const triggerAddConfirm = (e) => {
    e.preventDefault();
    const errs = validateUser(newName, newEmail);
    setNewErrors(errs);
    if (Object.keys(errs).length === 0) {
      setConfirmMessage(`Add new user "${newName}" to the system?`);
      setPendingNewUser({ name: newName.trim(), email: newEmail.trim() });
      setConfirmOpen(true);
    }
  };

  const triggerEditConfirm = (id) => {
    const errs = validateUser(editName, editEmail);
    setEditErrors(errs);
    if (Object.keys(errs).length === 0) {
      setConfirmMessage(`Save changes for "${editName}"?`);
      setPendingEditId(id);
      setConfirmOpen(true);
    }
  };

  const triggerDeleteConfirm = (id, name) => {
    setConfirmMessage(`Remove user "${name}" from the system?`);
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      if (pendingNewUser) {
        const res = await axios.post("/api/users", pendingNewUser);
        setUsers((prev) => [...prev, res.data]);
        setNewName("");
        setNewEmail("");
        alert("User added successfully.");
        setPendingNewUser(null);
      }

      if (pendingEditId) {
        const res = await axios.patch(`/api/users/${pendingEditId}`, {
          name: editName.trim(),
          email: editEmail.trim(),
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === pendingEditId ? res.data : u))
        );
        cancelEdit();
        setPendingEditId(null);
      }

      if (pendingDeleteId !== null) {
        await axios.delete(`/api/users/${pendingDeleteId}`);
        setUsers((prev) => prev.filter((u) => u.id !== pendingDeleteId));
        setPendingDeleteId(null);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setConfirmOpen(false);
      setConfirmMessage("");
      setIsProcessing(false);
    }
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
    setEditErrors({});
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
    setEditErrors({});
  };

  const sortedUsers = [...users].sort((a, b) => b.id - a.id);

  const filtered = sortedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(debouncedSearch) ||
      u.email.toLowerCase().includes(debouncedSearch)
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
        <div
          className="card shadow-sm p-3"
          style={{ minWidth: "280px", flex: "0 0 30%" }}
        >
          <h5 className="mb-3">Add New User</h5>
          <form
            onSubmit={triggerAddConfirm}
            className="d-grid gap-2"
            noValidate
          >
            <input
              type="text"
              className={`form-control ${newErrors.name ? "is-invalid" : ""}`}
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              aria-invalid={newErrors.name ? "true" : undefined}
              aria-describedby="newNameError"
            />
            {newErrors.name && (
              <div id="newNameError" className="invalid-feedback">
                {newErrors.name}
              </div>
            )}

            <input
              type="email"
              className={`form-control ${newErrors.email ? "is-invalid" : ""}`}
              placeholder="Email Address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              aria-invalid={newErrors.email ? "true" : undefined}
              aria-describedby="newEmailError"
            />
            {newErrors.email && (
              <div id="newEmailError" className="invalid-feedback">
                {newErrors.email}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={isProcessing}
            >
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
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search users by name or email"
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
          ) : paginated.length === 0 ? (
            <p>No users found.</p>
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
                        <>
                          <input
                            type="text"
                            className={`form-control ${
                              editErrors.name ? "is-invalid" : ""
                            }`}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            aria-invalid={editErrors.name ? "true" : undefined}
                            aria-describedby={`editNameError-${user.id}`}
                          />
                          {editErrors.name && (
                            <div
                              id={`editNameError-${user.id}`}
                              className="invalid-feedback"
                            >
                              {editErrors.name}
                            </div>
                          )}
                        </>
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {editId === user.id ? (
                        <>
                          <input
                            type="email"
                            className={`form-control ${
                              editErrors.email ? "is-invalid" : ""
                            }`}
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            aria-invalid={editErrors.email ? "true" : undefined}
                            aria-describedby={`editEmailError-${user.id}`}
                          />
                          {editErrors.email && (
                            <div
                              id={`editEmailError-${user.id}`}
                              className="invalid-feedback"
                            >
                              {editErrors.email}
                            </div>
                          )}
                        </>
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
                            disabled={isProcessing}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEdit}
                            disabled={isProcessing}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => startEdit(user)}
                            disabled={isProcessing}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              triggerDeleteConfirm(user.id, user.name)
                            }
                            disabled={isProcessing}
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
        confirmDisabled={isProcessing}
      />
    </div>
  );
}

export default Users;
