import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, Truck, FileText, Users, LogOut, Zap
} from 'lucide-react';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/companies',  label: 'Companies',  icon: Building2 },
  { to: '/vehicles',   label: 'Vehicles',   icon: Truck },
  { to: '/invoices',   label: 'Invoices',   icon: FileText },
  { to: '/drivers',    label: 'Drivers',    icon: Users },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base">FleetCore</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-0.5">{user?.name}</div>
          <div className="text-xs text-gray-400 capitalize mb-3">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
