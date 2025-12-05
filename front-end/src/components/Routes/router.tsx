import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "@/components/Layout/HomeLayout";
import Home from "@/components/Home";
import Registration from "@/components/Registration";
import AdminStudents from "@/components/Instructor/pages/Students";
import AdminProponents from "@/components/Instructor/pages/Proponents";
import Dashboard from "../Instructor/pages/Dashboard";
import AdminLayout from "../Layout/InstructorLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "Registration", element: <Registration /> },
    ],
  },
  {
    path: "/Instructor",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "Proponets", element: <AdminProponents /> },
      { path: "Students", element: <AdminStudents /> },
    ],
  },
]);
