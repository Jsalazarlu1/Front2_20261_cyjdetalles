const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[#976ECD] text-center text-4xl mb-8 pb-3 border-b-3 border-[#BCA3DA]">💜 Quiénes Somos 💜</h1>
      
      {/* Historia */}
      <section className="flex flex-col md:flex-row gap-10 mb-10 bg-[#D4C5E6] p-6 rounded-lg items-center">
        <div className="w-full md:w-1/3">
          <img src="/Logo C&J Transp.png" alt="Imagen Representativa" className="w-full h-auto max-h-80 object-cover rounded" />
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-[#9966D4] text-2xl mb-4">Nuestra Esencia</h2>
          <p className="mb-4 text-gray-700">
            Somos una tienda de regalos dedicada a la creación y entrega de <strong>detalles sorpresa personalizados</strong> que buscan generar <strong>emociones inolvidables</strong> en momentos especiales.
          </p>
          <p className="mb-4 text-gray-700">
            Ofrecemos una amplia variedad de opciones como <strong>desayunos temáticos, cajas de regalo, velas aromáticas y retablos personalizados</strong> que se adaptan a celebraciones como cumpleaños, aniversarios, nacimientos, fechas especiales o simplemente para sorprender sin motivo.
          </p>
          <p className="mb-4 text-gray-700">
            Nos enfocamos en tres pilares fundamentales: <strong>personalización auténtica, puntualidad en la entrega, y cuidado en cada presentación.</strong>
          </p>
          <p className="text-gray-700">
            Cada detalle es diseñado con <strong>amor y creatividad</strong>, para que quien lo reciba viva una experiencia única y emocional. Nos encargamos de todo el proceso, desde la preparación hasta la <strong>entrega puntual</strong>, haciendo que regalar sea fácil y significativo.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <div className="bg-white p-6 rounded-lg border border-[#BCA3DA] shadow-lg hover:-translate-y-1 transition-transform">
          <i className="fas fa-bullseye text-5xl text-[#9966D4] mb-3 block"></i>
          <h3 className="text-[#976ECD] mb-3 text-xl">Nuestra Misión</h3>
          <p className="text-gray-700">
            Crear momentos inolvidables a través de detalles y regalos personalizados que expresen emociones, fortalezcan vínculos y hagan sentir especial a cada persona. Nos comprometemos a ofrecer productos de alta calidad, hechos con amor y dedicación.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-[#BCA3DA] shadow-lg hover:-translate-y-1 transition-transform">
          <i className="fas fa-star text-5xl text-[#976ECD] mb-3 block"></i>
          <h3 className="text-[#976ECD] mb-3 text-xl">Nuestra Visión</h3>
          <p className="text-gray-700">
            Ser reconocidos como la <strong>empresa líder en el mercado de regalos personalizados en Colombia</strong>, destacándonos por nuestra <strong>creatividad, innovación y calidez</strong> en cada detalle, llevando alegría y emociones a nivel nacional.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="mb-10">
        <h2 className="text-[#976ECD] text-center text-3xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">Nuestros Valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#D4C5E6] p-5 rounded-lg text-center">
            <h3 className="text-[#9966D4] mb-2">Compromiso</h3>
            <p className="text-gray-700 text-sm">Cumplimos con responsabilidad y puntualidad, asegurando una experiencia de compra confiable.</p>
          </div>
          <div className="bg-[#D4C5E6] p-5 rounded-lg text-center">
            <h3 className="text-[#9966D4] mb-2">Innovación</h3>
            <p className="text-gray-700 text-sm">Nos renovamos constantemente, explorando nuevas ideas y tendencias para ofrecer regalos originales.</p>
          </div>
          <div className="bg-[#D4C5E6] p-5 rounded-lg text-center">
            <h3 className="text-[#9966D4] mb-2">Calidad</h3>
            <p className="text-gray-700 text-sm">Utilizamos materiales seleccionados y procesos cuidadosos para garantizar productos duraderos.</p>
          </div>
          <div className="bg-[#D4C5E6] p-5 rounded-lg text-center">
            <h3 className="text-[#9966D4] mb-2">Pasión</h3>
            <p className="text-gray-700 text-sm">Amamos lo que hacemos y lo reflejamos en cada producto, cuidando cada detalle como si fuera único.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
