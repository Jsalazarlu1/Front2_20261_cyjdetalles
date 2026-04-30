import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getUsers } from '../utils/storage';
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
      setClients(JSON.parse(localStorage.getItem('clients') || '["Ana","Luis","María"]'));
      setProducts(JSON.parse(localStorage.getItem('products') || '[{"name":"Desayuno Plus","price":68000},{"name":"Anchetas de Dulces","price":48000},{"name":"Desayuno Mega Especial","price":118000},{"name":"Desayuno Premium","price":89000},{"name":"Recordatorio Matrimonio","price":9500},{"name":"Flores Aromáticas","price":9500},{"name":"Recordatorio Bautizo / Primera comunión","price":8500},{"name":"Vela de lavanda","price":38000},{"name":"Retablo Clásico","price":48000},{"name":"Retablo con imagen","price":48000},{"name":"Retablo Múltiple","price":48000},{"name":"Retablo Temático","price":48000}]'));
      const allUsers = getUsers();
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

  const addClient = () => {
    const name = prompt('Nombre del nuevo cliente:');
    if (name) {
      saveClients([...clients, name]);
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
                      <td className="border border-gray-300 p-2">{o.cliente}</td>
                      <td className="border border-gray-300 p-2">{o.producto}</td>
                      <td className="border border-gray-300 p-2 status">{o.estado}</td>
                      <td className="border border-gray-300 p-2">
                        {o.estado !== 'Entregado' ? (
                          <button
                            onClick={() => markDelivered(o.id)}
                            className="bg-[#976ECD] text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-[#9966D4]"
                          >
                            Entregado
                          </button>
                        ) : (
                          <span className="text-green-600">✔</span>
                        )}
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
              <ul className="mt-4">
                {clients.map((c, i) => (
                  <li key={i} className="mb-2">{c}</li>
                ))}
              </ul>
              <button
                onClick={addClient}
                className="mt-4 bg-[#976ECD] text-white border-none py-2 px-4 rounded cursor-pointer hover:bg-[#9966D4]"
              >
                Agregar Cliente
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
