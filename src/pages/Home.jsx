import DoctorSearch from "../components/home/DoctorSearch.jsx";
import Hero from "../components/home/Hero.jsx";
import StatsSection from "../components/home/StatsSection.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import ServicesSection from "../components/home/ServicesSection.jsx";
import TeamMembers from "../components/home/TeamMembers.jsx";
import TestimonialSection from "../components/home/TestimonialSection.jsx";
import Trusted from "../components/home/Trusted.jsx";
import Subscribe from "../components/home/Subscribe.jsx";

function Home() {
  return (
    <>
      <Hero />
      <DoctorSearch />
      <StatsSection />
      <WhyChooseUs />
      <ServicesSection />
      <TeamMembers />
      <TestimonialSection />
      <Trusted />
      <Subscribe />
    </>
  );
}

export default Home;
