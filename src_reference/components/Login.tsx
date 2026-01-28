import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, UserPlus, User } from 'lucide-react';
import { toast } from "sonner";
import { createClient } from './api';

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerLastname, setRegisterLastname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const { login, user } = useAuth(); // Destructure user from useAuth
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = await login(loginEmail, loginPassword);
    if (loggedInUser) {
      toast.success('¡Inicio de sesión exitoso!');
      if (loggedInUser.isAdmin) { // Check the isAdmin flag from the user object returned by login
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      toast.error('Email o contraseña incorrectos');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient({
        name: registerName,
        lastname: registerLastname,
        email: registerEmail,
        password: registerPassword,
      });
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setIsRegistering(false);
    } catch (error) {
      toast.error('Error en el registro. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
          <div className="flex justify-center mb-8">
            <div className="flex rounded-lg bg-gray-900/50 p-1 border border-cyan-500/30">
              <button
                onClick={() => setIsRegistering(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!isRegistering ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isRegistering ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Registrarse
              </button>
            </div>
          </div>

          {isRegistering ? (
            // Registration Form
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-purple-500/50">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-3xl">
                  Crear Cuenta
                </h1>
                <p className="text-gray-400">Únete a la comunidad de TechGamer</p>
              </div>
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-cyan-400 mb-2">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Nombre"
                        className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400" required />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-cyan-400 mb-2">Apellido</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={registerLastname} onChange={(e) => setRegisterLastname(e.target.value)} placeholder="Apellido"
                        className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400" required />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-cyan-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder="tu@email.com"
                      className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-400" required />
                  </div>
                </div>
                <div>
                  <label className="block text-purple-400 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-400" required />
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Registrarse
                </button>
              </form>
            </div>
          ) : (
            // Login Form
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4 shadow-lg shadow-purple-500/50">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-3xl">
                  Iniciar Sesión
                </h1>
                <p className="text-gray-400">Accede a tu cuenta de TechGamer</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-cyan-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="tu@email.com"
                      className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg pl-10 pr-4 py-3 text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-purple-400 mb-2">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg pl-10 pr-4 py-3 text-white" required />
                  </div>
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
