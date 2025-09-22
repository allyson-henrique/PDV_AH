import React, { useState } from 'react';
import { ChefHat, User, Lock, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../../types';

interface LoginViewProps {
  onLogin: (profile: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock users for demonstration
  const mockUsers: UserProfile[] = [
    {
      id: '1',
      name: 'Administrador',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'João Silva',
      username: 'joao',
      password: '123456',
      role: 'cashier',
      permissions: ['tables', 'menu', 'cart', 'orders']
    },
    {
      id: '3',
      name: 'Maria Santos',
      username: 'maria',
      password: '123456',
      role: 'waiter',
      permissions: ['tables', 'menu', 'cart']
    },
    {
      id: '4',
      name: 'Carlos Cozinha',
      username: 'carlos',
      password: '123456',
      role: 'kitchen',
      permissions: ['kitchen', 'orders']
    },
    {
      id: '5',
      name: 'Ana Gerente',
      username: 'ana',
      password: '123456',
      role: 'manager',
      permissions: ['tables', 'menu', 'cart', 'kitchen', 'orders', 'reports']
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Usuário ou senha incorretos');
    }
    
    setIsLoading(false);
  };

  const quickLogin = (user: UserProfile) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      admin: 'Administrador',
      cashier: 'Operador de Caixa',
      waiter: 'Garçom',
      kitchen: 'Cozinha',
      manager: 'Gerente'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      admin: 'bg-red-100 text-red-800',
      cashier: 'bg-blue-100 text-blue-800',
      waiter: 'bg-green-100 text-green-800',
      kitchen: 'bg-yellow-100 text-yellow-800',
      manager: 'bg-purple-100 text-purple-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="bg-orange-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Allyson Henrique</h1>
          <p className="text-gray-600 mt-2">Sistema de Vendas</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                }
              `}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Quick Login Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido (Demo)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockUsers.map(user => (
              <button
                key={user.id}
                onClick={() => quickLogin(user)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">@{user.username}</div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};