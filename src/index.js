import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
// import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";

import Latest from "./routes/latest";
import Players from "./routes/players";
import Songs from "./routes/songs";
import Leaderboards from "./routes/leaderboards";
import MyLatest from "./routes/mylatest";
import MyInfo from "./routes/myinfo";
import MyOption from "./routes/myoption";

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // { path: '/', element: <Latest /> },
      { path: '/scoretracker', element: <Latest /> },
      { path: "/scoretracker/latest", element: <Latest /> },
      { path: "/scoretracker/players", element: <Players /> },
      { path: "/scoretracker/songs", element: <Songs /> },
      { path: "/scoretracker/leaderboards", element: <Leaderboards /> },
      // split
      { path: "/scoretracker/mylatest", element: <MyLatest /> },
      { path: "/scoretracker/myinfo", element: <MyInfo /> },
      { path: "/scoretracker/myoption", element: <MyOption /> }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
