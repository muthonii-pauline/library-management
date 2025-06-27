import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Books from "./Pages/Books";


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
        path: "/books",
        element: <Books/>
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
