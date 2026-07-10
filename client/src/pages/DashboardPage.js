import { useEffect, useState } from 'react';
import { FiPlus, FiSettings, FiUser } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import TopStats from '../components/TopStats';
import Toast from '../components/Toast';
import api from '../services/api';
import { removeToken } from '../services/authService';

const DashboardPage = () => {
  const [stats, setStats] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/entries');
      setStats(response.data.stats);
    } catch (error) {
      setToast({ message: 'Unable to load dashboard data', type: 'error' });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 space-y-6">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-blue-600">Welcome back, Administrator</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-950">Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700">
                  <FiPlus className="h-4 w-4" /> Add Entry
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <FiSettings className="h-4 w-4" /> Settings
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <FiUser className="h-4 w-4" /> Profile
                </button>
              </div>
            </div>
            <TopStats stats={stats} />
          </div>

          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Recent Entries</h2>
                <p className="mt-1 text-sm text-slate-500">Monitor your latest saved accounts and credentials.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">View All Entries</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Name</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Email</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Password</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Phone</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Nationality</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">URLs</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Backup Code</th>
                    <th className="whitespace-nowrap px-4 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-4">John Doe</td>
                    <td className="whitespace-nowrap px-4 py-4">john.doe@example.com</td>
                    <td className="whitespace-nowrap px-4 py-4">********</td>
                    <td className="whitespace-nowrap px-4 py-4">+1 202-555-0183</td>
                    <td className="whitespace-nowrap px-4 py-4">United States</td>
                    <td className="whitespace-nowrap px-4 py-4">View URLs</td>
                    <td className="whitespace-nowrap px-4 py-4">AB12-CD34-EF56</td>
                    <td className="whitespace-nowrap px-4 py-4 space-x-2">
                      <button className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200">View</button>
                      <button className="rounded-2xl bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700">Edit</button>
                      <button className="rounded-2xl bg-rose-500 px-3 py-2 text-white transition hover:bg-rose-600">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default DashboardPage;
