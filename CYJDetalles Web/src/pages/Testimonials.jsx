import { useState } from 'react';

// Testimonios existentes
const testimoniosExistentes = [
  {
    nombre: 'Ana M.',
    fecha: 'Febrero 2025',
    rating: 5,
    producto: 'Desayuno Romántico',
    texto: '¡El mejor regalo! La entrega fue puntualísima y la calidad de los productos superó mis expectativas. Volveré a comprar sin dudarlo.'
  },
  {
    nombre: 'Carlos R.',
    fecha: 'Mayo 2025',
    rating: 4,
    producto: 'Experiencia de Compra',
    texto: 'Excelente servicio al cliente. Me ayudaron a personalizar la caja sorpresa y el resultado fue hermoso. Solo mejoraría un poco la velocidad de respuesta en WhatsApp.'
  }
];

const Testimonials = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fechaCompra: '',
    ratingProducto: '',
    ratingExperiencia: '',
    comentario: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias por tu testimonio! Será revisado antes de publicarse.');
    setFormData({
      nombre: '',
      email: '',
      fechaCompra: '',
      ratingProducto: '',
      ratingExperiencia: '',
      comentario: ''
    });
  };

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fas fa-star ${i < count ? 'text-yellow-400' : 'far fa-star text-gray-300'}`}></i>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[#976ECD] text-center text-4xl mb-6">🌟 Historias y Testimonios de Nuestros Clientes 🌟</h1>
      <p className="text-center text-gray-600 mb-10">Lee las experiencias de quienes ya compraron con nosotros y ¡anímate a compartir la tuya!</p>
      
      {/* Testimonios existentes */}
      <section className="mb-15">
        <h2 className="text-[#9966D4] text-center text-2xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">
          <i className="fas fa-star"></i> Experiencias Destacadas
        </h2>
        
        {testimoniosExistentes.map((t, index) => (
          <div key={index} className="bg-[#D4C5E6] p-6 rounded-lg shadow-md mb-5 border-l-5 border-[#976ECD]">
            <div className="text-yellow-500 text-xl mb-3">
              {renderStars(t.rating)}
              <span className="text-[#976ECD] text-sm italic ml-3">(Producto: {t.producto})</span>
            </div>
            <p className="italic text-gray-700 text-lg mb-3 leading-relaxed">"{t.texto}"</p>
            <p className="text-right text-gray-500 text-sm font-bold">- {t.nombre} (Compra en {t.fecha})</p>
          </div>
        ))}
      </section>

      {/* Formulario de Testimonios */}
      <section className="bg-white p-8 border border-[#BCA3DA] rounded-lg mb-10">
        <h2 className="text-[#9966D4] text-center text-2xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">
          <i className="fas fa-edit"></i> Comparte tu Experiencia
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold text-[#976ECD]">
                <i className="fas fa-signature"></i> Nombre (Aparecerá como: Nombre I.) (*)
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-[#976ECD]">
                <i className="fas fa-envelope"></i> Correo Electrónico (No aparecerá) (*)
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
              <label className="block mb-2 font-bold text-[#976ECD]">
                <i className="fas fa-calendar-alt"></i> Fecha de Compra (Aprox.) (*)
              </label>
              <input
                type="date"
                required
                value={formData.fechaCompra}
                onChange={(e) => setFormData({...formData, fechaCompra: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold text-[#976ECD]">
                <i className="fas fa-cube"></i> Calificación del Producto (*)
              </label>
              <select
                required
                value={formData.ratingProducto}
                onChange={(e) => setFormData({...formData, ratingProducto: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded bg-white focus:border-[#9966D4] focus:outline-none"
              >
                <option value="" disabled>Selecciona tu calificación</option>
                <option value="5">5 - Excelente</option>
                <option value="4">4 - Muy Bueno</option>
                <option value="3">3 - Bueno</option>
                <option value="2">2 - Regular</option>
                <option value="1">1 - Puede Mejorar</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold text-[#976ECD]">
                <i className="fas fa-store"></i> Calificación de la Experiencia (*)
              </label>
              <select
                required
                value={formData.ratingExperiencia}
                onChange={(e) => setFormData({...formData, ratingExperiencia: e.target.value})}
                className="w-full p-2.5 border border-[#BCA3DA] rounded bg-white focus:border-[#9966D4] focus:outline-none"
              >
                <option value="" disabled>Selecciona tu calificación</option>
                <option value="5">5 - Excelente</option>
                <option value="4">4 - Muy Bueno</option>
                <option value="3">3 - Bueno</option>
                <option value="2">2 - Regular</option>
                <option value="1">1 - Puede Mejorar</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-bold text-[#976ECD]">
              <i className="fas fa-comment-alt"></i> Tu Testimonio/Comentario (*)
            </label>
            <textarea
              rows={6}
              required
              placeholder="Describe tu experiencia con el producto y el servicio..."
              value={formData.comentario}
              onChange={(e) => setFormData({...formData, comentario: e.target.value})}
              className="w-full p-2.5 border border-[#BCA3DA] rounded focus:border-[#9966D4] focus:outline-none resize-y"
            ></textarea>
          </div>

          <p className="text-sm text-[#900] mb-4">Tu testimonio será revisado antes de publicarse. (* Campos obligatorios)</p>
          
          <button type="submit" className="w-full bg-[#976ECD] text-white border-none py-3 px-5 rounded text-lg font-bold hover:bg-[#9966D4] cursor-pointer">
            Enviar Testimonio
          </button>
        </form>
      </section>
    </div>
  );
};

export default Testimonials;
