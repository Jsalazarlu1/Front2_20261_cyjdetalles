const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/573502815300?text=Hola,%20me%20interesa%20un%20producto"
      className="fixed w-15 h-15 bottom-10 right-10 bg-[#25d366] text-white rounded-full text-4xl shadow-lg z-100 flex items-center justify-center hover:scale-110 transition-transform"
      target="_blank"
      aria-label="Chatear por WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

export default WhatsAppFloat;
