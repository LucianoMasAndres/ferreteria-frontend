import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';
import { User, Package, Clock, CheckCircle, Smartphone, Mail, CreditCard } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [user, navigate]);

    const loadOrders = async () => {
        if (!user?.id) return;
        try {
            const data = await api.getOrdersByClient(Number(user.id));
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    if (!user) return null;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-black uppercase text-gray-900 mb-8 border-l-8 border-orange-600 pl-4">Mi Perfil</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <div className="bg-white border-2 border-gray-200 shadow-lg p-6 h-fit">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border-2 border-orange-200">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl text-gray-800">{user.name} {user.lastname}</h2>
                            <span className="text-xs font-bold uppercase text-gray-400">Cliente Registrado</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                            <Mail size={18} className="text-orange-500" />
                            <span className="font-medium">{user.email}</span>
                        </div>
                        {user.telephone && (
                            <div className="flex items-center gap-3 text-gray-600">
                                <Smartphone size={18} className="text-orange-500" />
                                <span className="font-medium">{user.telephone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-gray-600">
                            <CreditCard size={18} className="text-orange-500" />
                            <span className="font-medium">Total Gastado: <span className="text-gray-900 font-bold">${totalSpent.toFixed(2)}</span></span>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full mt-8 bg-gray-900 text-white font-bold uppercase py-2 hover:bg-red-600 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* Orders History */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-black uppercase text-gray-800 flex items-center gap-2">
                        <Package className="text-orange-600" />
                        Historial de Compras ({orders.length})
                    </h3>

                    {loading ? (
                        <div className="text-gray-400 p-8 text-center italic">Cargando historial...</div>
                    ) : orders.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-12 text-center rounded-lg">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Aún no has realizado compras.</p>
                            <button onClick={() => navigate('/')} className="mt-4 text-orange-600 font-bold uppercase hover:underline">Ir a comprar</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id_key} className="bg-white border border-gray-200 p-4 transition-all hover:shadow-md hover:border-orange-300">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <div className="font-black text-lg text-gray-900 uppercase">Orden #{order.id_key}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock size={14} /> {new Date(order.date || Date.now()).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-xl text-orange-600">${order.total.toFixed(2)}</div>
                                            <div className="text-xs font-bold uppercase px-2 py-1 bg-green-100 text-green-700 inline-block rounded mt-1">
                                                {order.status === 1 ? 'Pendiente' : 'Completado'} #Status{order.status}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Order items could be fetched if we had an endpoint or included them, for now just summary */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
