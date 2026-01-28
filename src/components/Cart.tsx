import React from 'react';
import { ShoppingCart, X, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
// import { toast } from 'sonner'; // Use alert for now as Sonner might not be set up
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
    onCheckoutSuccess: () => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckoutSuccess }: CartProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!user) {
            alert('Debes iniciar sesión para finalizar la compra.');
            onClose();
            navigate('/login');
            return;
        }

        if (items.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        try {
            // 1. Create Bill
            const billData = {
                client_id: Number(user.id),
                total: total,
                bill_number: `B-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                payment_type: 1, // 1: Cash/Card whatever
            };

            console.log("Creating bill...", billData);
            const createdBill = await api.createBill(billData);

            // 2. Create Order
            const orderData = {
                client_id: Number(user.id),
                total: total,
                status: 1, // 1: Pendiente
                delivery_method: 1, // 1: Pickup
                // date: new Date().toISOString(), // Optional in schema?
                bill_id: createdBill.id_key || 0,
            };
            console.log("Creating order...", orderData);
            const createdOrder = await api.createOrder(orderData);

            // 3. Create Order Details
            const orderId = createdOrder.id_key || 0;
            await Promise.all(
                items.map(item => {
                    const detailData = {
                        order_id: orderId,
                        product_id: item.product.id_key,
                        quantity: item.quantity,
                        price: item.product.price
                    };
                    return api.createOrderDetail(detailData);
                })
            );

            alert(`¡Compra #${orderId} realizada con éxito!`);

            onCheckoutSuccess();
            onClose();

        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert('Error al procesar la compra. Inténtalo de nuevo.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l-4 border-orange-600">
                <div className="flex items-center justify-between p-6 bg-gray-900 border-b border-orange-600">
                    <div className="flex items-center gap-2 text-white">
                        <ShoppingCart className="w-6 h-6 text-orange-500" />
                        <h2 className="text-xl font-black uppercase tracking-wider">Tu Carrito</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                            <ShoppingCart size={48} className="mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-wide">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.product.id_key} className="bg-white border-2 border-gray-200 p-4 shadow-sm flex gap-4 transition-all hover:border-orange-200 relative group">
                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-orange-500 clip-path-polygon-[0_0,100%_0,100%_100%] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ShoppingCart size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 uppercase text-sm mb-1 line-clamp-2">{item.product.name}</h3>
                                        <div className="text-orange-600 font-black text-lg">${item.product.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <button
                                            onClick={() => onRemove(item.product.id_key)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="flex items-center border-2 border-gray-200 bg-gray-100">
                                            <button
                                                onClick={() => onUpdateQuantity(item.product.id_key, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-200 text-gray-600"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.product.id_key, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-gray-900 text-white border-t-4 border-orange-600">
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-gray-400 text-sm font-medium uppercase">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm font-medium uppercase">
                                <span>Envío</span>
                                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-gray-700 text-2xl font-black text-white uppercase mt-2">
                                <span>Total</span>
                                <span className="text-orange-500">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-orange-600 text-white font-black uppercase py-4 hover:bg-orange-700 transition-all flex items-center justify-center gap-2 tracking-widest hover:translate-y-[-2px] active:translate-y-[0px] shadow-lg"
                        >
                            <CreditCard size={20} />
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
