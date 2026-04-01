import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import PlaceholderPage from "./pages/PlaceholderPage.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <Routes>
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
