import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api';
import { Client } from '../types';

export interface User {
    id: number;
    email: string;
    name: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User | null>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<User | null> => {
        try {
            const response: Client = await api.login(email, password);

            if (response && response.id_key) {
                const id = response.id_key;
                const userData: User = {
                    id: id,
                    email: response.email || '',
                    name: response.name || 'Usuario',
                    isAdmin: email === 'admin@ferreteria.com', // Simple logic for now
                };

                setUser(userData);
                localStorage.setItem('currentUser', JSON.stringify(userData));
                return userData;
            }
            return null;
        } catch (error) {
            console.error('Login failed:', error);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
