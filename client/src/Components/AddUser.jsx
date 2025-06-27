// Components/AddUser.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function AddUser({ onAdd }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post("/api/users", pendingValues);
      onAdd(res.data);
      formik.resetForm();
      setPendingValues(null);
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h2>Add User</h2>
        <input
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <button type="submit">Add User</button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this user?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default AddUser;
