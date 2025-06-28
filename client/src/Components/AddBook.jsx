import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

function AddBook({ onAdd }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      genre: "",
      available_copies: 1,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      author: Yup.string().required("Author is required"),
      available_copies: Yup.number()
        .min(1, "At least one copy")
        .required("Number of copies is required"),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/books`, pendingValues);
      onAdd(res.data);
      formik.resetForm();
    } catch (err) {
      console.error("Failed to add book:", err);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingValues(null);
  };

  return (
    <>
      <form className="mb-2" onSubmit={formik.handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          className="form-control mb-2"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        {formik.errors.title && (
          <small className="text-danger">{formik.errors.title}</small>
        )}

        <input
          name="author"
          placeholder="Author"
          className="form-control mb-2"
          value={formik.values.author}
          onChange={formik.handleChange}
        />
        {formik.errors.author && (
          <small className="text-danger">{formik.errors.author}</small>
        )}

        <input
          name="genre"
          placeholder="Genre"
          className="form-control mb-2"
          value={formik.values.genre}
          onChange={formik.handleChange}
        />

        <input
          name="available_copies"
          type="number"
          min="1"
          className="form-control mb-2"
          value={formik.values.available_copies}
          onChange={formik.handleChange}
        />
        {formik.errors.available_copies && (
          <small className="text-danger">
            {formik.errors.available_copies}
          </small>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Add Book
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to add this book?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default AddBook;
