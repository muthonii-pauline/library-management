// Components/AddUser.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function AddUser({ onAdd }) {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post("/api/users", values);
        onAdd(res.data);
        resetForm();
      } catch (err) {
        console.error("Failed to create user:", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2>Add User</h2>
      <input
        name="name"
        placeholder="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      <button type="submit">Add User</button>
    </form>
  );
}

export default AddUser;
