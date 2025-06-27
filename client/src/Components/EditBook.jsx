import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ConfirmDialog from "./ConfirmDialog";

function EditBook({ book, onUpdate, onCancel }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: book.title,
      author: book.author,
      genre: book.genre,
      available_copies: book.available_copies,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      author: Yup.string().required("Required"),
      available_copies: Yup.number().required("Required").min(0),
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
      const res = await axios.put(`/api/books/${book.id}`, pendingValues);
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
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        <input
          name="author"
          onChange={formik.handleChange}
          value={formik.values.author}
        />
        <input
          name="genre"
          onChange={formik.handleChange}
          value={formik.values.genre}
        />
        <input
          name="available_copies"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.available_copies}
        />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to save changes to this book?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

export default EditBook;
