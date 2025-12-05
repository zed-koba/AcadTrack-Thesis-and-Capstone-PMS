import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex flex-wrap content-start relative">
      <Sidebar />
      <main className="px-4 py-3 bg-background grow relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
