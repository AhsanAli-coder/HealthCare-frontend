import ContactForm from "../components/contact/Contact.jsx";
import Subscribe from "../components/home/Subscribe.jsx";

const BG_SRC = encodeURI(
  "/servicesPage/29a183e94cfaa1c70f9923b9dff53e831733a031.jpg",
);

function Contact() {
  return (
    <>
      <section
        className="relative min-h-[calc(100vh-5rem)] overflow-hidden"
        style={{
          backgroundImage: `url(${BG_SRC})`,
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
        }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-black/5"
          aria-hidden
        />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-6 py-16 lg:px-8 lg:py-24">
          {/* <div className="max-w-2xl">
            <h1 className="font-hero text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Reach our support and clinic coordination team. We’ll get back to
              you as soon as possible.
            </p>
          </div> */}
        </div>
      </section>

      <ContactForm />
      <Subscribe />
    </>
  );
}

export default Contact;

