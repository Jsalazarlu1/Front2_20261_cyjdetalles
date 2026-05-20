const API_URL = 'http://localhost:9090/api';

// FUNCION LOGIN
export const loginUser = async (documento, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documento, password })
        });

        if (!response.ok) {
            throw new Error('Error en el login');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
};

// FUNCION REGISTRO
export const registerUser = async (nombre, documento, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, documento, email, password })
        });

        if (!response.ok) {
            throw new Error('Error en el registro');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en el registro:', error);
        throw error;
    }
};


///📦 DETALLE PEDIDO 

export const getAllDetallePedidos = async () => {
    try {
        const reponse = await fetch(`${API_URL}/detallepedidos` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!reponse.ok) {
            throw new Error('Error al obtener los detalles de pedidos');
        }
        const data = await reponse.json();
        return data;
        
    } catch (error) {
        console.error('Error al obtener los detalles de pedidos:', error);
        throw error;
    }
};

//obtener un detalle de pedido por ID
export const getDetallePedidoById = async (id) => {
    try {
        const reponse = await fetch(`${API_URL}/detallepedidos/${id}` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!reponse.ok) {
            throw new Error('Error al obtener el detalle de pedido');
        }
        const data = await reponse.json();
        return data;
    } catch (error) {
        console.error('Error al obtener el detalle de pedido:', error);
        throw error;
    }
};

//obtener detalles de pedidos por clientes

export const getDetallePedidosByClienteId = async (clienteId) => {
    try {
        const response = await fetch(`${API_URL}/detallepedidos/cliente/${clienteId}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        } 
        });
        if (!response.ok) {
            throw new Error('Error al obtener los detalles de pedidos del cliente');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los detalles de pedidos del cliente:', error);
        throw error;
    }
};

//crear un detalle de pedido
export const createDetallePedido = async (detallePedidoData) => {
    try {
        const response = await fetch(`${API_URL}/detallepedidos` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(detallePedidoData)
        });
        if (!response.ok) {
            throw new Error('Error al crear el detalle de pedido');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear el detalle de pedido:', error);
        throw error;
    }
}


//eliminar un detalle de pedido
export const deleteDetallePedido = async (id) => {
    try {
        const response = await fetch(`${API_URL}/detallepedidos/${id}` , {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el detalle de pedido');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al eliminar el detalle de pedido:', error);
        throw error;
    }
}

// 👥 USUARIOS

export const getAllUsuarios = async () => {
try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
    method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


// 🛍️ PRODUCTOS

export const getAllProductos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


// 👤 CLIENTES

export const getAllClientes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 📋 PEDIDOS

export const getAllPedidos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener pedidos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getPedidoById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Pedido no encontrado');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createPedido = async (pedidoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoData)
    });

    if (!response.ok) {
      throw new Error('Error al crear pedido');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updatePedido = async (id, pedidoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoData)
    });

    if (!response.ok) {
      throw new Error('Error al actualizar pedido');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deletePedido = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al eliminar pedido');
    }

    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};