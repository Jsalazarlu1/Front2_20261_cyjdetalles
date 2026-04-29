import { Link } from 'react-router-dom';
import { getCurrentUser, logout, getCart } from '../utils/storage';
import { useState, useEffect } from 'react';

const Header = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateUser = () => {
      setUser(getCurrentUser());
    };
    const updateCart = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateUser();
    updateCart();
    window.addEventListener('storage', updateUser);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <header className="bg-[#D4C5E6] border-b-2 border-[#BCA3DA] py-2">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="logo">
          <Link to="/">
            <img src="/Logo C&J Transp.png" alt="Logo C&J Detalles" className="h-32" />
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-[#976ECD] font-bold">Hola, {user.nombre || user.fullName}</span>
              <button onClick={handleLogout} className="text-[#976ECD] font-bold hover:text-[#9966D4] bg-transparent border-none cursor-pointer">
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="text-[#976ECD] font-bold hover:text-[#9966D4]">
              <i className="fas fa-user"></i> Iniciar Sesión
            </Link>
          )}
          <Link to="/checkout" className="text-[#976ECD] font-bold hover:text-[#9966D4] relative">
            <i className="fas fa-shopping-cart"></i> Carrito
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
