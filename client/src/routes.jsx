import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Books from "./Pages/Books";
import Borrows from "./Pages/Borrows";
import Users from "./Pages/Users";


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
        path: "/borrows",
        element: <Borrows />
      },
      {
        path: "/users",
        element: <Users/>
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;
