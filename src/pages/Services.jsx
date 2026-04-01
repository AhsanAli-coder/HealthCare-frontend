import ServicesSection from "../components/home/ServicesSection.jsx";
import ServiceBookingHero from "../components/services/ServiceBookingHero.jsx";
import CustomerSection from "../components/services/CustomerSection.jsx";
import FAQ from "../components/services/FAQ.jsx";
import Subscribe from "../components/home/Subscribe.jsx";

function Services() {
  return (
    <>
      <ServiceBookingHero />
      <ServicesSection />
      <CustomerSection />
      <FAQ />
      <Subscribe />
    </>
  );
}

export default Services;
