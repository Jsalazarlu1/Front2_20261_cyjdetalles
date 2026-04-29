import { useState, useEffect } from 'react';
import { getCart, saveCart } from '../utils/storage';

// Datos de productos organizados por categoría
const productos = {
  anchetas: [
    { id: 1, nombre: 'Desayuno Plus', descripcion: 'Wraps de pollo, Milo, Porción de fruta, Bon yurt, Galletas de Queso, Chocolatina y Torta personal.', precio: 110000, imagen: '/carr1.jpeg' },
    { id: 2, nombre: 'Anchetas de Dulces', descripcion: 'La selección más dulce para cualquier celebración.', precio: 70000, imagen: '/Feliz día.jpeg' },
    { id: 3, nombre: 'Desayuno Mega Especial', descripcion: 'Portaretrato personalizado, Milo, Jugo de Naranja, Rollos de Jamón y Queso, Wraps de pollo, fruta, Bon yurt o Parfait, Galletas de Queso y Flores.', precio: 120000, imagen: '/Desayuno Mega Especial.jpeg' },
    { id: 4, nombre: 'Desayuno Premium', descripcion: 'Milo, Jugo de naranja, Wraps de pollo, Fruta picada, Mini empanadas, Barquillos, Torta personal y chocolates.', precio: 115000, imagen: '/Desayuno Premium.jpeg' },
  ],
  velas: [
    { id: 5, nombre: 'Vela de lavanda', descripcion: 'Aroma relajante y duradero.', precio: 90000, imagen: '/Lavanda.jpeg' },
    { id: 6, nombre: 'Recordatorio Bautizo / Primera comunión', descripcion: 'Diseños personalizados para eventos.', precio: 8500, imagen: '/Angelitos.jpeg' },
    { id: 7, nombre: 'Flores Aromáticas', descripcion: 'Hermosas canastas de flores aromáticas, un regalo exclusivo.', precio: 35000, imagen: '/Flores en vela.JPG' },
    { id: 8, nombre: 'Recordatorio Matrimonio', descripcion: 'Elegantes detalles de agradecimiento.', precio: 9500, imagen: '/Matri.jpeg' },
  ],
  retablos: [
    { id: 9, nombre: 'Retablo Clásico', descripcion: 'Tu foto favorita impresa en madera.', precio: 48000, imagen: '/Matri (2).jpeg' },
    { id: 10, nombre: 'Retablo con imagen', descripcion: 'Combina foto y mensaje inspirador.', precio: 48000, imagen: '/arbol.png' },
    { id: 11, nombre: 'Retablo Múltiple', descripcion: 'Diseño collage para varias fotos.', precio: 56000, imagen: '/Collage.jpeg' },
    { id: 12, nombre: 'Retablo Temático', descripcion: 'Diseños personalizados.', precio: 48000, imagen: '/Cuadro moni 27 x 39.png' },
  ],
};

// Datos del carrusel
const carouselItems = [
  { id: 1, imagen: '/Virgencitas.jpeg', titulo: 'Virgencitas en vela aromática', descripcion: 'Perfecto para recordatorios.🙏😇' },
  { id: 2, imagen: '/Flor.jpg', titulo: 'Amamos...', descripcion: 'Los detalles...💌🌺' },
  { id: 3, imagen: '/Carr2.jpeg', titulo: 'Caja Sorpresa', descripcion: 'Una explosión de sabor y amor.😍' },
  { id: 4, imagen: '/captura.jpg', titulo: 'Visitanos...!', descripcion: 'Te sorprenderas.❤📸' },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Efecto para el carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Carrusel de productos destacados */}
      <section className="relative overflow-hidden my-8">
        <h2 className="text-center text-[#9966D4] text-2xl mb-4">Productos Destacados</h2>
        <div className="relative h-64 md:h-96">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={item.imagen} alt={item.titulo} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-[#9966D4]/70 text-white p-4 text-center">
                <h3 className="text-xl font-bold">{item.titulo}</h3>
                <p>{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded hover:bg-black/70 z-10" aria-label="Anterior">&#10094;</button>
        <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-3 rounded hover:bg-black/70 z-10" aria-label="Siguiente">&#10095;</button>
      </section>

      {/* Sección de Anchetas y Desayunos */}
      <section id="anchetas" className="my-10">
        <h2 id="catalogo" className="text-[#976ECD] text-center text-3xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">Anchetas y Desayunos Sorpresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {productos.anchetas.map((producto) => (
            <div key={producto.id} className="bg-[#D4C5E6] rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
              <div className="p-4 text-center flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-[#9966D4] mb-2 text-xl">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4">{producto.descripcion}</p>
                </div>
                <div>
                  <p className="font-bold text-lg mb-4">${producto.precio.toLocaleString()}</p>
                  <button onClick={() => addToCart(producto)} className="bg-[#976ECD] text-white border-none py-2 px-5 rounded hover:bg-[#9966D4] font-bold w-full">
                    <i className="fas fa-shopping-cart"></i> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Velas y Recordatorios */}
      <section id="velas" className="my-10">
        <h2 className="text-[#976ECD] text-center text-3xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">Velas Aromáticas y Recordatorios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {productos.velas.map((producto) => (
            <div key={producto.id} className="bg-[#D4C5E6] rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
              <div className="p-4 text-center flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-[#9966D4] mb-2 text-xl">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4">{producto.descripcion}</p>
                </div>
                <div>
                  <p className="font-bold text-lg mb-4">${producto.precio.toLocaleString()}</p>
                  <button onClick={() => addToCart(producto)} className="bg-[#976ECD] text-white border-none py-2 px-5 rounded hover:bg-[#9966D4] font-bold w-full">
                    <i className="fas fa-shopping-cart"></i> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Retablos */}
      <section id="retablos" className="my-10">
        <h2 className="text-[#976ECD] text-center text-3xl mb-6 pb-2 border-b-2 border-[#BCA3DA]">Retablos Personalizados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {productos.retablos.map((producto) => (
            <div key={producto.id} className="bg-[#D4C5E6] rounded-lg overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-64 object-cover" />
              <div className="p-4 text-center flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-[#9966D4] mb-2 text-xl">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-4">{producto.descripcion}</p>
                </div>
                <div>
                  <p className="font-bold text-lg mb-4">${producto.precio.toLocaleString()}</p>
                  <button onClick={() => addToCart(producto)} className="bg-[#976ECD] text-white border-none py-2 px-5 rounded hover:bg-[#9966D4] font-bold w-full">
                    <i className="fas fa-shopping-cart"></i> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
