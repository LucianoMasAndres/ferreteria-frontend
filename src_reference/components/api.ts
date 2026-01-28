const API_BASE_URL = 'https://final-cortez.onrender.com';

import type { Product, Order, OrderDetail, Category, Client, Address, Review, Bill } from './types';

export interface OrderCreate {
    total: number;
    delivery_method: string;
    client_id: number;
    status: number;
    bill_id: number;
    date: string; // Added
}

export interface OrderDetailCreate {
    quantity: number;
    order_id: number;
    product_id: number;
    price: number;
}

export interface AddressCreate {
    street: string;
    number: string;
    city: string;
    client_id: number;
}

export interface ReviewCreate {
    rating: number;
    comment: string;
    product_id: number;
}

export interface BillCreate {
    bill_number: string;
    date: string;
    total: number;
    payment_type: string;
    client_id: number;
}

export interface ClientCreate {
    name: string;
    lastname: string;
    email: string;
    password: string;
}


export interface ProductFilter {
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    in_stock_only?: boolean;
    sort_by?: string;
}

export const getProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const searchProducts = async (filter: ProductFilter): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filter.search) {
        params.append('search', filter.search);
    }
    if (filter.category_id) {
        params.append('category_id', filter.category_id.toString());
    }
    if (filter.min_price) {
        params.append('min_price', filter.min_price.toString());
    }
    if (filter.max_price) {
        params.append('max_price', filter.max_price.toString());
    }
    if (filter.in_stock_only) {
        params.append('in_stock_only', 'true');
    }
    if (filter.sort_by) {
        params.append('sort_by', filter.sort_by);
    }

    const response = await fetch(`${API_BASE_URL}/products/filter?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to search products');
    }
    return response.json();
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/id/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch product with id ${id}`);
    }
    return response.json();
};

export const createProduct = async (product: Omit<Product, 'id_key' | 'image'>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error('Failed to create product');
    }
    return response.json();
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error('Failed to update product');
    }
    return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/id/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete product');
    }
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export const createCategory = async (category: { name: string }): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        throw new Error('Failed to create category');
    }
    return response.json();
};

export const updateCategory = async (id: number, category: { name: string }): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
    });
    if (!response.ok) {
        throw new Error('Failed to update category');
    }
    return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories/id/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
};

export const getOrdersByClientId = async (clientId: number): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders/`);
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    const orders = await response.json();
    return orders.filter((order: Order) => order.client_id === clientId);
};

export const getOrderDetails = async (orderId: number): Promise<OrderDetail[]> => {
    const response = await fetch(`${API_BASE_URL}/order_details/`);
    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }
    const details = await response.json();
    return details.filter((detail: OrderDetail) => detail.order_id === orderId);
};


export const createOrder = async (order: OrderCreate): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create order');
    }
    return response.json();
};

export const createOrderDetail = async (orderDetail: OrderDetailCreate): Promise<OrderDetail> => {
    const response = await fetch(`${API_BASE_URL}/order_details/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetail),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create order detail');
    }
    return response.json();
};

export const getClients = async (): Promise<Client[]> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/clients/`);
    if (!response.ok) {
        throw new Error('Failed to fetch clients');
    }
    return response.json();
};

export const getProfile = async (id: number): Promise<Client | undefined> => {
    const clients = await getClients();
    return clients.find(client => (client.id ?? client.id_key) === id);
};


export const createClient = async (client: ClientCreate): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/clients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
    });
    if (!response.ok) {
        throw new Error('Failed to create client');
    }
    return response.json();
};

export const getAddressesByClientId = async (clientId: number): Promise<Address[]> => {
    const response = await fetch(`${API_BASE_URL}/addresses/`);
    if (!response.ok) {
        throw new Error('Failed to fetch addresses');
    }
    const addresses = await response.json();
    return addresses.filter((address: Address) => address.client_id === clientId);
};

export const createAddress = async (address: AddressCreate): Promise<Address> => {
    const response = await fetch(`${API_BASE_URL}/addresses/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
    });
    if (!response.ok) {
        throw new Error('Failed to create address');
    }
    return response.json();
};

export const updateAddress = async (id: number, address: Partial<AddressCreate>): Promise<Address> => {
    const response = await fetch(`${API_BASE_URL}/addresses/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
    });
    if (!response.ok) {
        throw new Error('Failed to update address');
    }
    return response.json();
};

export const deleteAddress = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/addresses/id/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete address');
    }
};

export const getReviewsByProductId = async (productId: number): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch reviews');
    }
    return response.json();
};

export const createReview = async (review: ReviewCreate): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });
    if (!response.ok) {
        throw new Error('Failed to create review');
    }
    return response.json();
};

export const updateReview = async (id: number, review: Partial<ReviewCreate>): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });
    if (!response.ok) {
        throw new Error('Failed to update review');
    }
    return response.json();
};

export const deleteReview = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/reviews/id/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete review');
    }
};

export const getBillsByClientId = async (clientId: number): Promise<Bill[]> => {
    const response = await fetch(`${API_BASE_URL}/bills/`);
    if (!response.ok) {
        throw new Error('Failed to fetch bills');
    }
    const bills = await response.json();
    return bills.filter((bill: Bill) => bill.client_id === clientId);
};

export const createBill = async (bill: BillCreate): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill),
    });
    if (!response.ok) {
        throw new Error('Failed to create bill');
    }
    return response.json();
};

export const updateBill = async (id: number, bill: Partial<BillCreate>): Promise<Bill> => {
    const response = await fetch(`${API_BASE_URL}/bills/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill),
    });
    if (!response.ok) {
        throw new Error('Failed to update bill');
    }
    return response.json();
};

export const deleteBill = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bills/id/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete bill');
    }
};

export const login = async (email: string, password: string): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/api/v1/clients/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Invalid credentials' }));
        throw new Error(errorData.detail);
    }

    return response.json();
};
