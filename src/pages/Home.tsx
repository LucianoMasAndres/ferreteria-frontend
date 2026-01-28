import { useEffect, useState } from 'react';
import { api } from '../api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, Wrench, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getProducts(0, 4)
            .then(setFeaturedProducts)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white py-24 px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                        Construye <span className="text-orange-500">Sin Límites</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                        Herramientas de alto rendimiento para profesionales exigentes.
                        Calidad industrial garantizada.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link
                            to="/products"
                            className="bg-orange-600 text-white font-bold py-4 px-8 uppercase tracking-widest hover:bg-orange-700 transition-colors border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
                        >
                            Ver Catálogo Completo
                        </Link>
                        <Link
                            to="/offers"
                            className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            Ofertas Del Mes
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: ShieldCheck, title: "Garantía de Por Vida", desc: "En todas nuestras herramientas manuales." },
                    { icon: Truck, title: "Envío Express", desc: "Despacho en 24h a todo el país." },
                    { icon: Wrench, title: "Servicio Técnico", desc: "Expertos listos para ayudarte." },
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white border-l-4 border-orange-600 p-8 shadow-sm hover:shadow-md transition-shadow">
                        <feature.icon className="h-10 w-10 text-orange-600 mb-4" />
                        <h3 className="text-xl font-black uppercase mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                    </div>
                ))}
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex items-center justify-between mb-8 border-b-2 border-gray-200 pb-4">
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                        <span className="w-2 h-8 bg-orange-600 block"></span>
                        Productos Destacados
                    </h2>
                    <Link to="/products" className="group flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 uppercase text-sm">
                        Ver Todos
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse bg-gray-200 h-96"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((p) => (
                                <ProductCard key={p.id_key} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">No hay productos destacados disponibles actualmente.</div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
