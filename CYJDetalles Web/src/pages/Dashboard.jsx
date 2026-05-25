import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { updateOrderStatus, ESTADOS, getOrders } from '../utils/storage';
import { getAllProductos, createProducto, updateProducto, deleteProducto, getAllUsuarios, createUsuario, updateUsuario, deleteUsuario, getAllClientes, updateCliente, deleteCliente } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', descripcion: '', imagen: '' });
  const [showClientModal, setShowClientModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [clientForm, setClientForm] = useState({ nombre: '', apellido: '', telefono: '', direccion: '', ciudad: '', correoElectronico: '' });
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserState, setEditUserState] = useState(null);
  const [userForm, setUserForm] = useState({ nombreUsuario: '', documento: '', contrasena: '', rol: 'Cliente' });

  useEffect(() => {
    const loadData = async () => {
      setOrders(JSON.parse(localStorage.getItem('orders') || '[{"id":1,"cliente":"Ana","producto":"Desayuno Plus","estado":"Pendiente"},{"id":2,"cliente":"Luis","producto":"Flores Aromáticas","estado":"Pendiente"},{"id":3,"cliente":"María","producto":"Anchetas de Dulces","estado":"Pendiente"}]'));
      const rawClients = JSON.parse(localStorage.getItem('clients') || '["Ana","Luis","María"]');
      const normalized = rawClients.map(c =>
        typeof c === 'string' ? { nombre: c, documento: '', email: '', telefono: '', activo: true } : c
      );
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const orderMap = {};
      allOrders.forEach(o => {
        const name = o.userNombre || o.cliente?.nombre || o.cliente;
        if (name) {
          if (!orderMap[name]) orderMap[name] = { nombre: name, documento: o.userDocumento || '', pedidos: 0 };
          orderMap[name].pedidos++;
        }
      });
      const merged = [...normalized];
      Object.values(orderMap).forEach(oc => {
        const exist = merged.find(c => c.nombre === oc.nombre);
        if (exist) {
          exist.pedidos = oc.pedidos;
          if (oc.documento && !exist.documento) exist.documento = oc.documento;
        } else {
          merged.push({ ...oc, email: '', telefono: '', activo: true });
        }
      });
      try {
        const [productosData, usuariosData, clientesData] = await Promise.all([
          getAllProductos(),
          getAllUsuarios(),
          getAllClientes()
        ]);
        setProducts(productosData);
        setUsers(usuariosData.map(u => ({ ...u, activo: u.activo !== false })));
        clientesData.forEach(c => {
          const exist = merged.find(m => m.documento === c.numeroDocumento || m.nombre === c.nombre);
          if (exist) {
            exist.id = c.id;
            exist.email = exist.email || c.correoElectronico;
            exist.telefono = exist.telefono || c.telefono;
            exist.direccion = c.direccion;
            exist.ciudad = c.ciudad;
            exist.apellido = c.apellido;
            exist.tiDocumento = c.tiDocumento;
            exist.contrasena = c.contrasena;
          } else {
            merged.push({
              id: c.id,
              nombre: c.nombre,
              apellido: c.apellido,
              documento: c.numeroDocumento,
              tiDocumento: c.tiDocumento,
              email: c.correoElectronico,
              telefono: c.telefono,
              direccion: c.direccion,
              ciudad: c.ciudad,
              contrasena: c.contrasena,
              activo: true,
              pedidos: 0
            });
          }
        });
        usuariosData.forEach(u => {
          const userName = u.nombreUsuario || u.nombre;
          const exist = merged.find(c => c.nombre === userName || c.documento === u.documento);
          if (exist) {
            if (u.documento) exist.documento = u.documento;
            if (u.email) exist.email = u.email;
          } else if (userName && userName !== 'admin') {
            merged.push({ nombre: userName, documento: u.documento || '', email: u.email || '', telefono: '', activo: true, pedidos: 0 });
          }
        });
      } catch (error) {
        console.error('Error al cargar datos desde API:', error);
      }
      setClients(merged);
    };
    loadData();
  }, []);

  const saveOrders = (data) => {
    setOrders(data);
    localStorage.setItem('orders', JSON.stringify(data));
  };

  const saveClients = (data) => {
    setClients(data);
    localStorage.setItem('clients', JSON.stringify(data));
  };

  const refreshProducts = async () => {
    try {
      const data = await getAllProductos();
      setProducts(data);
    } catch (error) {
      console.error('Error al refrescar productos:', error);
    }
  };

  const refreshUsers = async () => {
    try {
      const data = await getAllUsuarios();
      setUsers(data.map(u => ({ ...u, activo: u.activo !== false })));
    } catch (error) {
      console.error('Error al refrescar usuarios:', error);
    }
  };

  const openEditUserModal = (user) => {
    setEditUserState(user);
    setUserForm({
      nombreUsuario: user.nombreUsuario || '',
      documento: user.documento || '',
      contrasena: '',
      rol: user.rol || 'Cliente',
    });
    setShowUserModal(true);
  };

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  const sales = months.map(() => Math.floor(Math.random() * 3000 + 500) * 1000);

  const chartData = {
    labels: months,
    datasets: [{
      label: 'Ventas ($)',
      data: sales,
      fill: true,
      backgroundColor: 'rgba(151, 110, 205, 0.2)',
      borderColor: '#976ECD',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: '#976ECD',
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${Number(value).toLocaleString('es-CO')}`
        }
      }
    }
  };

  const totalSales = sales.reduce((a, b) => a + b, 0);
  const avgSales = Math.round(totalSales / sales.length);

  const markDelivered = (id) => {
    const updated = orders.map(o => o.id === id ? {...o, estado: 'Entregado'} : o);
    saveOrders(updated);
  };

  const toggleClientStatus = (nombre) => {
    const updated = clients.map(c =>
      c.nombre === nombre ? { ...c, activo: !c.activo } : c
    );
    saveClients(updated);
  };

  const addClient = () => {
    const name = prompt('Nombre del nuevo cliente:');
    if (name) {
      saveClients([...clients, { nombre: name, documento: '', email: '', telefono: '', activo: true, pedidos: 0 }]);
    }
  };

  const openAddProduct = () => {
    setEditProduct(null);
    setProductForm({ name: '', price: '', imagen: '' });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditProduct(product);
    setProductForm({ name: product.name, price: product.price.toString(), descripcion: product.descripcion || '', imagen: product.imagen || '' });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    const { name, price, descripcion, imagen } = productForm;
    if (!name || !price || isNaN(Number(price))) {
      alert('Por favor ingresa un nombre y un precio válido.');
      return;
    }
    try {
      if (editProduct) {
        await updateProducto(editProduct.id, { name, price: Number(price), descripcion, imagen });
      } else {
        await createProducto({ name, price: Number(price), descripcion, imagen });
      }
      await refreshProducts();
      setShowProductModal(false);
    } catch (error) {
      alert('Error al guardar el producto en la base de datos.');
    }
  };

  const removeProduct = async (name) => {
    if (window.confirm(`¿Eliminar producto "${name}"?`)) {
      try {
        const producto = products.find(p => p.name === name);
        if (producto?.id) {
          await deleteProducto(producto.id);
          await refreshProducts();
        }
      } catch (error) {
        alert('Error al eliminar el producto.');
      }
    }
  };

  const removeUser = async (userNombre) => {
    try {
      const usuario = users.find(u => u.nombreUsuario === userNombre);
      if (usuario?.id) {
        await deleteUsuario(usuario.id);
        await refreshUsers();
      }
    } catch (error) {
      alert('Error al eliminar el usuario.');
    }
  };

  const toggleUserStatus = async (userNombre) => {
    try {
      const usuario = users.find(u => u.nombreUsuario === userNombre);
      if (usuario?.id) {
        await updateUsuario(usuario.id, { ...usuario, activo: usuario.activo === false ? true : false });
        await refreshUsers();
      }
    } catch (error) {
      alert('Error al cambiar el estado del usuario.');
    }
  };

  const openAddUser = () => {
    setEditUserState(null);
    setUserForm({ nombreUsuario: '', documento: '', contrasena: '', rol: 'Cliente' });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    const { nombreUsuario, documento, contrasena, rol } = userForm;
    if (!nombreUsuario || !documento) {
      alert('Por favor ingresa nombre de usuario y documento.');
      return;
    }
    if (!editUserState && !contrasena) {
      alert('Por favor ingresa una contraseña.');
      return;
    }
    try {
      if (editUserState) {
        const updateData = { nombreUsuario, documento, rol, activo: editUserState.activo };
        if (contrasena) updateData.contrasena = contrasena;
        await updateUsuario(editUserState.id, updateData);
      } else {
        await createUsuario({ nombreUsuario, documento, contrasena, rol, activo: true });
      }
      await refreshUsers();
      setShowUserModal(false);
    } catch (error) {
      alert('Error al guardar el usuario.');
    }
  };

  const refreshClients = async () => {
    try {
      const data = await getAllClientes();
      setClients(prev => prev.map(c => {
        const match = data.find(d => d.id === c.id || d.numeroDocumento === c.documento);
        if (match) {
          return {
            ...c,
            id: match.id,
            nombre: match.nombre,
            apellido: match.apellido,
            documento: match.numeroDocumento,
            email: match.correoElectronico,
            telefono: match.telefono,
            direccion: match.direccion,
            ciudad: match.ciudad,
          };
        }
        return c;
      }));
    } catch (error) {
      console.error('Error al refrescar clientes:', error);
    }
  };

  const openAddClient = () => {
    setEditClient(null);
    setClientForm({ nombre: '', apellido: '', telefono: '', direccion: '', ciudad: '', correoElectronico: '' });
    setShowClientModal(true);
  };

  const openEditClient = (client) => {
    setEditClient(client);
    setClientForm({
      nombre: client.nombre || '',
      apellido: client.apellido || '',
      telefono: client.telefono || '',
      direccion: client.direccion || '',
      ciudad: client.ciudad || '',
      correoElectronico: client.email || '',
    });
    setShowClientModal(true);
  };

  const handleSaveClient = async () => {
    const { nombre, apellido, telefono, direccion, ciudad, correoElectronico } = clientForm;
    if (!nombre) {
      alert('Por favor ingresa el nombre del cliente.');
      return;
    }
    try {
      if (editClient?.id) {
        await updateCliente(editClient.id, {
          nombre,
          apellido,
          telefono,
          direccion,
          ciudad,
          correoElectronico,
          tiDocumento: editClient.tiDocumento || '',
          numeroDocumento: editClient.documento || '',
          contrasena: editClient.contrasena || '',
        });
      } else if (editClient) {
        saveClients(clients.map(c => c.nombre === editClient.nombre ? { ...c, ...clientForm, email: correoElectronico } : c));
      } else {
        saveClients([...clients, { nombre, apellido, telefono, direccion, ciudad, email: correoElectronico, activo: true, pedidos: 0 }]);
      }
      await refreshClients();
      setShowClientModal(false);
    } catch (error) {
      alert('Error al guardar el cliente.');
    }
  };

  const removeClient = async (client) => {
    if (window.confirm(`¿Eliminar cliente "${client.nombre}"?`)) {
      try {
        if (client.id) {
          await deleteCliente(client.id);
        }
        setClients(prev => prev.filter(c => c.id !== client.id && c.nombre !== client.nombre));
        localStorage.setItem('clients', JSON.stringify(clients.filter(c => c.id !== client.id && c.nombre !== client.nombre)));
        await refreshClients();
      } catch (error) {
        alert('Error al eliminar el cliente.');
      }
    }
  };

  const statusColors = {
    'Pendiente': { badge: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-l-yellow-500' },
    'Confirmado': { badge: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500' },
    'En preparación': { badge: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500' },
    'En camino': { badge: 'bg-purple-500', bg: 'bg-purple-50', border: 'border-l-purple-500' },
    'Entregado': { badge: 'bg-green-500', bg: 'bg-green-50', border: 'border-l-green-500' },
  };

  const getProductImage = (productName) => {
    if (!productName) return null;
    const found = products.find(p => p.name === productName || p.nombre === productName);
    return found?.imagen || null;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-55 bg-[#EFE2F8] text-[#946bd3] flex flex-col p-5">
        <div className="text-center mb-8">
          <img src="/Logo C&J Transp.png" alt="Logo" className="w-full" />
        </div>
        <nav>
          <ul className="list-none">
            {[
              {key: 'dashboard', label: 'Dashboard'},
              {key: 'orders', label: 'Gestión de Pedidos'},
              {key: 'clients', label: 'Clientes'},
              {key: 'products', label: 'Productos'},
              {key: 'users', label: 'Usuarios'},
            ].map(item => (
              <li
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                className={`p-3 cursor-pointer rounded-lg mb-2 transition-colors ${
                  activeModule === item.key ? 'bg-[#946bd3] text-white' : 'hover:bg-[#946bd3] hover:text-white'
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="bg-[#946bd3] text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {activeModule === 'dashboard' && 'Dashboard'}
            {activeModule === 'orders' && 'Gestión de Pedidos'}
            {activeModule === 'clients' && 'Clientes'}
            {activeModule === 'products' && 'Productos'}
            {activeModule === 'users' && 'Usuarios'}
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('session');
              localStorage.removeItem('currentUser');
              window.location.href = '/login';
            }}
            className="bg-transparent border-2 border-white text-white py-1.5 px-3 rounded-full font-bold cursor-pointer hover:bg-white hover:text-[#946bd3] transition-colors"
          >
            Salir
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto text-lg leading-relaxed">
          {activeModule === 'dashboard' && (
            <div>
              <h2>Dashboard</h2>
              <p className="mb-5">Aquí podrás ver las estadísticas y gráficos principales de ventas.</p>
              <Line data={chartData} options={chartOptions} />
              <h3 className="mt-8 mb-4">Detalle de Ventas</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Mes</th>
                    <th className="border border-gray-300 p-2">Ventas ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((month, i) => (
                    <tr key={month}>
                      <td className="border border-gray-300 p-2">{month}</td>
                      <td className="border border-gray-300 p-2">${sales[i].toLocaleString('es-CO')}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="border border-gray-300 p-2">Total:</td>
                    <td className="border border-gray-300 p-2">${totalSales.toLocaleString('es-CO')}</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="border border-gray-300 p-2">Promedio:</td>
                    <td className="border border-gray-300 p-2">${avgSales.toLocaleString('es-CO')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeModule === 'orders' && (
            <div>
              <h2>Gestión de Pedidos</h2>
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Cliente</th>
                    <th className="border border-gray-300 p-2">Producto</th>
                    <th className="border border-gray-300 p-2">Estado</th>
                    <th className="border border-gray-300 p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const colors = statusColors[o.estado] || { badge: 'bg-gray-500', bg: 'bg-gray-50', border: 'border-l-gray-500' };
                    return (
                    <tr key={o.id} className={`border-l-4 ${colors.border}`}>
                      <td className="border border-gray-300 p-2">{o.id}</td>
                      <td className="border border-gray-300 p-2">{o.userNombre || o.cliente?.nombre || o.cliente || 'Desconocido'}</td>
                      <td className="border border-gray-300 p-2">
                        {o.items && o.items.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                {item.imagen && (
                                  <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-cover rounded" />
                                )}
                                <span>{item.nombre}{item.quantity > 1 ? ` x${item.quantity}` : ''}</span>
                              </div>
                            ))}
                          </div>
                        ) : o.producto ? (
                          <div className="flex items-center gap-2">
                            {getProductImage(o.producto) && (
                              <img src={getProductImage(o.producto)} alt={o.producto} className="w-12 h-12 object-cover rounded" />
                            )}
                            <span>{o.producto}</span>
                          </div>
                        ) : o.item && o.item.length > 0 ? o.item.map(item => item.nombre).join(', ') : 'Sin producto'}
                      </td>
                      <td className="border border-gray-300 p-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${colors.badge}`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <select value={o.estado}
                        onChange={(e) =>{
                          const newStatus = e.target.value;
                          if (updateOrderStatus(o.id, newStatus)) {
                            const updated = getOrders();
                            saveOrders(updated); 
                          } else{
                            alert ('✖️ Estado no válido o error al actualizar');
                          }
                        }}
                        className="border border-[#BCA3DA] rounded px-2 py-1 focus:outline-none focus:border-[#976ECD]"
                        style={{ backgroundColor: o.estado === 'Pendiente' ? '#FEF3C7' : o.estado === 'Confirmado' ? '#DBEAFE' : o.estado === 'En preparación' ? '#FFEDD5' : o.estado === 'En camino' ? '#F3E8FF' : o.estado === 'Entregado' ? '#DCFCE7' : '#F9FAFB' }}
                        >
                          {ESTADOS.map((estado) => {
                            const optColors = statusColors[estado] || { badge: 'bg-gray-500' };
                            return (
                              <option key={estado} value={estado} className={optColors.badge}>
                                {estado}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeModule === 'clients' && (
            <div>
              <h2 className="mb-4">Gestión de clientes registrados en el sistema.</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Nombre</th>
                    <th className="border border-gray-300 p-2">Documento</th>
                    <th className="border border-gray-300 p-2">Email</th>
                    <th className="border border-gray-300 p-2">Teléfono</th>
                    <th className="border border-gray-300 p-2">Pedidos</th>
                    <th className="border border-gray-300 p-2">Estado</th>
                    <th className="border border-gray-300 p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c, i) => (
                    <tr key={i} className={!c.activo ? 'opacity-50' : ''}>
                      <td className="border border-gray-300 p-2">{c.nombre}</td>
                      <td className="border border-gray-300 p-2">{c.documento || '—'}</td>
                      <td className="border border-gray-300 p-2">{c.email || '—'}</td>
                      <td className="border border-gray-300 p-2">{c.telefono || '—'}</td>
                      <td className="border border-gray-300 p-2 text-center">{c.pedidos || 0}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${c.activo ? 'bg-green-500' : 'bg-red-500'}`}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openEditClient(c)}
                          className="bg-[#976ECD] text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-[#9966D4] mr-2 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeClient(c)}
                          className="bg-red-500 text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-red-600 text-xs mr-2"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => toggleClientStatus(c.nombre)}
                          className={`border-none py-1 px-3 rounded cursor-pointer text-xs font-bold text-white ${c.activo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          {c.activo ? 'Inactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={openAddClient}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                + Agregar Cliente
              </button>
            </div>
          )}

          {activeModule === 'products' && (
            <div>
              <h2>Productos</h2>
              <p className="mb-4">Gestión de productos disponibles en el catálogo.</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Imagen</th>
                    <th className="border border-gray-300 p-2">Nombre</th>
                    <th className="border border-gray-300 p-2">Precio</th>
                    <th className="border border-gray-300 p-2">Descripción</th>
                    <th className="border border-gray-300 p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-2 text-center">
                        {p.imagen ? (
                          <img src={p.imagen} alt={p.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">{p.name}</td>
                      <td className="border border-gray-300 p-2">${p.price.toLocaleString('es-CO')}</td>
                      <td className="border border-gray-300 p-2 max-w-[200px] truncate">{p.descripcion || '—'}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="bg-[#976ECD] text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-[#9966D4] mr-2 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeProduct(p.name)}
                          className="bg-red-500 text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-red-600 text-xs"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={openAddProduct}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                + Agregar Producto
              </button>
            </div>
          )}

                  {activeModule === 'users' && (
            <div>
              <h2 className="mb-4">Gestión de usuarios del sistema.</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Documento</th>
                    <th className="border border-gray-300 p-2">Nombre</th>
                    <th className="border border-gray-300 p-2">Rol</th>
                    <th className="border border-gray-300 p-2">Estado</th>
                    <th className="border border-gray-300 p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className={u.activo === false ? 'opacity-50' : ''}>
                      <td className="border border-gray-300 p-2">{u.id || i + 1}</td>
                      <td className="border border-gray-300 p-2">{u.documento || '—'}</td>
                      <td className="border border-gray-300 p-2">{u.nombreUsuario || u.nombre || u}</td>
                      <td className="border border-gray-300 p-2">{u.rol || 'Usuario'}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${u.activo !== false ? 'bg-green-500' : 'bg-red-500'}`}>
                          {u.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openEditUserModal(u)}
                          className="bg-[#976ECD] text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-[#9966D4] mr-2 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.nombreUsuario || u.nombre || u)}
                          className={`border-none py-1 px-3 rounded cursor-pointer text-xs font-bold text-white ${u.activo !== false ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          {u.activo !== false ? 'Inactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={openAddUser}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                + Agregar Usuario
              </button>
            </div>
          )}
        </div>

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 py-5">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-[#333]">
                {editProduct ? 'Editar Producto' : 'Agregar Producto'}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Desayuno Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: 68000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={productForm.descripcion}
                    onChange={(e) => setProductForm({ ...productForm, descripcion: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD] min-h-[80px] resize-y"
                    placeholder="Descripción del producto..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                  <input
                    type="text"
                    value={productForm.imagen}
                    onChange={(e) => setProductForm({ ...productForm, imagen: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                {productForm.imagen && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                    <img src={productForm.imagen} alt="Preview" className="w-24 h-24 object-cover rounded mx-auto" onError={(e) => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="bg-gray-300 text-gray-700 border-none py-2 px-4 rounded cursor-pointer hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
                >
                  {editProduct ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 py-5">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-[#333]">
                {editUserState ? 'Editar Usuario' : 'Agregar Usuario'}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
                  <input
                    type="text"
                    value={userForm.nombreUsuario}
                    onChange={(e) => setUserForm({ ...userForm, nombreUsuario: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: juanperez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Documento</label>
                  <input
                    type="text"
                    value={userForm.documento}
                    onChange={(e) => setUserForm({ ...userForm, documento: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    value={userForm.contrasena}
                    onChange={(e) => setUserForm({ ...userForm, contrasena: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder={editUserState ? 'Dejar vacío para no cambiar' : 'Ej: 123456'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    value={userForm.rol}
                    onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD] bg-white"
                  >
                    <option value="Cliente">Cliente</option>
                    <option value="Usuario">Usuario</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-300 text-gray-700 border-none py-2 px-4 rounded cursor-pointer hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveUser}
                  className="bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
                >
                  {editUserState ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Client Modal */}
        {showClientModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 py-5">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4 text-[#333]">
                {editClient ? 'Editar Cliente' : 'Agregar Cliente'}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={clientForm.nombre}
                    onChange={(e) => setClientForm({ ...clientForm, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Juan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={clientForm.apellido}
                    onChange={(e) => setClientForm({ ...clientForm, apellido: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={clientForm.telefono}
                    onChange={(e) => setClientForm({ ...clientForm, telefono: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: 3001234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    value={clientForm.direccion}
                    onChange={(e) => setClientForm({ ...clientForm, direccion: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Calle 123 # 45-67"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={clientForm.ciudad}
                    onChange={(e) => setClientForm({ ...clientForm, ciudad: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Bogotá"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={clientForm.correoElectronico}
                    onChange={(e) => setClientForm({ ...clientForm, correoElectronico: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: correo@ejemplo.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowClientModal(false)}
                  className="bg-gray-300 text-gray-700 border-none py-2 px-4 rounded cursor-pointer hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveClient}
                  className="bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
                >
                  {editClient ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
