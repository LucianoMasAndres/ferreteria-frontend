import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navbar({ cartItemsCount, onCartClick, searchQuery, onSearchChange }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-cyan-500/30 bg-black/90 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-cyan-400 flex-shrink-0 tracking-wider uppercase text-xl font-bold">
              TechStore
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold">
                Inicio
              </Link>
              <Link to="/products" className="text-gray-300 hover:text-cyan-400 transition-colors font-semibold">
                Productos
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-cyan-500/50 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                    title="Panel de Administración"
                  >
                    <Shield size={24} />
                  </Link>
                )}
                <Link to="/profile" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  <User size={24} />
                </Link>
                <button 
                  className="relative text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={onCartClick}
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg shadow-cyan-500/50">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <button 
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={logout}
                  title="Cerrar Sesión"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/profile" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  <User size={24} />
                </Link>
                <button 
                  className="relative text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={onCartClick}
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg shadow-cyan-500/50">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <button 
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => navigate('/login')}
                  title="Iniciar Sesión"
                >
                  <LogIn size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}