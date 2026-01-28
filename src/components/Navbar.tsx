import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Wrench, Menu, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    onCartClick: () => void;
}

const Navbar = ({ onCartClick }: NavbarProps) => {
    const { itemCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 text-white border-b-4 border-orange-600 sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-orange-600 p-2 rounded-sm rotate-3 group-hover:rotate-0 transition-transform duration-300">
                            <Wrench className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black uppercase tracking-tighter leading-none font-mono">
                                FERRETERÍA
                            </span>
                            <span className="text-xs text-orange-500 font-bold uppercase tracking-widest leading-none">
                                INDUSTRIAL
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                placeholder="Buscar herramientas..."
                                className="w-full bg-gray-800 border-2 border-gray-700 text-gray-100 px-4 py-2 pl-10 focus:outline-none focus:border-orange-500 focus:bg-gray-900 transition-colors uppercase text-sm font-medium rounded-sm placeholder-gray-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8 font-bold uppercase text-sm tracking-tight">
                        <Link to="/" className="hover:text-orange-500 transition-colors">Inicio</Link>
                        <Link to="/products" className="hover:text-orange-500 transition-colors">Productos</Link>

                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-orange-500 font-black uppercase text-xs hover:text-orange-400 border border-orange-500 px-2 py-1">
                                        Admin
                                    </Link>
                                )}
                                <div className="hidden md:block text-right leading-tight mr-2">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase">Bienvenido</div>
                                    <div className="text-xs font-black text-white uppercase">{user.name}</div>
                                </div>
                                <Link to="/profile" className="bg-orange-600 text-white px-4 py-2 rounded-sm font-black uppercase text-xs tracking-wider hover:bg-white hover:text-orange-600 border-2 border-orange-600 transition-colors flex items-center gap-2 shadow-md">
                                    <User size={16} />
                                    Mi Perfil
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors ml-2">Salir</button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                <User className="w-5 h-5" />
                                <span>Ingresar</span>
                            </Link>
                        )}

                        <button
                            onClick={onCartClick}
                            className="relative p-2 hover:bg-gray-800 rounded-sm transition-colors group"
                        >
                            <ShoppingCart className="h-6 w-6 group-hover:text-orange-500 transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-none shadow-sm">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-300 hover:text-white">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
