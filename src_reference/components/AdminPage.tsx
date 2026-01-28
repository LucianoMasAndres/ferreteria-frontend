import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, createCategory, deleteCategory, getClients } from './api';
import type { Product, Category, Client } from './types';
import { toast } from 'sonner';

export function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Main tab state
    const [mainTab, setMainTab] = useState('products');

    // Sub-tab states
    const [productTab, setProductTab] = useState('manage');
    const [categoryTab, setCategoryTab] = useState('manage');

    // Data states
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [users, setUsers] = useState<Client[]>([]);

    // Loading states
    const [productsLoading, setProductsLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);

    // Modal state
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Form state for creating a product
    const [createProductForm, setCreateProductForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: ''
    });

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        loadAllData();
    }, [user, navigate]);

    const loadAllData = async () => {
        loadProducts();
        loadCategories();
        loadUsers();
    };

    const loadProducts = async () => {
        setProductsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            toast.error('Error al cargar los productos');
        } finally {
            setProductsLoading(false);
        }
    };

    const loadCategories = async () => {
        setCategoriesLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Error al cargar las categorías');
        } finally {
            setCategoriesLoading(false);
        }
    };

    const loadUsers = async () => {
        setUsersLoading(true);
        try {
            const data = await getClients();
            setUsers(data);
        } catch (error) {
            toast.error('Error al cargar los usuarios');
        } finally {
            setUsersLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, description, price, stock, category_id } = createProductForm;

        if (!name || !description || !price || !stock || !category_id) {
            toast.error('Por favor, completa todos los campos.');
            return;
        }
        
        const productData = { 
            name, 
            description, 
            price: parseFloat(price), 
            stock: parseInt(stock), 
            category_id: parseInt(category_id),
            brand: 'Default Brand',
            image_url: 'https://via.placeholder.com/150'
        };

        try {
            await createProduct(productData);
            toast.success('Producto creado exitosamente.');
            setCreateProductForm({ name: '', description: '', price: '', stock: '', category_id: '' });
            loadProducts();
            setProductTab('manage');
        } catch (error) {
            toast.error('Error al crear el producto.');
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                await deleteProduct(productId);
                toast.success('Producto eliminado exitosamente.');
                loadProducts();
            } catch (error) {
                toast.error('Error al eliminar el producto.');
            }
        }
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const productData = {
            name: formData.get('modifyProductName') as string,
            description: formData.get('modifyProductDescription') as string,
            price: parseFloat(formData.get('modifyProductPrice') as string),
            stock: parseInt(formData.get('modifyProductStock') as string),
            category_id: parseInt(formData.get('modifyProductCategory') as string),
        };

        try {
            await updateProduct(selectedProduct.id_key, productData);
            toast.success('Producto actualizado exitosamente.');
            setShowModifyModal(false);
            loadProducts();
        } catch (error) {
            toast.error('Error al actualizar el producto.');
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const categoryName = (form.elements.namedItem('categoryName') as HTMLInputElement).value;
        
        if (!categoryName) {
            toast.error('Por favor, ingresa un nombre para la categoría.');
            return;
        }

        try {
            await createCategory({ name: categoryName });
            toast.success('Categoría creada exitosamente.');
            form.reset();
            loadCategories();
            setCategoryTab('manage');
        } catch (error) {
            toast.error('Error al crear la categoría.');
        }
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
            try {
                await deleteCategory(categoryId);
                toast.success('Categoría eliminada exitosamente.');
                loadCategories();
            } catch (error) {
                toast.error('Error al eliminar la categoría. Asegúrate de que no haya productos asociados a ella.');
            }
        }
    };
    
    if (!user || !user.isAdmin) {
        return null;
    }

    return (
        <div className="admin-container text-white">
            <div className="admin-header">
                <h1>🛠️ Panel de Administración</h1>
                <p>Gestiona productos, categorías y usuarios de la tienda.</p>
            </div>

            <div className="tabs">
                <button className={`tab-link ${mainTab === 'products' ? 'active' : ''}`} onClick={() => setMainTab('products')}>Productos</button>
                <button className={`tab-link ${mainTab === 'categories' ? 'active' : ''}`} onClick={() => setMainTab('categories')}>Categorías</button>
                <button className={`tab-link ${mainTab === 'users' ? 'active' : ''}`} onClick={() => setMainTab('users')}>Usuarios</button>
            </div>

            {mainTab === 'products' && (
                <section id="product-management" className="admin-section">
                    <h2>Gestión de Productos</h2>
                    <div className="tabs">
                        <button className={`tab-link ${productTab === 'create' ? 'active' : ''}`} onClick={() => setProductTab('create')}>Crear Nuevo</button>
                        <button className={`tab-link ${productTab === 'manage' ? 'active' : ''}`} onClick={() => setProductTab('manage')}>Gestionar Existentes</button>
                    </div>
                    <div id="product-create" className={`tab-content ${productTab === 'create' ? 'active' : ''}`}>
                        <div className="admin-card">
                            <h3>Crear Nuevo Producto</h3>
                            <form className="form" onSubmit={handleCreateProduct}>
                                <div className="form-group">
                                    <label htmlFor="productName">Nombre</label>
                                    <input type="text" value={createProductForm.name} onChange={e => setCreateProductForm({...createProductForm, name: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea rows={3} value={createProductForm.description} onChange={e => setCreateProductForm({...createProductForm, description: e.target.value})} required></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Precio</label>
                                    <input type="number" step="0.01" value={createProductForm.price} onChange={e => setCreateProductForm({...createProductForm, price: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" value={createProductForm.stock} onChange={e => setCreateProductForm({...createProductForm, stock: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select value={createProductForm.category_id} onChange={e => setCreateProductForm({...createProductForm, category_id: e.target.value})} required>
                                        <option value="">Selecciona una categoría...</option>
                                        {categories.map(cat => <option key={cat.id_key} value={cat.id_key}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="btn-primary">Crear Producto</button>
                            </form>
                        </div>
                    </div>
                    <div id="product-manage" className={`tab-content ${productTab === 'manage' ? 'active' : ''}`}>
                         <div className="admin-card">
                            <h3>Listado de Productos</h3>
                            {productsLoading ? <div className="loading">Cargando...</div> : (
                                <table className="table">
                                    <thead><tr><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id_key}>
                                                <td>{p.name}</td>
                                                <td>${p.price.toFixed(2)}</td>
                                                <td>{p.stock}</td>
                                                <td>
                                                    <button className="btn-secondary btn-sm" onClick={() => { setSelectedProduct(p); setShowModifyModal(true); }}>Modificar</button>
                                                    <button className="btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id_key)}>Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {mainTab === 'categories' && (
                <section id="category-management" className="admin-section">
                    <h2>Gestión de Categorías</h2>
                    <div className="tabs">
                        <button className={`tab-link ${categoryTab === 'create' ? 'active' : ''}`} onClick={() => setCategoryTab('create')}>Crear Nueva</button>
                        <button className={`tab-link ${categoryTab === 'manage' ? 'active' : ''}`} onClick={() => setCategoryTab('manage')}>Gestionar Existentes</button>
                    </div>
                     <div id="category-create" className={`tab-content ${categoryTab === 'create' ? 'active' : ''}`}>
                        <div className="admin-card">
                            <h3>Crear Nueva Categoría</h3>
                            <form className="form" onSubmit={handleCreateCategory}>
                                <div className="form-group">
                                    <label htmlFor="categoryName">Nombre</label>
                                    <input type="text" id="categoryName" name="categoryName" required />
                                </div>
                                <button type="submit" className="btn-primary">Crear Categoría</button>
                            </form>
                        </div>
                    </div>
                    <div id="category-manage" className={`tab-content ${categoryTab === 'manage' ? 'active' : ''}`}>
                        <div className="admin-card">
                            <h3>Listado de Categorías</h3>
                            {categoriesLoading ? <div className="loading">Cargando...</div> : (
                                <table className="table">
                                    <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
                                    <tbody>
                                        {categories.map(c => (
                                            <tr key={c.id_key}>
                                                <td>{c.name}</td>
                                                <td><button className="btn-danger btn-sm" onClick={() => handleDeleteCategory(c.id_key)}>Eliminar</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {mainTab === 'users' && (
                <section id="user-management" className="admin-section">
                    <h2>Gestión de Usuarios</h2>
                    <div className="admin-card">
                        <h3>Listado de Usuarios</h3>
                        {usersLoading ? <div className="loading">Cargando...</div> : (
                            <table className="table">
                                <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id_key}>
                                            <td>{u.id_key}</td>
                                            <td>{u.name} {u.lastname}</td>
                                            <td>{u.email}</td>
                                            <td>{u.is_admin ? 'Admin' : 'Usuario'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            )}
            
            {showModifyModal && selectedProduct && (
                 <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <span className="close-btn" onClick={() => setShowModifyModal(false)}>&times;</span>
                        <h2>Modificar Producto</h2>
                        <form className="form" onSubmit={handleUpdateProduct}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input type="text" name="modifyProductName" defaultValue={selectedProduct.name} required />
                            </div>
                             <div className="form-group">
                                <label>Descripción</label>
                                <textarea name="modifyProductDescription" rows={3} defaultValue={selectedProduct.description} required></textarea>
                            </div>
                            <div className="form-group">
                                <label>Precio</label>
                                <input type="number" name="modifyProductPrice" step="0.01" defaultValue={selectedProduct.price} required />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input type="number" name="modifyProductStock" defaultValue={selectedProduct.stock} required />
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select name="modifyProductCategory" defaultValue={selectedProduct.category_id} required>
                                    {categories.map(cat => <option key={cat.id_key} value={cat.id_key}>{cat.name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
