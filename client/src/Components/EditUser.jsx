// Components/EditUser.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function EditUser({ user, onUpdate, onCancel }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingValues) return;
    try {
      const res = await axios.patch(`/api/users/${user.id}`, pendingValues);
      onUpdate(res.data);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <input
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to save changes to this user?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default EditUser;
