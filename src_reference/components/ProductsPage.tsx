import { useState, useMemo, useEffect } from 'react';
import type { Product, Category } from '../components/types';
import { getProducts, getCategories, searchProducts, ProductFilter } from '../components/api';
import { ProductCard } from './ProductCard';
import { Footer } from './Footer';

interface ProductsPageProps {
  addToCart: (product: Product) => void;
  searchQuery: string;
}

export function ProductsPage({ addToCart, searchQuery }: ProductsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filter: ProductFilter = {
          search: searchQuery,
          category_id: selectedCategory,
          min_price: minPrice ? parseFloat(minPrice) : undefined,
          max_price: maxPrice ? parseFloat(maxPrice) : undefined,
          in_stock_only: inStockOnly,
          sort_by: sortBy !== 'default' ? sortBy : undefined,
        };
        const products = await searchProducts(filter);
        setCurrentProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, inStockOnly, sortBy]);

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach(cat => map.set(cat.id_key, cat.name));
    return map;
  }, [categories]);

  const categoryOptions = useMemo(() => {
    return [{ id_key: undefined, name: 'Todas' }, ...categories];
  }, [categories]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-24 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-lg shadow-cyan-500/10">
            <h2 className="mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Filtros</h2>

            {/* Category Filter */}
            <div className="mb-8 pb-8 border-b border-cyan-500/20">
              <h3 className="mb-3 text-cyan-400">Categoría</h3>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <label key={category.id_key} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={category.id_key}
                      checked={selectedCategory === category.id_key}
                      onChange={() => setSelectedCategory(category.id_key)}
                      className="w-4 h-4 accent-cyan-400"
                    />
                    <span className="text-gray-300 group-hover:text-cyan-400 transition-colors">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8 pb-8 border-b border-cyan-500/20">
              <h3 className="mb-3 text-pink-400">Precio</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-500/30 rounded-md px-4 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-500/30 rounded-md px-4 py-2 text-white"
                />
              </div>
            </div>
            
            {/* Stock and Sort Filters */}
            <div className="pb-8 border-b border-cyan-500/20">
              <h3 className="mb-3 text-green-400">Otros</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-green-400"
                  />
                  <span className="text-gray-300 group-hover:text-green-400 transition-colors">En stock</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-500/30 rounded-md px-3 py-2 text-white"
                >
                  <option value="default">Por defecto</option>
                  <option value="price_asc">Precio: de menor a mayor</option>
                  <option value="price_desc">Precio: de mayor a menor</option>
                  <option value="name_asc">Nombre: A-Z</option>
                  <option value="name_desc">Nombre: Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-4xl font-bold">Productos</h1>
            <p className="text-gray-400 text-lg font-semibold">{currentProducts.length} productos encontrados</p>
          </div>

          <div className="space-y-6">
            {currentProducts.map(product => (
              <ProductCard
                key={product.id_key}
                product={product}
                categoryName={categoryMap.get(product.category_id) || 'Desconocida'}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {currentProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-gray-800/50 border border-cyan-500/30 rounded-lg">
              No se encontraron productos con los filtros seleccionados
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}