import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

function AddUser({ onUserAdded }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${API}/users`, formData)
      .then((res) => {
        onUserAdded(res.data);
        setFormData({ name: "", email: "" });
      })
      .catch((err) => console.error(err));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUser;
