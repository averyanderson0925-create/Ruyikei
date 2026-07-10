import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import api from '../services/api';
import { saveToken } from '../services/authService';
import Toast from '../components/Toast';

const LoginPage = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      saveToken(response.data.token);
      onAuth();
      navigate('/');
      setToast({ message: 'Login successful', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden bg-[#0b1b42] px-8 py-10 text-white sm:px-12 sm:py-14">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.28em] text-sky-300">Admin Login</p>
              <h1 className="text-5xl font-semibold leading-tight text-white">Secure Data Vault</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                Store & manage your important information securely with an admin-only dashboard built for modern credential storage.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-[0_40px_120px_-70px_rgba(10,25,83,0.6)] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white">
                  <FiShield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Secure Access</p>
                  <p className="text-lg font-semibold text-white">Only administrators can login.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-10 sm:px-12 sm:py-14">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-950">Admin Login</h2>
            <p className="mt-2 text-slate-500">Only administrator can access this system.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span className="text-slate-600">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter admin email"
                required
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span className="text-slate-600">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-900"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );

};

export default LoginPage;
