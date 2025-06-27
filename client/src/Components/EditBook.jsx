// Components/EditBook.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function EditBook({ book, onUpdate, onCancel }) {
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
    onSubmit: async (values) => {
      try {
        const res = await axios.patch(`/api/books/${book.id}`, values);
        onUpdate(res.data);
      } catch (err) {
        console.error("Update failed", err);
      }
    },
  });

  return (
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
  );
}

export default EditBook;
