// Dependencias: hooks de React y React Router
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrders, getCurrentUser } from "../utils/storage";

const OrderDetail = () => {
    // Obtiene el ID de la URL y el usuario actual
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUser = getCurrentUser();

    // Busca la orden por ID y valida que pertenezca al usuario actual
    useEffect(() => {
        const orders = getOrders() || [];
        const foundOrder = orders.find(
            (o) => o.id === id && o.userDocumento === currentUser?.documento
        );
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            alert("❌ Orden no encontrada o no tienes permiso para verla.");
            navigate("/");
        }
        setLoading(false);
    }, [id, navigate, currentUser?.documento]);

    // Calcula subtotal, envio y total (usa valores del pedido o los calcula)
    const items = order?.items || [];
    const computedSubtotal = order?.subtotal ?? items.reduce((s, it) => s + ((it.precio || it.price || 0) * (it.quantity || 1)), 0);
    const envio = order?.envio ?? order?.shipping ?? 0;
    const computedTotal = order?.total ?? (computedSubtotal + envio);

    return (
        <div className="container mx-4 px-4 py-8">
            <h1 className="text-3xl font-bold text-[#976ECD] mb-6">Detalle de la Orden</h1>
            {/* Validacion de la orden */}
            {loading && (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Cargando detalles de tu orden...</p>
                </div>
            )}
            {/* Si no se encontro el pedido */}
            {!loading && !order && (
                <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontró la orden o no tienes permiso para verla.</p>
                </div>
            )}
            {/* Si se encontro el pedido */}
            {!loading && order && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* SECCIÓN 1 (lg:col-span-2) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Información del Pedido */}
                        <div className="bg-[#D4C5E6] rounded-xl p-6 shadow-md">
                            <h2 className="text-[#9966D4] text-xl mb-4 pb-2 border-b-2 border-[#BCA3DA]">Información del Pedido</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600 text-sm">Número de Pedido</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Fecha</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{new Date(order.fecha).toLocaleDateString('es-CO')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Datos de Envío */}
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-[#9966D4] text-xl mb-4 pb-2 border-b-2 border-[#BCA3DA]">Datos de Envío</h3>
                            <div className="space-y-3">
                                <div className="flex flex-col">
                                    <p className="text-gray-600 text-sm">Nombre Completo</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{order.userNombre || order.nombre || 'No disponible'}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-600 text-sm">Teléfono</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{order.telefono || 'No disponible'}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-600 text-sm">Dirección</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{typeof order.direccion === 'string' ? order.direccion : `${order.direccion?.calle ?? ''}${order.direccion?.numero ? ' #' + order.direccion.numero : ''}${order.direccion?.ciudad ? ', ' + order.direccion.ciudad : ''}`}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-600 text-sm">Método de Pago</p>
                                    <p className="text-[#976ECD] font-bold text-lg">{order.metodoPago}</p>
                                </div>
                            </div>
                        </div>

                        {/* Productos: lista de items del pedido */}
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-[#9966D4] text-xl mb-4 pb-2 border-b-2 border-[#BCA3DA]">Productos</h3>
                            {items.length === 0 ? (
                                <p className="text-gray-500">Sin productos registrados en esta orden.</p>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((it, idx) => {
                                        // Precio, cantidad y total por linea
                                        const price = it.precio ?? it.price ?? 0;
                                        const qty = it.quantity ?? 1;
                                        const line = price * qty;
                                        return (
                                            <div key={it.id || idx} className="flex justify-between items-center border-b pb-3">
                                                <div>
                                                    <p className="font-bold text-[#976ECD]">{it.nombre || it.title || it.name}</p>
                                                    <p className="text-sm text-gray-600">x{qty} · ${price.toLocaleString()}</p>
                                                </div>
                                                <p className="font-bold">${line.toLocaleString()}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN 2 (lg:col-span-1) */}
                    <aside className="lg:col-span-1 space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-md text-center">
                            <h4 className="text-[#9966D4] font-bold mb-3">Estado Actual</h4>
                            <p className="inline-block px-4 py-2 rounded-full bg-[#F3E8FF] text-[#9966D4] font-semibold">{order.estado || 'Pendiente'}</p>
                        </div>

                        <div className="bg-[#D4C5E6] rounded-xl p-6 shadow-md">
                            <h4 className="text-[#9966D4] font-bold mb-3">Resumen</h4>
                            <div className="flex justify-between mb-2"><span className="text-gray-600">Subtotal</span><span className="font-bold">${computedSubtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between mb-2"><span className="text-gray-600">Envío</span><span className="font-bold">${envio.toLocaleString()}</span></div>
                            <div className="flex justify-between mt-4 pt-3 border-t-2 border-[#BCA3DA]"><span className="font-bold text-lg">Total</span><span className="font-bold text-lg text-[#976ECD]">${computedTotal.toLocaleString()}</span></div>
                        </div>
                          {/* Historial de estados: timeline con circulo + linea + descripcion */}
                        <div className="bg-white rounded-b-xl p-6 shadow-md">
                            <h4 className="text-[#9966D4] font-bold mb-4">Seguimientode tu Pedido</h4>
                            {order.historialEstados && order.historialEstados.length >0? (
                                <div className="space-y-4">
                                {order.historialEstados.map((cambio,idx) =>(
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-[#976ECD]"></div>
                                            {idx < order.historialEstados.length -1 && (
                                                <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#976ECD]">{cambio.estado}</p>
                                            <p className="text-sm text-gray-600">{cambio.fecha}
                                            {cambio.hora && `- ${cambio.hora}`}</p>
                                        </div>
                                    </div>
                                ))}

                                </div>
                            ) : (
                                <p className="text-gray-500">No hay historial de estados disponible.</p>
                            )}
                        </div>
                    </aside>
                </div>
            )}
            {/* Botón para volver al listado de órdenes */}
            <div className="text-center mt-8">
                <button 
                onClick={()=> navigate ('/my-orders')}
                className="bg-[#976ECD] text-white py-2 px-4 rounded-lg hover:bg-[#9966D4] transition-colors">
                    Volver al listado de órdenes
                </button>
            </div>
        </div>
    );

};

export default OrderDetail;