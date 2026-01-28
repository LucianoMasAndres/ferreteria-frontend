import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from "sonner";
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ProductsPage } from './components/ProductsPage';
import { ProductDetail } from './components/ProductDetail';
import { ProfilePage } from './components/ProfilePage';
import { Login } from './components/Login';
import { AdminPage } from './components/AdminPage';
import { Cart } from './components/Cart';
import { PurchaseSuccessPopup } from './components/PurchaseSuccessPopup'; // Import the popup
import type { Product, CartItem } from './components/types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPurchaseSuccessPopup, setShowPurchaseSuccessPopup] = useState(false); // New state

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id_key === product.id_key);
      if (existingItem) {
        toast.success(`${product.name} agregado al carrito`, {
          description: `Cantidad: ${existingItem.quantity + 1}`,
          duration: 2000,
          style: {
            background: 'linear-gradient(to right, #06b6d4, #a855f7)',
            border: '1px solid #06b6d4',
            color: 'white',
          },
        });
        return prev.map(item =>
          item.id_key === product.id_key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} agregado al carrito`, {
        description: `Precio: $${product.price.toFixed(2)}`,
        duration: 2000,
        style: {
          background: 'linear-gradient(to right, #06b6d4, #a855f7)',
          border: '1px solid #06b6d4',
          color: 'white',
        },
      });
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id_key !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id_key === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleCheckoutSuccess = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Toaster position="bottom-left" richColors />
        <AuthProvider>
          <Navbar
            cartItemsCount={cartItemsCount}
            onCartClick={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <Routes>
            <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
            <Route
              path="/products"
              element={
                <ProductsPage
                  addToCart={addToCart}
                  searchQuery={searchQuery}
                />
              }
            />
            <Route path="/product/:id_key" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckoutSuccess={handleCheckoutSuccess}
            setShowPurchaseSuccessPopup={setShowPurchaseSuccessPopup} // Pass the setter
          />
          <PurchaseSuccessPopup 
            isVisible={showPurchaseSuccessPopup} 
            onClose={() => setShowPurchaseSuccessPopup(false)} 
          />
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;