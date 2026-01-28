import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Product, Category, Client } from '../components/types';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  deleteCategory,
  getClients,
} from '../components/api';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  Tags,
  Shield,
  X,
  Save,
  LogOut,
  Users,
} from 'lucide-react';
import { Toaster, toast } from "sonner";

export function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState<Omit<Product, 'id_key' | 'image'>>({
    name: '',
    category_id: 0,
    brand: '',
    price: 0,
    stock: 0,
    image_url: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prods, cats, clis] = await Promise.all([getProducts(), getCategories(), getClients()]);
      setProducts(prods);
      setCategories(cats);
      setClients(clis);
    } catch (error) {
      toast.error('Error al cargar los datos');
    }
  };

  // ... (rest of the functions are the same)

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* ... Header ... */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Products Section */}
            {/* ... Products JSX ... */}
             <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-xl">
                    Clientes ({clients.length})
                  </h2>
                </div>
              </div>
              <div className="space-y-2">
                {clients.map(client => (
                  <div
                    key={client.id_key}
                    className="flex items-center justify-between p-3 bg-gray-900/50 border-purple-500/20 rounded-lg"
                  >
                    <div>
                      <p className="text-white">{client.name} {client.lastname}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      client.is_admin
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {client.is_admin ? 'Admin' : 'Usuario'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            {/* ... Categories JSX ... */}
          </div>
        </div>
      </div>
    </div>
  );
}