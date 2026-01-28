import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { getProductById, searchProducts, ProductFilter } from '../components/api';
import type { Product } from '../components/types';
import { Footer } from './Footer';
import { toast } from 'sonner';

interface ProductDetailProps {
  addToCart: (product: Product) => void;
}

export function ProductDetail({ addToCart }: ProductDetailProps) {
  const { id_key } = useParams<{ id_key: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id_key) {
      fetchData(id_key);
    }
  }, [id_key]);

  const fetchData = async (productId: string) => {
    setLoading(true);
    try {
      const fetchedProduct = await getProductById(Number(productId));
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        loadProductRecommendations(fetchedProduct);
      }
    } catch (error) {
      console.error("Failed to fetch product data:", error);
      toast.error('Error al cargar el producto.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProductRecommendations = async (currentProduct: Product) => {
    if (!currentProduct.category_id) {
      setRecommendations([]);
      return;
    }

    try {
      const filter: ProductFilter = {
        category_id: currentProduct.category_id,
      };
      const products = await searchProducts(filter);
      const recommended = products
        .filter(p => p.id_key !== currentProduct.id_key)
        .slice(0, 4);
      setRecommendations(recommended);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <p className="text-2xl mb-4">Producto no encontrado</p>
        <button onClick={() => navigate('/products')} className="bg-cyan-500 text-white px-4 py-2 rounded-lg">
          Volver a productos
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-400 mb-8">
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <img src={product.image_url} alt={product.name} className="w-full h-auto object-cover rounded-md" />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">{product.name}</h1>
            <p className="text-gray-400 mb-6">{product.description}</p>
            <div className="text-4xl text-white font-bold mb-6">${product.price.toFixed(2)}</div>
            <p className="text-green-400 mb-6">{product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</p>
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-md hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? 'Agregar al carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
            También te podría interesar
          </h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(recProduct => (
                <div key={recProduct.id_key} className="border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-400 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm">
                  <img src={recProduct.image_url} alt={recProduct.name} className="w-full h-40 object-cover rounded-md mb-4"/>
                  <h3 className="text-white text-lg font-bold mb-2">{recProduct.name}</h3>
                  <div className="text-xl text-cyan-400 font-bold mb-4">${recProduct.price.toFixed(2)}</div>
                  <Link
                    to={`/product/${recProduct.id_key}`}
                    className="w-full bg-gray-700 text-cyan-400 px-4 py-2 rounded-md hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 font-semibold"
                  >
                    <Info size={16} />
                    Ver Detalles
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay recomendaciones disponibles.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
