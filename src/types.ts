export interface Category {
    id_key?: number;
    name: string;
    products?: Product[];
}

export interface Product {
    id_key: number;
    name: string;
    price: number;
    stock: number;
    category_id: number;
    image_url?: string;
    category?: Category;
    reviews?: Review[];
    order_details?: OrderDetail[];
}

export interface Client {
    id_key?: number;
    name?: string;
    lastname?: string;
    email?: string;
    password?: string;
    telephone?: string;
    addresses?: Address[];
    orders?: Order[];
}

export interface ClientCreate {
    name: string;
    lastname: string;
    email: string;
    password: string;
    telephone?: string;
}

export interface Address {
    id_key?: number;
    street?: string;
    number?: string;
    city?: string;
    client_id: number;
}

export interface Order {
    id_key?: number;
    date?: string;
    total: number;
    delivery_method: number; // enum 1,2,3
    status?: number; // enum 1,2,3,4
    client_id: number;
    bill_id: number;
}

export interface OrderDetail {
    id_key?: number;
    quantity: number;
    price?: number;
    order_id: number;
    product_id: number;
    order?: Order;
    product?: Product;
}

export interface Bill {
    id_key?: number;
    bill_number: string;
    discount?: number;
    date: string;
    total: number;
    payment_type: number; // enum 1-5
    client_id: number;
    order?: Order;
    client?: Client;
}

export interface Review {
    id_key?: number;
    rating: number; // 1-5
    comment?: string;
    product_id: number;
    product?: Product;
}

// Input Types for Creation
export interface ProductCreate {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    category_id: number;
    image_url?: string;
}

export interface OrderCreate {
    total: number;
    delivery_method: number;
    client_id: number;
    bill_id: number;
    status?: number;
}

export interface OrderDetailCreate {
    quantity: number;
    order_id: number;
    product_id: number;
    price?: number;
}

export interface BillCreate {
    client_id: number;
    total: number;
    bill_number: string;
    date: string;
    payment_type: number;
    discount?: number;
}
