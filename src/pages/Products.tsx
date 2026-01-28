import { useEffect, useState } from 'react';
import { api } from '../api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [prods, cats] = await Promise.all([
                    api.getProducts(0, 100),
                    api.getCategories()
                ]);
                setProducts(prods);
                setCategories(cats);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-gray-200 pb-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">Catálogo</h1>
                    <p className="text-gray-500 font-mono mt-1">Explora nuestra selección de herramientas.</p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter className="h-5 w-5 text-gray-400" />
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 font-bold uppercase text-xs tracking-wider border-2 transition-all ${selectedCategory === null
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id_key}
                            onClick={() => setSelectedCategory(cat.id_key || null)}
                            className={`px-4 py-2 font-bold uppercase text-xs tracking-wider border-2 transition-all whitespace-nowrap ${selectedCategory === cat.id_key
                                    ? 'bg-orange-600 text-white border-orange-600'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-96"></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(p => (
                            <ProductCard key={p.id_key} product={p} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-24 text-gray-400 font-mono uppercase">
                            No se encontraron productos en esta categoría.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;
