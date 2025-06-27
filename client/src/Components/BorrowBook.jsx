// Components/BorrowBook.jsx
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function BorrowBook({ onAdd }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  useEffect(() => {
    axios.get("/api/users").then((res) => setUsers(res.data));
    axios.get("/api/books").then((res) => setBooks(res.data));
  }, []);

  const formik = useFormik({
    initialValues: {
      user_id: "",
      book_id: "",
      borrow_date: "",
    },
    validationSchema: Yup.object({
      user_id: Yup.number().required("User is required"),
      book_id: Yup.number().required("Book is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setPendingValues({ values, resetForm });
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingValues) return;
    try {
      const res = await axios.post("/api/borrows", pendingValues.values);
      onAdd(res.data);
      pendingValues.resetForm();
    } catch (err) {
      console.error("Failed to borrow book:", err);
    }
    setPendingValues(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h2>Borrow Book</h2>
        <select
          name="user_id"
          value={formik.values.user_id}
          onChange={formik.handleChange}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          name="book_id"
          value={formik.values.book_id}
          onChange={formik.handleChange}
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="borrow_date"
          value={formik.values.borrow_date}
          onChange={formik.handleChange}
        />

        <button type="submit">Borrow</button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to borrow this book?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default BorrowBook;
