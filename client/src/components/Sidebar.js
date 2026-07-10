import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiPlusCircle, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', to: '/', icon: FiGrid },
  { label: 'All Entries', to: '/entries', icon: FiList },
  { label: 'Add New Entry', to: '/add', icon: FiPlusCircle },
  { label: 'Settings', to: '/settings', icon: FiSettings },
  { label: 'Profile', to: '/profile', icon: FiUser },
];

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="hidden xl:flex xl:w-72 xl:flex-col xl:rounded-3xl xl:bg-slate-950 xl:px-5 xl:py-8 xl:text-slate-100 xl:shadow-2xl xl:shadow-slate-900/10">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">SD</div>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Secure Data Vault</p>
          <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/20' : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={onLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
