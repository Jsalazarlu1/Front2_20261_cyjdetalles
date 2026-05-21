// Utilidades para manejar localStorage

export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  // Guarda en 'users' para el login
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));

  // Guarda también en 'clients' para que aparezca en el Dashboard
  const clients = localStorage.getItem('clients');
  const clientList = clients ? JSON.parse(clients) : [];
  clientList.push({
    id_cliente: user.id_cliente || Date.now().toString(),
    ti_documento: user.ti_documento || '',
    n_documento: user.n_documento || user.documento || '',
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    telefono: user.telefono || '',
    direccion: user.direccion || '',
    ciudad: user.ciudad || '',
    email: user.email || '',
    fecha_registro: user.fecha_registro || new Date().toISOString().split('T')[0],
    activo: true,
    pedidos: 0
  });
  localStorage.setItem('clients', JSON.stringify(clientList));
};

export const findUserByDocument = (documento) => {
  const users = getUsers();
  return users.find((u) => u.n_documento === documento || u.documento === documento);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};

export const isAdmin = (user) => {
  return user && user.isAdmin;
};

export const setAdminSession = () => {
  localStorage.setItem('session', JSON.stringify({ loggedIn: true, isAdmin: true }));
};

export const getAdminSession = () => {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};

export const clearAdminSession = () => {
  localStorage.removeItem('session');
};

// ===== FUNCIONES PARA ÓRDENES Y DETALLE_PEDIDO =====

const ESTADOS = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado'];

// Genera un ID único para cada orden
const generateOrderId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
};

// Guarda una nueva orden
export const saveOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    id: generateOrderId(),
    fecha: new Date().toISOString(),
    estado: 'Pendiente',
    ...orderData,
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));
  return newOrder;
};

// Obtiene todas las órdenes
export const getOrders = () => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

// Obtiene órdenes de un usuario específico por su documento
export const getOrdersByUser = (documento) => {
  const orders = getOrders();
  return orders.filter((o) => o.userDocumento === documento);
};

// Actualiza el estado de una orden
export const updateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return false;
  if (!ESTADOS.includes(newStatus)) return false;
  orders[index].estado = newStatus;
  // Si el pedido no tiene historial de estados, crea un array vacio
  if (!orders[index].historialEstado) {
    orders[index].historialEstados = [];
  }
  // Agrega un nuevo registro al historial de estados
  orders[index].historialEstados.push({
    estado: newStatus,
    fecha: new Date().toLocaleDateString('es-Co'),
    hora: new Date().toLocaleTimeString('es-Co')
  });
  // Guarda los cambios en localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
  return true;
};

// Obtiene el siguiente estado disponible en la secuencia
export const getNextStatus = (currentStatus) => {
  const idx = ESTADOS.indexOf(currentStatus);
  if (idx === -1 || idx === ESTADOS.length - 1) return null;
  return ESTADOS[idx + 1];
};

export { ESTADOS };
