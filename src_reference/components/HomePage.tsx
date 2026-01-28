import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, HardDrive, Monitor, Zap, TrendingUp, Award } from 'lucide-react';
import { Footer } from './Footer';
import { searchProducts } from './api';
import type { Product } from './types';
import { ProductCard } from './ProductCard';

interface HomePageProps {
    searchQuery: string;
}

export function HomePage({ searchQuery }: HomePageProps) {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }
            setLoading(true);
            try {
                const products = await searchProducts({ search: searchQuery });
                setSearchResults(products);
            } catch (error) {
                console.error("Failed to search products:", error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [searchQuery]);

    const addToCart = (product: Product) => {
    // Dummy function for passing to ProductCard,
    // real implementation is in App.tsx
    console.log(`Added ${product.name} to cart`);
    };

    if (searchQuery.trim() !== '') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">
                    Resultados de la Búsqueda
                </h2>
                {loading ? (
                    <p className="text-center text-white">Buscando...</p>
                ) : (
                    <div className="space-y-6">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                                <ProductCard
                                    key={product.id_key}
                                    product={product}
                                    categoryName={' '}
                                    onAddToCart={addToCart}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-400">No se encontraron productos para "{searchQuery}"</p>
                        )}
                    </div>
                )}
            </div>
        );
    }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="relative h-96 bg-black rounded-lg overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <img
              src="https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwYyUyMHNldHVwfGVufDF8fHx8MTc2NDk5OTE3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Gaming PC Setup"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Componentes de Alta Calidad</h1>
                <p className="mb-8 text-gray-300">Construye la PC de tus sueños</p>
                <Link
                  to="/products"
                  className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-md hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Ver Productos
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">Categorías Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm group">
              <Cpu className="mx-auto mb-4 text-cyan-400 group-hover:text-purple-400 transition-colors" size={48} />
              <h3 className="mb-2 text-white text-xl font-bold">Procesadores</h3>
              <p className="text-gray-400">Intel y AMD de última generación</p>
            </div>
            <div className="border border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm group">
              <HardDrive className="mx-auto mb-4 text-purple-400 group-hover:text-pink-400 transition-colors" size={48} />
              <h3 className="mb-2 text-white text-xl font-bold">Almacenamiento</h3>
              <p className="text-gray-400">SSD y HDD de alta velocidad</p>
            </div>
            <div className="border border-pink-500/30 rounded-lg p-8 text-center hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm group">
              <Monitor className="mx-auto mb-4 text-pink-400 group-hover:text-cyan-400 transition-colors" size={48} />
              <h3 className="mb-2 text-white text-xl font-bold">Monitores</h3>
              <p className="text-gray-400">Pantallas de alta resolución</p>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group">
              <div className="h-48 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1645802106095-765b7e86f5bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYnxlbnwxfHx8fDE3NjQ5OTM4MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Keyboard"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white mb-2 font-bold text-lg">Teclado Mecánico RGB</h3>
                <p className="text-cyan-400 font-bold text-xl">29.99</p>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg overflow-hidden hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group">
              <div className="h-48 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjUwNDExNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Mouse"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white mb-2 font-bold text-lg">Mouse Gaming Pro</h3>
                <p className="text-purple-400 font-bold text-xl">$79.99</p>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg overflow-hidden hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 group">
              <div className="h-48 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1677086813101-496781a0f327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0fGVufDF8fHx8MTc2NTA0MTAyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Headset"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white mb-2 font-bold text-lg">Audífonos Surround 7.1</h3>
                <p className="text-pink-400 font-bold text-xl">49.99</p>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg overflow-hidden hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group">
              <div className="h-48 bg-gray-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1636487658609-28282bb5a3a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGFpcnxlbnwxfHx8fDE3NjQ5ODc2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Gaming Chair"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white mb-2 font-bold text-lg">Silla Gaming Ergonómica</h3>
                <p className="text-cyan-400 font-bold text-xl">$299.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-6 text-center hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full mb-4 border border-cyan-500/50">
                <Zap className="text-cyan-400" size={32} />
              </div>
              <h3 className="text-white mb-2 font-bold text-xl">Envío Rápido</h3>
              <p className="text-gray-400">Recibe tus productos en 24-48 horas</p>
            </div>

            <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4 border border-purple-500/50">
                <Award className="text-purple-400" size={32} />
              </div>
              <h3 className="text-white mb-2 font-bold text-xl">Garantía Extendida</h3>
              <p className="text-gray-400">Todos nuestros productos incluyen garantía</p>
            </div>

            <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-6 text-center hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-full mb-4 border border-pink-500/50">
                <TrendingUp className="text-pink-400" size={32} />
              </div>
              <h3 className="text-white mb-2 font-bold text-xl">Mejor Precio</h3>
              <p className="text-gray-400">Garantizamos los precios más competitivos</p>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-cyan-500/30 rounded-lg p-12 text-center shadow-xl shadow-cyan-500/20">
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">Envíos Gratis</h2>
          <p className="text-gray-300 mb-8 text-lg">En compras mayores a 00</p>
          <Link
            to="/products"
            className="inline-block border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-md hover:bg-cyan-400 hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}