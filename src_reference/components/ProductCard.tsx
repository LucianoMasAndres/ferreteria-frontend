import { ShoppingCart, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../components/types';

interface ProductCardProps {
  product: Product;
  categoryName: string;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, categoryName, onAddToCart }: ProductCardProps) {
  return (
    <div className="border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex gap-6 bg-gray-800/50 backdrop-blur-sm group">
      {/* Product Image */}
      <div className="w-48 h-48 flex-shrink-0 bg-gray-900 rounded-md overflow-hidden border border-purple-500/20 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-white text-center p-4">{product.name}</div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="text-sm text-cyan-400 mb-1 font-semibold">{categoryName}</div>
          <h3 className="mb-2 text-white text-xl font-bold">{product.name}</h3>
          <p className="text-gray-400 mb-4">{product.description}</p>
          <div className="text-sm text-purple-400 font-semibold">Marca: {product.brand}</div>
        </div>

        {/* Price and Action */}
        <div className="mt-4 pt-4 border-t border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-bold">${product.price.toFixed(2)}</div>
          </div>
          <div className="flex gap-3">
            <Link
              to={`/product/${product.id_key}`}
              className="flex-1 bg-gray-700 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-md hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              <Info size={20} />
              Ver Especificaciones
            </Link>
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-md hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 font-semibold"
            >
              <ShoppingCart size={20} />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}