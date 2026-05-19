import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders,getCurrentUser } from "../utils/storage";

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = getCurrentUser();

    useEffect(() => {
        // 1. Validar que el usuario esté logueado
        if (!currentUser) {
            alert('⚠️ Debes iniciar sesión para ver tus pedidos.');
            navigate('/login');
            return;
        }
        // 2. Cargar pedidos del usuario
        const allOrders = getOrders();
        // Filtrar solo los pedidos del usuario actual
        const userOrders = allOrders.filter(
            (o) => o.userDocumento === currentUser.documento
        );
        setOrders(userOrders);
        setLoading(false);
    }, [currentUser, navigate]);

    return (
        <div className="container mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-[#9966D4]">Mis Pedidos</h1>
            {/* Mostrar mensaje de carga */}
            {loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg"> ⌛ Cargando tus pedidos...</p>
                </div>
            )}
            {/* Mostrar mensaje si no hay pedidos */}
            {!loading && orders.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg mb-4">📭 No tienes pedidos realizados.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#976ECD] text-white px-4 py-2 rounded hover:bg-[#9966D4] transition-colors"
                    >
                        Explorar Productos
                    </button>
                </div>
            )}

            {/* Listado de pedidos */}
            {!loading && orders.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#D4C5E6]">
                            <tr>
                                <th className="text-left py-3 px-6 text-[#976ECD] font-bold">Número de Pedido</th>
                                <th className="text-left py-3 px-6 text-[#976ECD] font-bold">Fecha</th>
                                <th className="text-left py-3 px-6 text-[#976ECD] font-bold">Total</th>
                                <th className="text-left py-3 px-6 text-[#976ECD] font-bold">Estado</th>
                                <th className="text-left py-3 px-6 text-[#976ECD] font-bold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx)=>(
                                <tr key={order.id || idx} className="border-b hover:bg-gray-50 cursor-pointer transition-colors">
                                <td className="py-3 px-6 font-bold text-[#976ECD] ">{order.id}</td>
                                <td className="py-3 px-6">{new Date(order.fecha).toLocaleDateString()}</td>
                                <td className="py-3 px-6 font-bold">${order.total?.toLocaleString() || 'N/A'}</td>
                                <td className="py-3 px-6">
                                <span className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                                    style={{
                                        backgroundColor:
                                        order.estado ==='Pendiente'? '#FF9800':
                                        order.estado === 'Confirmado' ? '#2196F3' :
                                        order.estado === 'En preparación' ? '#FF5722' :
                                        order.estado === 'En camino' ? '#4CAF50' :
                                        order.estado === 'Entregado' ? '#27AE60' : '#9E9E9E'
                                    }}>
                                    {order.estado}
                                </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                <button onClick={() => navigate(`/orders/${order.id}`)}
                                    className="bg-[#976ECD] text-white px-3 py-1 rounded hover:bg-[#9966D4] transition-colors text-sm"
                                >
                                    Ver Detalles
                                </button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}
            </div>
    );
};

export default MyOrders;