import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    email: '',
    fechaPedido: '',
    observaciones: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('PQRS enviado con éxito. Te responderemos en máximo 48 horas hábiles.');
    setFormData({
      nombre: '',
      cedula: '',
      telefono: '',
      email: '',
      fechaPedido: '',
      observaciones: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[#976ECD] text-center text-4xl mb-6">✨ Contáctanos y Envíanos tus PQRS ✨</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Redes Sociales */}
        <div className="bg-[#D4C5E6] p-8 rounded-lg">
          <h2 className="text-[#976ECD] text-2xl mb-4">¡Hablemos de tus ideas!</h2>
          <p className="mb-8 text-gray-700">Para consultas rápidas, pedidos personalizados o asesorías, escríbenos a través de nuestras redes sociales.</p>
          
          <div className="flex flex-col gap-4">
            <a href="https://wa.me/573502815300" target="_blank" className="flex items-center gap-4 bg-[#25d366] text-white p-4 rounded hover:translate-y--1 shadow-lg transition-all">
              <i className="fab fa-whatsapp text-3xl"></i>
              <span className="text-lg font-bold">WhatsApp Business</span>
              <small className="ml-auto opacity-80">Respuesta Inmediata</small>
            </a>
            <a href="https://www.instagram.com/cyjdetalles1" target="_blank" className="flex items-center gap-4 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white p-4 rounded hover:translate-y--1 shadow-lg transition-all">
              <i className="fab fa-instagram text-3xl"></i>
              <span className="text-lg font-bold">Instagram (@cyjdetalles1)</span>
              <small className="ml-auto opacity-80">Síguenos y entérate de las novedades</small>
            </a>
            <a href="https://www.facebook.com" target="_blank" className="flex items-center gap-4 bg-[#4267B2] text-white p-4 rounded hover:translate-y--1 shadow-lg transition-all">
              <i className="fab fa-facebook-f text-3xl"></i>
              <span className="text-lg font-bold">Facebook (CYJ Detalles)</span>
            </a>
          </div>
        </div>

        {/* Formulario PQRS */}
        <div className="bg-white p-8 border border-[#BCA3DA] rounded-lg flex-1">
          <h2 className="text-[#9966D4] text-2xl mb-4">Formulario de PQRS</h2>
          <p className="mb-6 text-gray-600 text-sm border-l-3 border-[#BCA3DA] pl-3">
            Usa este formulario para enviarnos formalmente una Petición, Queja, Reclamo o Sugerencia. Nuestro equipo te responderá en un plazo máximo de 48 horas hábiles.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                <i className="fas fa-user"></i> Nombre Completo (*)
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                  <i className="fas fa-id-card"></i> Cédula (*)
                </label>
                <input
                  type="text"
                  required
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                  className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                  <i className="fas fa-phone"></i> Teléfono (*)
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                  <i className="fas fa-envelope"></i> Correo Electrónico (*)
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                  <i className="fas fa-calendar-alt"></i> Fecha de Pedido (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.fechaPedido}
                  onChange={(e) => setFormData({...formData, fechaPedido: e.target.value})}
                  className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold text-[#976ECD] text-sm">
                <i className="fas fa-comment-dots"></i> Observaciones / Detalle de la PQRS (*)
              </label>
              <textarea
                rows={5}
                required
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none resize-y"
              ></textarea>
            </div>

            <p className="text-sm text-[#900] mb-4">Los campos marcados con (*) son obligatorios.</p>
            
            <button type="submit" className="w-full bg-[#976ECD] text-white border-none py-3 px-5 rounded text-lg font-bold hover:bg-[#9966D4] cursor-pointer">
              Enviar PQRS
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
