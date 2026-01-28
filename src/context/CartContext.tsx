import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.product.id_key === product.id_key);
            if (existing) {
                return prev.map(item =>
                    item.product.id_key === product.id_key
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(prev => prev.filter(item => item.product.id_key !== productId));
    };

    const clearCart = () => setItems([]);

    const updateQuantity = (productId: number, quantity: number) => {
        setItems(prev => prev.map(item => {
            if (item.product.id_key === productId) {
                return { ...item, quantity: Math.max(0, quantity) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
