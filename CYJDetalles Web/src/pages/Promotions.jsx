import { getCart, saveCart } from '../utils/storage';

// Productos en promoción
const promociones = [
  { id: 101, nombre: 'Desayuno Romántico Especial', descripcion: 'El detalle perfecto para sorprender. Incluye moño, frase y tarjeta personalizada.', precioOriginal: 75000, precio: 52500, descuento: '30% OFF', imagen: '/Desayuno promo.jpeg' },
  { id: 102, nombre: 'Velas 7 y 8 Diciembre', descripcion: 'Diferentes diseños disponibles', precioOriginal: 40000, precio: 28000, descuento: '2x1', imagen: '/Velas 7dic.jpg' },
  { id: 103, nombre: 'Retablo Personalizado XL', descripcion: 'Diseña con tu foto favorita. ¡El regalo más emotivo!', precioOriginal: 85000, precio: 59500, descuento: 'Envío Gratis', imagen: '/Collage 21x31.png' },
  { id: 104, nombre: 'Caja Sorpresa Temática (Cumpleaños)', descripcion: 'Incluye snacks, dulces, Wraps de pollo, bebidas y decoración acorde a la temática.', precioOriginal: 110000, precio: 85000, descuento: 'Novedad', imagen: '/Desayuno Temático completo.jpeg' },
];

// Productos de temporada (Navidad)
const temporada = [
  { id: 201, nombre: 'Velas Sagrada Familia', descripcion: 'Hermosas Velas de Sagrada Familia con aroma, perfectas para detalles de temporada navideña.', precio: 18000, imagen: '/Vela Sagrada Fam.jpg' },
  { id: 202, nombre: 'Recordatorios Virgencitas', descripcion: 'Para cualquier ocasión.', precio: 15000, imagen: '/Virgencitas.jpeg' },
  { id: 203, nombre: 'Retablo Sagrada Familia', descripcion: 'Tamaño 20 x 30.', precio: 30000, imagen: '/Sagrada Familia  2026.png' },
  { id: 204, nombre: 'Recordatorios Angelitos', descripcion: 'Perfectos para primera comunión.', precio: 12000, imagen: '/Velas Angelitos.jpg' },
];

const Promotions = () => {
  const addToCart = (producto) => {
    const existingCart = getCart();
    const existingItem = existingCart.find((item) => item.id === producto.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...producto, quantity: 1 });
    }
    
    saveCart(existingCart);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[#976ECD] text-center text-4xl mb-6">🎁 Promociones y Novedades de Temporada 💝</h1>
      <p className="text-center text-[#9966D4] text-lg mb-10 pb-3 border-b border-[#BCA3DA]">
        ¡Aprovecha nuestras ofertas especiales por tiempo limitado!
      </p>

      {/* Ofertas Irresistibles */}
      <section className="mb-15">
        <h2 className="text-[#976ECD] text-center text-3xl mb-8 pb-2 border-b-2 border-[#BCA3DA]">🔥 Ofertas Irresistibles del Mes 🔥</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {promociones.map((p) => (
            <div key={p.id} className="bg-[#D4C5E6] rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col relative">
              <span className="absolute top-3 left--1 bg-[#e84855] text-white py-1 px-3 text-sm font-bold z-5" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)'}}>
                {p.descuento}
              </span>
              <img src={p.imagen} alt={p.nombre} className="w-full h-56 object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[#9966D4] mb-2 text-xl">{p.nombre}</h3>
                <p className="text-sm text-gray-600 mb-4">{p.descripcion}</p>
                <div className="flex flex-col items-center mb-4">
                  <span className="text-gray-400 line-through text-sm">${p.precioOriginal?.toLocaleString()}</span>
                  <span className="text-[#e84855] text-2xl font-black">${p.precio.toLocaleString()}</span>
                </div>
                <button onClick={() => addToCart(p)} className="w-full bg-[#e84855] text-white border-none py-2 px-5 rounded hover:bg-[#976ECD] font-bold">
                  <i className="fas fa-cart-plus"></i> Añadir a Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Especial Navidad */}
      <section>
        <h2 className="text-[#976ECD] text-center text-3xl mb-8 pb-2 border-b-2 border-[#BCA3DA]">🎄 Especial Navidad 🎄</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {temporada.map((p) => (
            <div key={p.id} className="bg-[#D4C5E6] rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
              <img src={p.imagen} alt={p.nombre} className="w-full h-56 object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-[#9966D4] mb-2 text-xl">{p.nombre}</h3>
                <p className="text-sm text-gray-600 mb-4">{p.descripcion}</p>
                <div className="flex flex-col items-center mb-4">
                  <span className="text-[#e84855] text-2xl font-black">${p.precio.toLocaleString()}</span>
                </div>
                <button onClick={() => addToCart(p)} className="w-full bg-[#e84855] text-white border-none py-2 px-5 rounded hover:bg-[#976ECD] font-bold">
                  <i className="fas fa-cart-plus"></i> Añadir a Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Promotions;
