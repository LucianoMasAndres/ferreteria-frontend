import { Product, ProductCreate, Category, Order, OrderCreate, Client, Bill, Review, BillCreate, OrderDetailCreate, OrderDetail } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ferreteria-backend-o1lt.onrender.com';

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options?.headers,
        };

        if (options?.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API Error: ${response.statusText}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.request<{ url: string }>('/uploads/upload/image', {
            method: 'POST',
            body: formData,
        });
    }

    // Products
    async getProducts(skip = 0, limit = 100): Promise<Product[]> {
        return this.request<Product[]>(`/products/?skip=${skip}&limit=${limit}`);
    }

    async getProduct(id: number): Promise<Product> {
        return this.request<Product>(`/products/${id}`);
    }

    async createProduct(product: ProductCreate): Promise<Product> {
        return this.request<Product>('/products/', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    }

    async updateProduct(id: number, product: Partial<ProductCreate>): Promise<Product> {
        return this.request<Product>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
    }

    async deleteProduct(id: number): Promise<void> {
        return this.request<void>(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Categories
    async getCategories(skip = 0, limit = 100): Promise<Category[]> {
        return this.request<Category[]>(`/categories/?skip=${skip}&limit=${limit}`);
    }

    async createCategory(category: { name: string }): Promise<Category> {
        return this.request<Category>('/categories/', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    }

    async deleteCategory(id: number): Promise<void> {
        return this.request<void>(`/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // Clients
    async getClients(skip = 0, limit = 100): Promise<Client[]> {
        return this.request<Client[]>(`/clients/?skip=${skip}&limit=${limit}`);
    }

    async createClient(client: Client): Promise<Client> {
        return this.request<Client>('/clients/', {
            method: 'POST',
            body: JSON.stringify(client),
        });
    }

    // Orders
    // Orders
    async createOrder(order: OrderCreate): Promise<Order> {
        return this.request<Order>('/orders/', {
            method: 'POST',
            body: JSON.stringify(order)
        });
    }

    async getOrdersByClient(clientId: number): Promise<Order[]> {
        return this.request<Order[]>(`/orders/client/${clientId}`);
    }

    async createOrderDetail(detail: OrderDetailCreate): Promise<OrderDetail> {
        return this.request<OrderDetail>('/order_details/', {
            method: 'POST',
            body: JSON.stringify(detail)
        });
    }

    // Bills
    async createBill(bill: BillCreate): Promise<Bill> {
        return this.request<Bill>('/bills/', {
            method: 'POST',
            body: JSON.stringify(bill)
        });
    }

    // Health Check
    async healthCheck(): Promise<any> {
        return this.request('/health_check/');
    }

    // Auth
    async login(email: string, password: string): Promise<Client> {
        return this.request<Client>('/clients/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
}

export const api = new ApiService();
