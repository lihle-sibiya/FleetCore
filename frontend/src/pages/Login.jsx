import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Zap } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('Please fill in all fields');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg leading-none">FleetCore</div>
            <div className="text-xs text-gray-400">Fleet Management</div>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@fleetcore.co.za"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
            hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Demo credentials hint */}
        <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
          <div className="font-medium text-gray-600 mb-1">Demo credentials</div>
          <div>Admin: admin@fleetcore.co.za</div>
          <div>Clerk: clerk@fleetcore.co.za</div>
          <div className="mt-0.5">Password: <span className="font-mono">Demo1234!</span></div>
        </div>
      </div>
    </div>
  );
}
