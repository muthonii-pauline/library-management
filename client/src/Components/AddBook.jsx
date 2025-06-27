// Components/AddBook.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function AddBook({ onAdd }) {
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
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/books", values);
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to add book:", err);
      }
    },
  });

  return (
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
  );
}

export default AddBook;
