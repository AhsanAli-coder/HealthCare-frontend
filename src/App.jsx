import { Routes, Route } from "react-router-dom";
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
import DoctorSettings from "./pages/doctor/DoctorSettings.jsx";
import RequireDoctor from "./components/auth/RequireDoctor.jsx";
import DoctorMessages from "./pages/doctor/DoctorMessages.jsx";
import DoctorScheduleTimings from "./pages/doctor/DoctorScheduleTimings.jsx";
import RequirePatient from "./components/auth/RequirePatient.jsx";
import PatientDashboardLayout from "./components/patient/layout/PatientDashboardLayout.jsx";
import PatientOverview from "./pages/patient/PatientOverview.jsx";
import PatientPlaceholder from "./pages/patient/PatientPlaceholder.jsx";
import PatientMessages from "./pages/patient/PatientMessages.jsx";
import PatientBrowseDoctors from "./pages/patient/PatientBrowseDoctors.jsx";
import PatientDoctorDetail from "./pages/patient/PatientDoctorDetail.jsx";
import PatientAppointments from "./pages/patient/PatientAppointments.jsx";
import PatientSettings from "./pages/patient/PatientSettings.jsx";

function App() {
  return (
    <Routes>
      {/* Doctor area: no public Header/Footer */}
      <Route path="doctor" element={<RequireDoctor />}>
        <Route element={<DoctorDashboardLayout />}>
          <Route path="overview" element={<DoctorOverview />} />
          <Route
            path="appointments"
            element={<DoctorAppointments />}
          />
          <Route
            path="patients"
            element={<DoctorPlaceholder title="My Patients" />}
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
          <Route path="blog" element={<DoctorPlaceholder title="Blog" />} />
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
          <Route path="reviews" element={<PatientPlaceholder title="Reviews" />} />
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
