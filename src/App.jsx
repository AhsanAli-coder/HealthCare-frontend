import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import DoctorDashboardLayout from "./components/doctor/layout/DoctorDashboardLayout.jsx";
import DoctorOverview from "./pages/doctor/DoctorOverview.jsx";
import DoctorPlaceholder from "./pages/doctor/DoctorPlaceholder.jsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.jsx";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions.jsx";
import DoctorPatientDocuments from "./pages/doctor/DoctorPatientDocuments.jsx";
import DoctorSettings from "./pages/doctor/DoctorSettings.jsx";
import RequireDoctor from "./components/auth/RequireDoctor.jsx";
import DoctorMessages from "./pages/doctor/DoctorMessages.jsx";
import DoctorScheduleTimings from "./pages/doctor/DoctorScheduleTimings.jsx";
import DoctorNotifications from "./pages/doctor/DoctorNotifications.jsx";
import RequirePatient from "./components/auth/RequirePatient.jsx";
import PatientDashboardLayout from "./components/patient/layout/PatientDashboardLayout.jsx";
import PatientOverview from "./pages/patient/PatientOverview.jsx";
import PatientPlaceholder from "./pages/patient/PatientPlaceholder.jsx";
import PatientMessages from "./pages/patient/PatientMessages.jsx";
import PatientBrowseDoctors from "./pages/patient/PatientBrowseDoctors.jsx";
import PatientDoctorDetail from "./pages/patient/PatientDoctorDetail.jsx";
import PatientAppointments from "./pages/patient/PatientAppointments.jsx";
import PatientSettings from "./pages/patient/PatientSettings.jsx";
import PatientReviews from "./pages/patient/PatientReviews.jsx";
import PatientDocuments from "./pages/patient/PatientDocuments.jsx";
import PatientPrescription from "./pages/patient/PatientPrescription.jsx";
import PatientNotifications from "./pages/patient/PatientNotifications.jsx";
import RequireAdmin from "./components/auth/RequireAdmin.jsx";
import AdminDashboardLayout from "./components/admin/layout/AdminDashboardLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminPendingDoctors from "./pages/admin/AdminPendingDoctors.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

function App() {
  return (
    <Routes>
      <Route path="admin" element={<RequireAdmin />}>
        <Route element={<AdminDashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="pending-doctors" element={<AdminPendingDoctors />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* Doctor area: no public Header/Footer */}
      <Route path="doctor" element={<RequireDoctor />}>
        <Route element={<DoctorDashboardLayout />}>
          <Route path="overview" element={<DoctorOverview />} />
          <Route
            path="appointments"
            element={<DoctorAppointments />}
          />
          <Route
            path="prescriptions"
            element={<DoctorPrescriptions />}
          />
          <Route
            path="patients"
            element={<DoctorPatientDocuments />}
          />
          <Route
            path="schedule"
            element={<DoctorScheduleTimings />}
          />
          <Route
            path="payments"
            element={<DoctorPlaceholder title="Payments" />}
          />
          <Route
            path="messages"
            element={<DoctorMessages />}
          />
          <Route path="notifications" element={<DoctorNotifications />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>
      </Route>

      {/* Patient area: no public Header/Footer */}
      <Route path="patient" element={<RequirePatient />}>
        <Route element={<PatientDashboardLayout />}>
          <Route path="overview" element={<PatientOverview />} />
          <Route
            path="appointments"
            element={<PatientAppointments />}
          />
          <Route path="doctors" element={<PatientBrowseDoctors />} />
          <Route path="doctors/:doctorId" element={<PatientDoctorDetail />} />
          <Route
            path="messages"
            element={<PatientMessages />}
          />
          <Route path="notifications" element={<PatientNotifications />} />
          <Route path="documents" element={<PatientDocuments />} />
          <Route path="reviews" element={<PatientReviews />} />
          <Route
            path="prescriptions/:appointmentId"
            element={<PatientPrescription />}
          />
          <Route
            path="settings"
            element={<PatientSettings />}
          />
        </Route>
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default App;
