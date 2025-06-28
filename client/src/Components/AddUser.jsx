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
    <div className="p-3 shadow-sm border rounded bg-light">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            name="name"
            className="form-control"
            placeholder="Enter full name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register User
        </button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message={`Confirm registering "${pendingValues?.name}" as a new user?`}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddUser;
