import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="card-glass p-10 shadow-2xl shadow-primary-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-3xl mb-6 shadow-inner transform -rotate-6">
            <LogIn className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-4xl font-black text-center text-light-text dark:text-dark-text tracking-tight">Welcome Back</h2>
          <p className="text-light-subtext dark:text-gray-400 mt-2 font-bold">Sign in to continue your journey</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="email"
                required
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300 shadow-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Secure Password</label>
            <div className="relative group">
              <Key className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="password"
                required
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20 active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
          </button>
        </form>

        <p className="mt-10 text-center text-light-subtext dark:text-gray-400 text-sm font-bold border-t border-gray-100 dark:border-gray-800 pt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 dark:text-primary-500 font-black hover:text-primary-700 transition-colors ml-1">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
