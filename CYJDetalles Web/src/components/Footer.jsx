const Footer = () => {
  return (
    <footer className="bg-[#976ECD] text-white py-5 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="social-media flex gap-4 mb-4 md:mb-0">
          <a href="https://wa.me/573502815300" target="_blank" className="text-white text-2xl hover:text-[#BCA3DA] transition-colors" aria-label="Nuestro Whatsapp">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="https://www.facebook.com" target="_blank" className="text-white text-2xl hover:text-[#BCA3DA] transition-colors" aria-label="Nuestro Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/cyjdetalles1" target="_blank" className="text-white text-2xl hover:text-[#BCA3DA] transition-colors" aria-label="Nuestro Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p className="text-sm">
          Copyright C&J Detalles - 2025. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
