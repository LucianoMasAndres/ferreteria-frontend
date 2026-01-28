import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import { Login } from './components/Login';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { Cart } from './components/Cart';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={items}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckoutSuccess={clearCart}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t-4 border-orange-600">
          <p>&copy; 2025 Ferretería Industrial. Todos los derechos reservados.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
