import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Briefcase, Mail, Key } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4 pb-20">
      <div className="card-glass p-10 shadow-2xl shadow-teal-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="p-5 bg-teal-50 dark:bg-teal-900/30 rounded-3xl mb-6 shadow-inner transform rotate-6">
            <UserPlus className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
          <h2 className="text-4xl font-black text-center text-light-text dark:text-dark-text tracking-tight">Join Us</h2>
          <p className="text-light-subtext dark:text-gray-400 mt-2 font-bold text-center">Start your journey towards a dream career</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 px-5 py-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Full Name</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="text"
                name="name"
                required
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-teal-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300 shadow-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="email"
                name="email"
                required
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-teal-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300 shadow-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-3 text-light-subtext dark:text-gray-400">Master Password</label>
            <div className="relative group">
              <Key className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="password"
                name="password"
                required
                className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-dark-bg focus:border-teal-500 dark:focus:border-teal-500 outline-none transition-all font-bold text-light-text dark:text-dark-text placeholder:text-gray-300 shadow-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] mb-4 text-light-subtext dark:text-gray-400">Account Type</label>
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  formData.role === 'student' 
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/5' 
                  : 'border-gray-100 dark:border-gray-800 text-light-subtext hover:border-primary-200 shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  className="hidden"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                <div className={`w-3 h-3 rounded-full mb-2 ${formData.role === 'student' ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                <span className={`font-black text-xs uppercase tracking-widest ${formData.role === 'student' ? 'text-primary-700' : ''}`}>Student</span>
              </label>
              <label 
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  formData.role === 'coach' 
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 shadow-lg shadow-teal-500/5' 
                  : 'border-gray-100 dark:border-gray-800 text-light-subtext hover:border-teal-200 shadow-sm'
                }`}
              >
                <input
                  type="radio"
              name="role"
                  value="coach"
                  className="hidden"
                  checked={formData.role === 'coach'}
                  onChange={handleChange}
                />
                <div className={`w-3 h-3 rounded-full mb-2 ${formData.role === 'coach' ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
                <span className={`font-black text-xs uppercase tracking-widest ${formData.role === 'coach' ? 'text-teal-700' : ''}`}>Coach</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 active:scale-[0.98] mt-4"
          >
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-10 text-center text-light-subtext dark:text-gray-400 text-sm font-bold border-t border-gray-100 dark:border-gray-800 pt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-500 font-black hover:text-primary-700 transition-colors ml-1">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
