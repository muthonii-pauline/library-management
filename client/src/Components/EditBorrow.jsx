// Components/EditBorrow.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function EditBorrow({ borrow, onUpdate, onCancel }) {
  const formik = useFormik({
    initialValues: {
      return_date: borrow.return_date || "",
      status: borrow.status,
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.patch(`/api/borrows/${borrow.id}`, values);
        onUpdate(res.data);
      } catch (err) {
        console.error("Update failed", err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="return_date"
        type="date"
        onChange={formik.handleChange}
        value={formik.values.return_date}
      />
      <select
        name="status"
        onChange={formik.handleChange}
        value={formik.values.status}
      >
        <option value="borrowed">Borrowed</option>
        <option value="returned">Returned</option>
      </select>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

export default EditBorrow;
