import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";


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
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
