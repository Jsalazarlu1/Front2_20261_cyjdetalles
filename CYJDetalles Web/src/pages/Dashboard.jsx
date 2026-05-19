import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getUsers, updateOrderStatus, ESTADOS, getOrders } from '../utils/storage';
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

  useEffect(() => {
    const loadData = () => {
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
      const allUsers = getUsers();
      allUsers.forEach(u => {
        const exist = merged.find(c => c.nombre === u.nombre || c.documento === u.documento);
        if (exist) {
          if (u.documento) exist.documento = u.documento;
          if (u.email) exist.email = u.email;
        } else if (u.nombre && u.nombre !== 'admin') {
          merged.push({ nombre: u.nombre, documento: u.documento || '', email: u.email || '', telefono: '', activo: true, pedidos: 0 });
        }
      });
      setClients(merged);
      setProducts(JSON.parse(localStorage.getItem('products') || '[{"name":"Desayuno Plus","price":68000},{"name":"Anchetas de Dulces","price":48000},{"name":"Desayuno Mega Especial","price":118000},{"name":"Desayuno Premium","price":89000},{"name":"Recordatorio Matrimonio","price":9500},{"name":"Flores Aromáticas","price":9500},{"name":"Recordatorio Bautizo / Primera comunión","price":8500},{"name":"Vela de lavanda","price":38000},{"name":"Retablo Clásico","price":48000},{"name":"Retablo con imagen","price":48000},{"name":"Retablo Múltiple","price":48000},{"name":"Retablo Temático","price":48000}]'));
      setUsers(allUsers.length > 0 ? allUsers : [{nombre: 'admin'}]);
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

  const saveProducts = (data) => {
    setProducts(data);
    localStorage.setItem('products', JSON.stringify(data));
  };

  const saveUsers = (data) => {
    setUsers(data);
    localStorage.setItem('users', JSON.stringify(data));
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

  const removeProduct = (name) => {
    saveProducts(products.filter(p => p.name !== name));
  };

  const addProduct = () => {
    const name = prompt('Nombre del producto:');
    const price = prompt('Precio del producto:');
    if (name && price && !isNaN(Number(price))) {
      saveProducts([...products, {name, price: Number(price)}]);
    }
  };

  const removeUser = (userNombre) => {
    saveUsers(users.filter(u => u.nombre !== userNombre));
  };

  const addUser = () => {
    const nombre = prompt('Nombre del nuevo usuario:');
    if (nombre) {
      saveUsers([...users, {nombre, documento: '', email: '', password: '', username: ''}]);
    }
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
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="border border-gray-300 p-2">{o.id}</td>
                      <td className="border border-gray-300 p-2">{o.userNombre || o.cliente?.nombre || o.cliente || 'Desconocido'}</td>
                      <td className="border border-gray-300 p-2">
                        {o.items && o.items.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                {item.imagen && (
                                  <img src={item.imagen} alt={item.nombre} className="w-10 h-20 object-cover rounded" />
                                )}
                                <span>{item.nombre}{item.quantity > 1 ? ` x${item.quantity}` : ''}</span>
                              </div>
                            ))}
                          </div>
                        ) : o.producto ? o.producto : o.item && o.item.length > 0 ? o.item.map(item => item.nombre).join(', ') : 'Sin producto'}
                      </td>
                      <td className="border border-gray-300 p-2 status">{o.estado}</td>
                      <td className="border border-gray-300 p-2">
                        <select value={o.estado}
                        onChange={(e) =>{
                          {/* Validar que el nuevo estado sea correcto y actualizar el estado de la orden en localStorage */}
                          const newStatus = e.target.value;
                          if (updateOrderStatus(o.id, newStatus)) {
                            const updated = getOrders();
                            saveOrders(updated); 
                          } else{
                            alert ('✖️ Estado no válido o error al actualizar');
                          }
                        }} className="border border-[#BCA3DA] rounded px-2 py-1 focus:outline-none focus:border-[#976ECD]"
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeModule === 'clients' && (
            <div>
              <h2>Clientes</h2>
              <p className="mb-4">Gestión de clientes registrados en el sistema.</p>
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
                onClick={addClient}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                + Agregar Cliente
              </button>
            </div>
          )}

          {activeModule === 'products' && (
            <div>
              <h2>Productos</h2>
              <ul className="mt-4">
                {products.map((p, i) => (
                  <li key={i} className="mb-2 flex justify-between items-center">
                    <span>{p.name} - ${p.price.toLocaleString('es-CO')}</span>
                    <button
                      onClick={() => removeProduct(p.name)}
                      className="bg-red-500 text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={addProduct}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                Agregar Producto
              </button>
            </div>
          )}

          {activeModule === 'users' && (
            <div>
              <h2>Usuarios</h2>
              <ul className="mt-4">
                {users.map((u, i) => (
                  <li key={i} className="mb-2 flex justify-between items-center">
                    <span>{u.nombre || u}</span>
                    <button
                      onClick={() => removeUser(u.nombre || u)}
                      className="bg-red-500 text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-red-600"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={addUser}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                Agregar Usuario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
