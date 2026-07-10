import Sidebar from '../components/Sidebar';
import { removeToken } from '../services/authService';

const SettingsPage = () => {
  const handleLogout = () => {
    removeToken();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6">
      <div className="mx-auto flex w-full max-w-[1600px] gap-6">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h1 className="text-3xl font-semibold text-slate-950">Settings</h1>
          <p className="mt-3 text-slate-500">This page is reserved for future dashboard preferences.</p>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
