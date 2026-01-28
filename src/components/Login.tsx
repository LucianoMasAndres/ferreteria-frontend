import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, UserPlus, User, AlertTriangle } from 'lucide-react';
// import { toast } from "sonner"; // We can add sonner later if installed, or use basic alert for now
import { api } from '../api';

export function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerName, setRegisterName] = useState('');
    const [registerLastname, setRegisterLastname] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');

    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const loggedInUser = await login(loginEmail, loginPassword);
        if (loggedInUser) {
            navigate('/');
        } else {
            setError('Email o contraseña incorrectos');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.createClient({
                name: registerName,
                lastname: registerLastname,
                email: registerEmail,
                password: registerPassword,
                telephone: registerPhone
            });
            setIsRegistering(false);
            // Automatically switch to login view
            setLoginEmail(registerEmail);
            setLoginPassword('');
            alert('¡Registro exitoso! Por favor inicia sesión.');
        } catch (err) {
            setError('Error en el registro. Verifica los datos.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white border-4 border-orange-600 p-8 shadow-2xl relative">
                    {/* Industrial 'Screw' decorations */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-gray-300 border-2 border-gray-600 rounded-full flex items-center justify-center"><div className="w-3 h-0.5 bg-gray-600 rotate-45"></div></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-300 border-2 border-gray-600 rounded-full flex items-center justify-center"><div className="w-3 h-0.5 bg-gray-600 rotate-45"></div></div>
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gray-300 border-2 border-gray-600 rounded-full flex items-center justify-center"><div className="w-3 h-0.5 bg-gray-600 rotate-45"></div></div>
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-300 border-2 border-gray-600 rounded-full flex items-center justify-center"><div className="w-3 h-0.5 bg-gray-600 rotate-45"></div></div>

                    <div className="flex justify-center mb-8">
                        <div className="flex bg-gray-200 p-1 border-2 border-gray-300">
                            <button
                                onClick={() => setIsRegistering(false)}
                                className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-colors ${!isRegistering ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Ingresar
                            </button>
                            <button
                                onClick={() => setIsRegistering(true)}
                                className={`px-4 py-2 text-sm font-black uppercase tracking-widest transition-colors ${isRegistering ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-100 border-l-4 border-red-600 p-4 flex items-center gap-3">
                            <AlertTriangle className="text-red-600 w-5 h-5" />
                            <p className="text-red-800 font-bold text-sm uppercase">{error}</p>
                        </div>
                    )}

                    {isRegistering ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Nombre</label>
                                    <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Apellido</label>
                                    <input type="text" value={registerLastname} onChange={(e) => setRegisterLastname(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 pl-10 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Teléfono</label>
                                <input type="text" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-gray-300 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 pl-10 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 text-white font-black uppercase py-4 hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Crear Cuenta
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 pl-10 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold uppercase text-xs mb-2">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-300 pl-10 p-3 focus:outline-none focus:border-orange-500 font-bold" required />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-orange-600 text-white font-black uppercase py-4 hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl translate-y-0 active:translate-y-1">
                                <LogIn className="w-5 h-5" />
                                Acceder
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
