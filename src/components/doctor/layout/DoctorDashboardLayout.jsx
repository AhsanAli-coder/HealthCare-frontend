import { Outlet } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar.jsx";

function DoctorDashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex w-full">
        <DoctorSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboardLayout;

