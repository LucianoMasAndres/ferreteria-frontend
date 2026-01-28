import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem, Product } from '../components/types';
import { useAuth } from '../context/AuthContext';
import { createOrder, createOrderDetail, createBill, getProducts } from '../components/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckoutSuccess: () => void;
  setShowPurchaseSuccessPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckoutSuccess, setShowPurchaseSuccessPopup }: CartProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para finalizar la compra.');
      onClose();
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío.');
      return;
    }

    try {
      // --- Stock Verification ---
      const products = await getProducts();
      const productsMap = new Map(products.map(p => [p.id_key, p]));
      const stockErrors = [];
      for (const item of items) {
        const productInDb = productsMap.get(item.id_key);
        if (!productInDb) {
          stockErrors.push(`El producto "${item.name}" ya no está disponible.`);
        } else if (item.quantity > productInDb.stock) {
          stockErrors.push(`No hay stock para "${item.name}". Disponible: ${productInDb.stock}, en carrito: ${item.quantity}.`);
        }
      }

      if (stockErrors.length > 0) {
        toast.error(stockErrors.join(' '));
        return;
      }

      // 1. Create Bill
      const billData = {
        client_id: Number(user.id),
        total: total,
        bill_number: `B-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        payment_type: 1, // 1: Asumiendo 'Tarjeta'
      };
      const createdBill = await createBill(billData);

      // 2. Create Order
      const orderData = {
        client_id: Number(user.id),
        total: total,
        status: 1, // 1: 'Pendiente'
        delivery_method: 1, // 1: 'Pickup'
        date: new Date().toISOString(),
        bill_id: createdBill.id_key,
      };
      const createdOrder = await createOrder(orderData);
      
      // 3. Create Order Details
      const orderId = createdOrder.id_key;
      await Promise.all(
        items.map(item => {
          const detailData = {
            order_id: orderId,
            product_id: item.id_key,
            quantity: item.quantity,
            price: item.price
          };
          return createOrderDetail(detailData);
        })
      );
      
      toast.success(`¡Compra #${orderId} realizada con éxito!`);
      
      // Clear cart and update UI
      onCheckoutSuccess();
      onClose(); // Close the cart
      setShowPurchaseSuccessPopup(true); // Show the purchase success popup



    } catch (error) {
      console.error('Error al crear la orden:', error);
      toast.error('Error al procesar la compra. Inténtalo de nuevo.');
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-cyan-500/30">
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/30">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-2xl">Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="text-gray-200 hover:text-cyan-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tu carrito está vacío
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id_key} className="border border-cyan-500/30 rounded-lg p-4 bg-gray-800/50">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate text-white">{item.name}</h3>
                      <div className="text-gray-300">${item.price.toFixed(2)}</div>
                    </div>
                    <button
                      onClick={() => onRemove(item.id_key)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cyan-500/20">
                    <div className="flex items-center gap-3 border border-cyan-500/30 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(item.id_key, item.quantity - 1)}
                        className="p-2 text-white hover:bg-cyan-500/20"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id_key, item.quantity + 1)}
                        className="p-2 text-white hover:bg-cyan-500/20"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-xl">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-cyan-500/30 p-6 bg-gray-800/50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-cyan-500/20 text-white text-xl">
                <span>Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-md font-bold"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}