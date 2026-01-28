import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
// import { toast } from 'sonner'; // Wait, I didn't install sonner. I should stick to alert or simple confirm, or install sonner. Let's use simple alert for now or just log. Or no feedback?
// I'll skip sonner for now to avoid install complexity in this turn.

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
        // Ideally use toast here.
    };

    return (
        <div className="group flex flex-col bg-white border-2 border-transparent hover:border-gray-900 transition-colors duration-200">
            {/* Image Placeholder */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/5 transition-colors z-10" />
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 font-mono text-xs uppercase">Imagen no disponible</span>
                )}
                {/* Banner for low stock */}
                {product.stock < 10 && (
                    <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-20">
                        ¡Poco Stock!
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wide">
                    Ref: {product.id_key}
                </div>
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-through decoration-red-500 decoration-2 font-mono">
                            ${(product.price * 1.2).toFixed(2)}
                        </span>
                        <span className="text-2xl font-black text-gray-900 font-mono">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-gray-900 text-white p-3 hover:bg-orange-600 active:scale-95 transition-all duration-200"
                        title="Agregar al carrito"
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
