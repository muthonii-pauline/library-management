import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/pets",
        element: <Pets />,
      },
      {
        path: "/owners",
        element: <Owners />,
      },
      {
        path: "/staff",
        element: <Staff />,
      },
      {
        path: "/treatments",
        element: <Treatments />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
      },
      {
        path: "/billings",
        element: <Billing />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
