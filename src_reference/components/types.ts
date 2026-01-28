
export interface Product {
  id_key: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  brand: string;
  image_url: string;
}

export interface Category {
    id_key: number;
    name: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetail {
    id_key: number;
    quantity: number;
    price: number;
    order_id: number;
    product_id: number;
    product: Product;
}

export interface Order {
    id_key: number;
    date: string;
    total: number;
    delivery_method: string;
    status: string;
    client_id: number;
    order_details: OrderDetail[];
}

export interface Client {
    id: number;
    id_key: number;
    name: string;
    lastname: string;
    email: string;
    telephone: string | null;
    is_admin: boolean;
}

export interface Address {
    id_key: number;
    street: string;
    number: string;
    city: string;
    client_id: number;
}

export interface Review {
    id_key: number;
    rating: number;
    comment: string;
    product_id: number;
}

export interface Bill {
    id_key: number;
    bill_number: string;
    date: string;
    total: number;
    payment_type: string;
    client_id: number;
}
