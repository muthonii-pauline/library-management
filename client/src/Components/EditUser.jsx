// Components/EditUser.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function EditUser({ user, onUpdate, onCancel }) {
  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.patch(`/api/users/${user.id}`, values);
        onUpdate(res.data);
      } catch (err) {
        console.error("Update failed", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <input
        name="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditUser;
