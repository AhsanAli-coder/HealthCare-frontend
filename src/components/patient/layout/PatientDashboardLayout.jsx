import { Outlet } from "react-router-dom";
import { DashboardNotificationProvider } from "../../../context/DashboardNotificationContext.jsx";
import PatientSidebar from "./PatientSidebar.jsx";
import PatientTopbar from "./PatientTopbar.jsx";

export default function PatientDashboardLayout() {
  return (
    <DashboardNotificationProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          <PatientSidebar />

          <div className="min-w-0 flex-1">
            <PatientTopbar />
            <main className="px-6 py-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DashboardNotificationProvider>
  );
}

