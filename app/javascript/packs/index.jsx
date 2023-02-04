import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import App from "./components/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("Routing-app")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



