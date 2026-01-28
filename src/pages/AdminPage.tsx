import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Product, Category, Client } from '../types';
import { Plus, Trash2, Edit, Save, X, Package, Layers, Users, Shield } from 'lucide-react';

export default function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [mainTab, setMainTab] = useState('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [isCreatingProduct, setIsCreatingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        loadData();
    }, [user, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([
                api.getProducts(),
                api.getCategories()
            ]);
            setProducts(prods);
            setCategories(cats);
        } catch (error: any) {
            console.error(error);
            alert(`Error al cargar datos: ${error.message || 'Revisa la consola'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createProduct({
                name: newProduct.name,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                category_id: Number(newProduct.category_id),
                image_url: newProduct.image_url,
                // description: newProduct.description, // API needs update for description if it supports it? check types.
            });
            alert('Producto creado');
            setIsCreatingProduct(false);
            setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al crear producto');
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('¿Eliminar producto?')) return;
        try {
            await api.deleteProduct(id);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCategory({ name: newCategoryName });
            setNewCategoryName('');
            loadData();
        } catch (error: any) {
            console.error(error);
            alert(`Error al crear categoría: ${error.message || 'Error desconocido'}`);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('¿Eliminar categoría?')) return;
        try {
            await api.deleteCategory(id);
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar categoría (asegúrate que no tenga productos)');
        }
    };

    if (loading) return <div className="p-8 text-center text-orange-600 font-bold uppercase">Cargando panel...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-gray-900 text-white p-6 rounded-t-lg border-b-4 border-orange-600 mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Shield className="text-orange-500" />
                        Panel de Administración
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Gestiona el inventario de Ferretería Industrial</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMainTab('products')}
                        className={`px-4 py-2 font-bold uppercase transition-colors ${mainTab === 'products' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <ProductIcon /> Productos
                    </button>
                    <button
                        onClick={() => setMainTab('categories')}
                        className={`px-4 py-2 font-bold uppercase transition-colors ${mainTab === 'categories' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                    >
                        <Layers className="inline w-4 h-4 mr-2" /> Categorías
                    </button>
                </div>
            </div>

            {mainTab === 'products' && (
                <div className="space-y-6">
                    {/* Create Product Button */}
                    {!isCreatingProduct ? (
                        <button
                            onClick={() => setIsCreatingProduct(true)}
                            className="bg-orange-600 text-white font-bold uppercase px-6 py-3 flex items-center gap-2 hover:bg-orange-700 transition-colors shadow-lg"
                        >
                            <Plus /> Agregar Nuevo Producto
                        </button>
                    ) : (
                        <div className="bg-white border-2 border-orange-200 p-6 shadow-xl relative">
                            <button onClick={() => setIsCreatingProduct(false)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><X /></button>
                            <h3 className="text-xl font-black uppercase text-gray-800 mb-4 border-b pb-2">Nuevo Producto</h3>
                            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Nombre</label>
                                    <input className="w-full p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Precio</label>
                                    <input type="number" step="0.01" className="w-full p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Stock</label>
                                    <input type="number" className="w-full p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Imagen del Producto</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                try {
                                                    const text = e.target.previousElementSibling?.textContent; // Hack to show status if needed, or better use state
                                                    // Simple upload logic inline
                                                    const res = await api.uploadImage(file);
                                                    setNewProduct({ ...newProduct, image_url: res.url });
                                                    alert("Imagen subida correctamente");
                                                } catch (err) {
                                                    console.error(err);
                                                    alert("Error subiendo imagen");
                                                }
                                            }}
                                        />
                                        {newProduct.image_url && (
                                            <div className="w-12 h-12 border border-gray-300 overflow-hidden shrink-0">
                                                <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    <input type="hidden" value={newProduct.image_url} /> {/* Hidden input to store URL */}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Categoría</label>
                                    <select className="w-full p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold" value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })} required>
                                        <option value="">Seleccionar...</option>
                                        {categories.map(c => <option key={c.id_key} value={c.id_key}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full bg-gray-900 text-white font-black uppercase py-3 hover:bg-orange-600 transition-colors">Guardar Producto</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products List */}
                    <div className="grid grid-cols-1 gap-4">
                        {products.map(p => (
                            <div key={p.id_key} className="bg-white border border-gray-200 p-4 flex items-center justify-between hover:border-orange-300 transition-colors shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-300">
                                        {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <Package />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold uppercase text-gray-800">{p.name}</h4>
                                        <div className="text-xs text-gray-500 font-mono">STOCK: {p.stock} | PRECIO: ${p.price}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Edit not implemented fully yet, showing placeholder button */}
                                    {/* <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button> */}
                                    <button onClick={() => handleDeleteProduct(p.id_key)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mainTab === 'categories' && (
                <div className="space-y-6">
                    <div className="bg-white p-6 border-2 border-gray-200 shadow-lg">
                        <h3 className="text-lg font-bold uppercase mb-4">Nueva Categoría</h3>
                        <form onSubmit={handleCreateCategory} className="flex gap-4">
                            <input
                                className="flex-1 p-2 border-2 border-gray-300 bg-gray-50 focus:border-orange-500 outline-none font-bold"
                                placeholder="Nombre de categoría"
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                required
                            />
                            <button type="submit" className="bg-gray-900 text-white font-black uppercase px-6 hover:bg-orange-600 transition-colors">Crear</button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {categories.map(c => (
                            <div key={c.id_key} className="bg-white border border-gray-200 p-4 flex justify-between items-center shadow-sm">
                                <span className="font-bold uppercase text-gray-700">{c.name}</span>
                                <button onClick={() => handleDeleteCategory(c.id_key)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductIcon() {
    return <Package className="inline w-4 h-4 mr-2" />
}
