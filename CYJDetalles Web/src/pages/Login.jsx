import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUser, setCurrentUser, setAdminSession, findUserByDocument } from '../utils/storage';

const Login = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [showRecover, setShowRecover] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Estados para login
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Estados para registro
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regTiDocumento, setRegTiDocumento] = useState('');
  const [regDocumento, setRegDocumento] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regCiudad, setRegCiudad] = useState('');
  const [regDireccion, setRegDireccion] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Credenciales de admin
    if (loginUser === 'admin' && loginPass === 'admin2025') {
      setAdminSession();
      setCurrentUser({ nombre: 'Administrador', isAdmin: true });
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
      return;
    }

    // Buscar usuario registrado por documento
    const user = findUserByDocument(loginUser);
    if (user && user.password === loginPass) {
      setCurrentUser(user);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
      return;
    }

    alert('Usuario o contraseña incorrectos');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const users = getUsers();
    const emailExists = users.some((u) => u.email === regEmail);

    if (emailExists) {
      alert('Este correo ya está registrado');
      return;
    }

    const newUser = {
      id_cliente: Date.now().toString(),
      ti_documento: regTiDocumento,
      n_documento: regDocumento,
      nombre: regNombre,
      apellido: regApellido,
      telefono: regTelefono,
      direccion: regDireccion,
      ciudad: regCiudad,
      email: regEmail,
      fecha_registro: new Date().toISOString().split('T')[0],
      password: regPassword,
      username: regEmail.split('@')[0],
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    window.dispatchEvent(new Event('storage'));
    alert('Registro exitoso. ¡Bienvenido!');
    navigate('/');
  };

  return (
    <div className="min-h-70vh flex flex-col items-center justify-center py-13 px-4">

      {/* Formulario de Login */}
      {showLogin && (
        <div className="w-full max-w-md p-8 bg-[#D4C5E6] rounded-2xl shadow-lg text-center mb-5">
          <h1 className="text-[#976ECD] text-3xl mb-6"><i className="fas fa-user-lock"></i> Iniciar Sesión</h1>

          <form onSubmit={handleLogin} className="text-left">
            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-user"></i> Usuario (Documento):</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
                placeholder="Ej: admin o tu cédula"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-key"></i> Contraseña:</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#976ECD] text-white border-none py-3 px-5 rounded text-lg font-bold hover:bg-[#9966D4] cursor-pointer">
              Ingresar
            </button>
          </form>

          <div className="mt-4 text-sm">
            <button onClick={() => { setShowLogin(false); setShowRecover(true); }} className="text-[#9966D4] hover:underline bg-transparent border-none cursor-pointer">
              ¿Olvidaste tu Contraseña?
            </button>
          </div>
          <div className="mt-2 text-sm">
            <span>¿No tienes cuenta? </span>
            <button onClick={() => { setShowLogin(false); setShowRegister(true); }} className="text-[#9966D4] hover:underline bg-transparent border-none cursor-pointer">
              Regístrate aquí
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Recuperación */}
      {showRecover && (
        <div className="w-full max-w-md p-8 bg-[#D4C5E6] rounded-2xl shadow-lg text-center mb-5">
          <h1 className="text-[#976ECD] text-3xl mb-6"><i className="fas fa-lock-open"></i> Recuperar Contraseña</h1>
          <p className="mb-5 text-gray-600">Ingresa tu correo electrónico registrado para enviarte un enlace de recuperación.</p>

          <form className="text-left">
            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-envelope"></i> Correo Electrónico:</label>
              <input type="email" required className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none" />
            </div>
            <button type="submit" className="w-full bg-[#976ECD] text-white border-none py-3 px-5 rounded text-lg font-bold hover:bg-[#9966D4] cursor-pointer">
              Enviar Enlace
            </button>
          </form>

          <div className="mt-4 text-sm">
            <button onClick={() => { setShowRecover(false); setShowLogin(true); }} className="text-[#9966D4] hover:underline bg-transparent border-none cursor-pointer">
              ← Volver a Iniciar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Formulario de Registro */}
      {showRegister && (
        <div className="w-full max-w-md p-8 bg-[#D4C5E6] rounded-2xl shadow-lg text-center mb-5">
          <h1 className="text-[#976ECD] text-3xl mb-6"><i className="fas fa-user-plus"></i> Crear Cuenta</h1>

          <form onSubmit={handleRegister} className="text-left">
            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-signature"></i> Nombre:</label>
              <input
                type="text"
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                required
                placeholder="Ej: Juan"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-signature"></i> Apellido:</label>
              <input
                type="text"
                value={regApellido}
                onChange={(e) => setRegApellido(e.target.value)}
                required
                placeholder="Ej: Pérez"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-id-card"></i> Tipo de Documento:</label>
              <select
                value={regTiDocumento}
                onChange={(e) => setRegTiDocumento(e.target.value)}
                required
                className="w-full p-3 border border-[#BCA3DA] rounded bg-white focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              >
                <option value="">Seleccione</option>
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="TI">TI - Tarjeta de Identidad</option>
                <option value="CE">CE - Cédula de Extranjería</option>
                <option value="PA">PA - Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-id-card"></i> N° Documento:</label>
              <input
                type="text"
                value={regDocumento}
                onChange={(e) => setRegDocumento(e.target.value)}
                required
                placeholder="Ej: 1234567890"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-phone"></i> Teléfono:</label>
              <input
                type="text"
                value={regTelefono}
                onChange={(e) => setRegTelefono(e.target.value)}
                placeholder="Ej: 3001234567"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-city"></i> Ciudad:</label>
              <input
                type="text"
                value={regCiudad}
                onChange={(e) => setRegCiudad(e.target.value)}
                placeholder="Ej: Bogotá"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-map-marker-alt"></i> Dirección:</label>
              <input
                type="text"
                value={regDireccion}
                onChange={(e) => setRegDireccion(e.target.value)}
                placeholder="Ej: Calle 123 # 45-67"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-envelope"></i> Correo Electrónico:</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="Ej: correo@ejemplo.com"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-[#9966D4]"><i className="fas fa-key"></i> Contraseña:</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                className="w-full p-3 border border-[#BCA3DA] rounded focus:border-[#976ECD] focus:shadow-lg focus:outline-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#976ECD] text-white border-none py-3 px-5 rounded text-lg font-bold hover:bg-[#9966D4] cursor-pointer">
              Registrarme
            </button>
          </form>

          <div className="mt-4 text-sm">
            <button onClick={() => { setShowRegister(false); setShowLogin(true); }} className="text-[#9966D4] hover:underline bg-transparent border-none cursor-pointer">
              ← Ya tengo una cuenta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
