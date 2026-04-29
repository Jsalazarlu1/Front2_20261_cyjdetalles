// Utilidades para manejar localStorage

export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const findUserByDocument = (documento) => {
  const users = getUsers();
  return users.find((u) => u.documento === documento);
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
