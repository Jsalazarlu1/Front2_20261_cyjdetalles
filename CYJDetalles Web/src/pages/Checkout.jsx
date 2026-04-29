import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, saveCart, clearCart } from '../utils/storage';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const costoEnvio = 5000;

  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
  }, []);

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() + costoEnvio;
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    saveCart(updatedCart);
    setCart(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
    setCart(updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const handlePayment = (method) => {
    if (cart.length === 0) {
      alert('🛒 Tu carrito está vacío. Agrega productos antes de pagar.');
      return;
    }

    const confirmPurchase = window.confirm(
      `💳 ¿Deseas confirmar la compra de ${cart.reduce((sum, item) => sum + item.quantity, 0)} productos con pago ${method}?`
    );

    if (confirmPurchase) {
      alert('🎉 Muchas gracias, tu compra ha sido realizada con éxito.');
      clearCart();
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-[#976ECD] text-center text-4xl mb-8">🛍️ Resumen de tu Pedido</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#D4C5E6] rounded-2xl p-8 shadow-lg">
        {/* Resumen del Pedido */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-[#9966D4] text-xl mb-4 pb-2 border-b-2 border-[#BCA3DA]">
            <i className="fas fa-box"></i> Detalles del Pedido
          </h2>
          
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Tu carrito está vacío 🛍️</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center mb-3 pb-3 border-b border-[#D4C5E6]">
                  <div className="flex-1">
                    <h3 className="text-[#976ECD] font-bold">{item.nombre}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-[#BCA3DA] text-white w-6 h-6 rounded font-bold cursor-pointer hover:bg-[#9966D4] flex items-center justify-center"
                      >-</button>
                      <span className="text-sm text-gray-600 font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-[#976ECD] text-white w-6 h-6 rounded font-bold cursor-pointer hover:bg-[#9966D4] flex items-center justify-center"
                      >+</button>
                      <span className="text-sm text-gray-600 ml-2">× ${item.precio?.toLocaleString() || item.price?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold">${((item.precio || item.price) * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white w-6 h-6 rounded font-bold cursor-pointer hover:bg-red-600 flex items-center justify-center"
                      title="Eliminar producto"
                    >×</button>
                  </div>
                </div>
              ))}
              <div className="text-right mt-5 pt-4 border-t-2 border-[#976ECD]">
                <p className="text-lg"><strong>Subtotal:</strong> ${getSubtotal().toLocaleString()}</p>
                <p className="text-lg"><strong>Envío:</strong> ${costoEnvio.toLocaleString()}</p>
                <p className="text-xl font-bold text-[#9966D4] mt-2">Total a pagar: ${getTotal().toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        {/* Datos de Envío */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-[#9966D4] text-xl mb-4 pb-2 border-b-2 border-[#BCA3DA]">
            <i className="fas fa-map-marker-alt"></i> Datos de Envío
          </h2>
          
          <form>
            <div className="mb-4">
              <label className="block mb-2 font-bold text-[#976ECD]">Nombre Completo</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2.5 border border-[#BCA3DA] rounded-lg focus:border-[#9966D4] focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold text-[#976ECD]">Teléfono de Contacto</label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-2.5 border border-[#BCA3DA] rounded-lg focus:border-[#9966D4] focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold text-[#976ECD]">Dirección de Entrega</label>
              <input
                type="text"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2.5 border border-[#BCA3DA] rounded-lg focus:border-[#9966D4] focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#976ECD]">Mensaje Especial (Opcional)</label>
              <textarea
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full p-2.5 border border-[#BCA3DA] rounded-lg focus:border-[#9966D4] focus:outline-none resize-y"
              ></textarea>
            </div>

            <div className="text-center mt-6">
              <h3 className="text-[#976ECD] mb-4"><i className="fas fa-credit-card"></i> Métodos de Pago</h3>
              <button
                type="button"
                onClick={() => handlePayment('en línea')}
                className="inline-block m-2 py-2.5 px-5 bg-[#976ECD] text-white rounded-3xl font-bold border-none cursor-pointer hover:scale-105 shadow-lg transition-all"
              >
                <i className="fas fa-globe"></i> Pago en Línea
              </button>
              <button
                type="button"
                onClick={() => handlePayment('contraentrega')}
                className="inline-block m-2 py-2.5 px-5 bg-[#BCA3DA] text-gray-800 rounded-3xl font-bold border-none cursor-pointer hover:scale-105 shadow-lg transition-all"
              >
                <i className="fas fa-hand-holding-usd"></i> Pago Contraentrega
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
