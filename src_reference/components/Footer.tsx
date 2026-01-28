import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black border-t border-cyan-500/30 mt-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-cyan-400 tracking-wider uppercase text-2xl font-bold mb-4">
              TechStore
            </h3>
            <p className="text-gray-400 mb-4">
              Tu tienda de confianza para componentes de PC gaming de alta calidad.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail size={20} className="text-cyan-400" />
              <span>info@techstore.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Ofertas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Política de Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Garantías
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Síguenos</h4>
            <p className="text-gray-400 mb-4">
              Mantente al día con nuestras últimas ofertas y novedades
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-cyan-500/30 rounded-md flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-purple-500/30 rounded-md flex items-center justify-center text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-pink-500/30 rounded-md flex items-center justify-center text-pink-400 hover:bg-pink-500/20 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 border border-cyan-500/30 rounded-md flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyan-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © 2025 TechStore. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}