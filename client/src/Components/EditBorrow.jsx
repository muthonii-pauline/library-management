import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

function EditBorrow({ borrow, onUpdate, onCancel }) {
  const formik = useFormik({
    initialValues: {
      return_date: borrow.return_date ? borrow.return_date.split("T")[0] : "",
      status: borrow.status,
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";
        const res = await axios.patch(`${API_BASE_URL}/api/borrows/${borrow.id}`, values);
        onUpdate(res.data);
      } catch (err) {
        console.error("Update failed", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="p-3">
      <div className="mb-3">
        <label htmlFor="return_date" className="form-label">
          Return Date
        </label>
        <input
          id="return_date"
          name="return_date"
          type="date"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.return_date}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
          name="status"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.status}
          className="form-select"
        >
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
        {formik.touched.status && formik.errors.status && (
          <small className="text-danger">{formik.errors.status}</small>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary me-2"
        disabled={formik.isSubmitting}
      >
        Save
      </button>
      <button type="button" onClick={onCancel} className="btn btn-secondary">
        Cancel
      </button>
    </form>
  );
}

export default EditBorrow;
