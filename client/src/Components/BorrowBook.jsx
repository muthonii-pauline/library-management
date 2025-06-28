import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";
import Select from "react-select";

function BorrowBook({ onAdd }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
    axios.get("/api/books").then((res) => setBooks(res.data));
  }, []);

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email})`,
  }));

  const bookOptions = books
    .filter((b) => b.available_copies > 0)
    .map((b) => ({
      value: b.id,
      label: `${b.title} by ${b.author} (${b.available_copies} copies)`,
    }));

  const formik = useFormik({
    initialValues: {
      user_id: null,
      book_id: null,
    },
    validationSchema: Yup.object({
      user_id: Yup.number().required("User is required"),
      book_id: Yup.number().required("Book is required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post("/api/borrows", pendingValues);
      onAdd(res.data);
      formik.resetForm();
      setPendingValues(null);
    } catch (err) {
      console.error("Borrow failed:", err);
      setError("⚠️ Could not borrow. Book may be unavailable.");
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
          <label className="form-label">Choose User</label>
          <Select
            options={userOptions}
            onChange={(option) =>
              formik.setFieldValue("user_id", option?.value || null)
            }
            onBlur={() => formik.setFieldTouched("user_id", true)}
            placeholder="Search by name or email"
          />
          {formik.touched.user_id && formik.errors.user_id && (
            <div className="text-danger">{formik.errors.user_id}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Choose Book</label>
          <Select
            options={bookOptions}
            onChange={(option) =>
              formik.setFieldValue("book_id", option?.value || null)
            }
            onBlur={() => formik.setFieldTouched("book_id", true)}
            placeholder="Search available books"
          />
          {formik.touched.book_id && formik.errors.book_id && (
            <div className="text-danger">{formik.errors.book_id}</div>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Borrow Book
        </button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Confirm lending this book to the selected user?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default BorrowBook;
