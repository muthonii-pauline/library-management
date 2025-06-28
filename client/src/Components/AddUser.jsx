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
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
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
      console.error("Failed to register user:", err);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form className="mb-4" onSubmit={formik.handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          className="form-control mb-2"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.touched.name && formik.errors.name && (
          <small className="text-danger">{formik.errors.name}</small>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="form-control mb-2"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="text-danger">{formik.errors.email}</small>
        )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit" className="btn btn-primary">
            Register User
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message={`Confirm registering "${pendingValues?.name}" as a new library user?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default AddUser;
