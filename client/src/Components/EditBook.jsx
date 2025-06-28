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
      available_copies: Yup.number()
        .required("Required")
        .min(0, "Cannot be negative"),
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
      <form onSubmit={formik.handleSubmit} className="p-3">
        <div className="mb-3">
          <label>Title</label>
          <input
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
            className="form-control"
            placeholder="Enter book title"
          />
          {formik.touched.title && formik.errors.title && (
            <small className="text-danger">{formik.errors.title}</small>
          )}
        </div>

        <div className="mb-3">
          <label>Author</label>
          <input
            name="author"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.author}
            className="form-control"
            placeholder="Enter author name"
          />
          {formik.touched.author && formik.errors.author && (
            <small className="text-danger">{formik.errors.author}</small>
          )}
        </div>

        <div className="mb-3">
          <label>Genre</label>
          <input
            name="genre"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.genre}
            className="form-control"
            placeholder="Enter genre (optional)"
          />
        </div>

        <div className="mb-3">
          <label>Available Copies</label>
          <input
            name="available_copies"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.available_copies}
            className="form-control"
            min={0}
          />
          {formik.touched.available_copies &&
            formik.errors.available_copies && (
              <small className="text-danger">
                {formik.errors.available_copies}
              </small>
            )}
        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={confirmOpen}
        >
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
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
