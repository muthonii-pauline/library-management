// Components/AddBook.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

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
      available_copies: Yup.number().min(1, "At least one copy").required(),
    }),
    onSubmit: (values) => {
      setPendingValues(values);
      setConfirmOpen(true);
    },
  });

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      const res = await axios.post("/api/books", pendingValues);
      onAdd(res.data);
      formik.resetForm();
      setPendingValues(null);
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
      <form onSubmit={formik.handleSubmit}>
        <h2>Add Book</h2>
        <input
          name="title"
          placeholder="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
        <input
          name="author"
          placeholder="Author"
          value={formik.values.author}
          onChange={formik.handleChange}
        />
        <input
          name="genre"
          placeholder="Genre"
          value={formik.values.genre}
          onChange={formik.handleChange}
        />
        <input
          name="available_copies"
          type="number"
          min="1"
          value={formik.values.available_copies}
          onChange={formik.handleChange}
        />
        <button type="submit">Add Book</button>
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
