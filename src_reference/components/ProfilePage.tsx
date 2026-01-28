import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as AuthUser, Mail, Phone, MapPin, CreditCard, Package, Calendar, DollarSign, Edit2, Save, X, Plus, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import type { Order, Address, Bill, Client, OrderDetail } from './types';
import { getProfile, getOrdersByClientId, getOrderDetails, getAddressesByClientId, createAddress, updateAddress, deleteAddress, getBillsByClientId, getProducts } from './api';
import type { AddressCreate } from './api';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<number, OrderDetail[]>>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState<Omit<Address, 'id_key' | 'client_id'>>({
    street: '',
    number: '',
    city: '',
  });

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [userProfile, userOrders, userAddresses, userBills] = await Promise.all([
        getProfile(Number(user.id)),
        getOrdersByClientId(Number(user.id)),
        getAddressesByClientId(Number(user.id)),
        getBillsByClientId(Number(user.id)),
      ]);
      setProfile(userProfile ?? null);
      setOrders(userOrders);
      setAddresses(userAddresses);
      setBills(userBills);
    } catch (error) {
      toast.error('Error al cargar los datos del perfil');
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    if (orderDetails[orderId]) {
      return;
    }
    try {
      const allProducts = await getProducts(); // Fetch all products
      const productMap = new Map(allProducts.map(p => [p.id_key, p]));

      const details = await getOrderDetails(orderId);
      const detailsWithProductNames = details.map(detail => ({
        ...detail,
        product: productMap.get(detail.product_id) || detail.product // Augment detail with product info
      }));
      setOrderDetails(prev => ({ ...prev, [orderId]: detailsWithProductNames }));
    } catch (error) {
      toast.error(`Error al cargar los detalles del pedido #${orderId}: ${error.message || error}`);
    }
  };


  // ... (address handlers are the same)

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... Profile Header ... */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* User Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
                  Mi Perfil
                </h2>
                {profile && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <AuthUser className="w-6 h-6 text-cyan-400" />
                            <span className="text-white">{profile.name} {profile.lastname}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="w-6 h-6 text-cyan-400" />
                            <span className="text-white">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-cyan-400" />
                            <span className="text-white">{profile.telephone || 'No especificado'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Address Management */}
            {/* ... */}

            {/* Bills */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
                  Mis Facturas
                </h2>
                <div className="space-y-4">
                    {bills.map(bill => (
                        <div key={bill.id_key} className="p-4 bg-gray-900/50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-white font-semibold">Factura #{bill.bill_number}</p>
                                <p className="text-gray-400 text-sm">{new Date(bill.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-lg">${bill.total.toFixed(2)}</p>
                                <p className="text-gray-400 text-sm">{bill.payment_type}</p>
                            </div>
                        </div>
                    ))}
                    {bills.length === 0 && <p className="text-gray-500">No tienes facturas.</p>}
                </div>
            </div>
          </div>

          {/* Quick Stats */}
          {/* ... */}
        </div>

        {/* Orders History */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
                Historial de Pedidos
            </h2>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id_key}>
                        <div className="p-4 bg-gray-900/50 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-white font-semibold">Pedido #{order.id_key}</p>
                                <p className="text-gray-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold text-lg">${order.total.toFixed(2)}</p>
                                <button
                                    onClick={() => fetchOrderDetails(order.id_key)}
                                    className="text-cyan-400 hover:text-cyan-300 transition"
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                        {orderDetails[order.id_key] && (
                            <div className="p-4 bg-gray-900 rounded-b-lg">
                                <h4 className="font-semibold text-white mb-2">Detalles del Pedido:</h4>
                                <ul className="space-y-2">
                                    {orderDetails[order.id_key].map(detail => (
                                        <li key={detail.id_key} className="flex justify-between text-gray-300">
                                            <span>{detail.quantity} x {detail.product?.name || `Producto ID: ${detail.product_id}`}</span>
                                            <span>${detail.price.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
                {orders.length === 0 && <p className="text-gray-500">No has realizado ningún pedido.</p>}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}