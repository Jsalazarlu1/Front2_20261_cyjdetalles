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
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    imagen: ''
  });

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
      setProducts(JSON.parse(localStorage.getItem('products') || '[{"name":"Desayuno Plus","price":68000,"imagen":"/carr1.jpeg"}]'));
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

  const openAddProduct = () => {
    setEditProduct(null);
    setProductForm({
      id: '',
      name: '',
      category: '',
      description: '',
      price: '',
      stock: '',
      imagen: ''
    });
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditProduct(product);
    setProductForm({
      id: product.id || '',
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      price: product.price.toString(),
      stock: (product.stock ?? 0).toString(),
      imagen: product.imagen || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    const { id, name, category, description, price, stock, imagen } = productForm;
    if (!id.trim() || !name.trim() || !category.trim() || !description.trim() || !price || isNaN(Number(price)) || !stock || isNaN(Number(stock))) {
      alert('Por favor completa todos los campos con valores válidos.');
      return;
    }

    const normalizedId = id.trim();
    const normalizedProduct = {
      id: normalizedId,
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      imagen: imagen || editProduct?.imagen || ''
    };

    if (editProduct) {
      if (normalizedId !== editProduct.id && products.some(p => p.id === normalizedId)) {
        alert('Ya existe un producto con ese ID.');
        return;
      }
      saveProducts(products.map(p => p.id === editProduct.id ? normalizedProduct : p));
    } else {
      if (products.some(p => p.id === normalizedId)) {
        alert('Ya existe un producto con ese ID.');
        return;
      }
      saveProducts([...products, normalizedProduct]);
    }

    setShowProductModal(false);
  };

  const removeProduct = (id) => {
    if (window.confirm(`¿Eliminar producto "${id}"?`)) {
      saveProducts(products.filter(p => p.id !== id));
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
              <p className="mb-4">Gestión de productos disponibles en el catálogo.</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">ID Producto</th>
                    <th className="border border-gray-300 p-2">Imagen</th>
                    <th className="border border-gray-300 p-2">Nombre Producto</th>
                    <th className="border border-gray-300 p-2">Categoría</th>
                    <th className="border border-gray-300 p-2">Descripción</th>
                    <th className="border border-gray-300 p-2">Precio unitario</th>
                    <th className="border border-gray-300 p-2">Stock</th>
                    <th className="border border-gray-300 p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="border border-gray-300 p-2">{p.id}</td>
                      <td className="border border-gray-300 p-2">
                        {p.imagen ? (
                          <img src={p.imagen} alt={p.name} className="w-20 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-xs text-gray-500">Sin imagen</span>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">{p.name}</td>
                      <td className="border border-gray-300 p-2">{p.category || '—'}</td>
                      <td className="border border-gray-300 p-2">{p.description || '—'}</td>
                      <td className="border border-gray-300 p-2">${p.price.toLocaleString('es-CO')}</td>
                      <td className="border border-gray-300 p-2">{p.stock}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="bg-[#976ECD] text-white border-none py-1 px-3 rounded cursor-pointer hover:bg-[#9966D4] mr-2 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => removeProduct(p.id)}
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

        {/* Product Modal */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-[#333]">
                {editProduct ? 'Editar Producto' : 'Agregar Producto'}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID producto</label>
                  <input
                    type="text"
                    value={productForm.id}
                    onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: P001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Producto</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: Desayuno Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:border-[#976ECD]"
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Desayunos">Desayunos</option>
                    <option value="Anchetas">Anchetas</option>
                    <option value="Velas artesanales">Velas artesanales</option>
                    <option value="Retablos personalizados">Retablos personalizados</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Describe el producto"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                  <input
                    type="text"
                    value={productForm.imagen}
                    onChange={(e) => setProductForm({ ...productForm, imagen: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="https://.../imagen.jpg"
                  />
                  {productForm.imagen && (
                    <div className="mt-3">
                      <span className="block text-sm text-gray-500 mb-2">Vista previa:</span>
                      <img
                        src={productForm.imagen}
                        alt="Vista previa del producto"
                        className="w-full h-40 object-cover rounded border border-gray-200"
                        onError={(e) => { e.currentTarget.src = '/placeholder.png'; }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio unitario</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: 68000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#976ECD]"
                    placeholder="Ej: 10"
                  />
                </div>
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
      </div>
    </div>
  );
};

export default Dashboard;
