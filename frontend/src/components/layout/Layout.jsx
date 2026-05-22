// import { NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import {
//   LayoutDashboard, Building2, Truck, FileText, Users, LogOut, Zap
// } from 'lucide-react';

// // const NAV = [
// //   { to: '/',           label: 'Dashboard',  icon: LayoutDashboard },
// //   { to: '/companies',  label: 'Companies',  icon: Building2 },
// //   { to: '/vehicles',   label: 'Vehicles',   icon: Truck },
// //   { to: '/invoices',   label: 'Invoices',   icon: FileText },
// //   { to: '/drivers',    label: 'Drivers',    icon: Users },
// // ];

// const NAV = [
//   { to: '/',           label: 'Dashboard',    icon: LayoutDashboard },
//   { to: '/applications', label: 'Applications', icon: FileText }, 
//   { to: '/dealerships',  label: 'Dealerships',  icon: Building2 }, 
//   { to: '/customers',    label: 'Customers',    icon: Users },      
//   { to: '/vehicles',     label: 'Vehicles',     icon: Truck },
//   { to: '/invoices',     label: 'Invoices',     icon: Zap },
// ];

// export default function Layout({ children }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => { logout(); navigate('/login'); };

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       {/* Sidebar */}
//       <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
//         {/* Brand */}
//         <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
//           <div className="bg-blue-600 p-1.5 rounded-lg">
//             <Zap size={14} className="text-white" />
//           </div>
//           <span className="font-bold text-gray-900 text-base">FleetCore</span>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 space-y-0.5">
//           {NAV.map(({ to, label, icon: Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={to === '/'}
//               className={({ isActive }) =>
//                 `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
//                   isActive
//                     ? 'bg-blue-50 text-blue-700 font-medium'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`
//               }
//             >
//               <Icon size={16} />
//               {label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* User + logout */}
//         <div className="px-4 py-4 border-t border-gray-100">
//           <div className="text-xs text-gray-500 mb-0.5">{user?.name}</div>
//           <div className="text-xs text-gray-400 capitalize mb-3">{user?.role}</div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 transition-colors"
//           >
//             <LogOut size={13} /> Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="p-6 max-w-6xl mx-auto">{children}</div>
//       </main>
//     </div>
//   );
// }


import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Dashboard', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { to: '/applications', label: 'Applications', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
    </svg>
  )},
  { to: '/invoices', label: 'Invoices', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <path d="M14 2v6h6M12 18v-6M9 15h6"/>
    </svg>
  )},
  { to: '/vehicles', label: 'Vehicles', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
      <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/>
      <path d="M5 12V7h10l4 5"/>
    </svg>
  )},
  { to: '/customers', label: 'Customers', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
  { to: '/dealerships', label: 'Dealerships', icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18M3 7v14M21 7v14M6 21V11M18 21V11"/>
      <path d="M3 7l9-4 9 4M6 11h4M14 11h4M6 15h4M14 15h4"/>
    </svg>
  )},
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'FC';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--page-bg)' }}>

      {/* Dark sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0, background: 'var(--sidebar-bg)',
        display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--sidebar-border)',
      }}>

        {/* Brand */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/>
                <path d="M5 12V7h10l4 5"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.2px' }}>FleetCore</div>
              <div style={{ color: '#3b5a8a', fontSize: '10.5px' }}>Licensing CRM</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#3d4460', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 8px', marginBottom: '6px' }}>Main</div>
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '7px', marginBottom: '2px',
                textDecoration: 'none', fontSize: '13.5px', fontWeight: isActive ? 500 : 400,
                color: isActive ? '#93c5fd' : 'var(--sidebar-text)',
                background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                transition: 'all 0.12s',
              })}
              onMouseEnter={e => { if (!e.currentTarget.className.includes('active')) e.currentTarget.style.color = '#c5cde8'; }}
              onMouseLeave={e => { e.currentTarget.style.color = ''; }}
            >
              <span style={{ opacity: 0.8, flexShrink: 0 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--sidebar-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: 600, flexShrink: 0,
            }}>{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#c8cfe6', fontSize: '12.5px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ color: '#4a5578', fontSize: '11px', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              width: '100%', padding: '6px 10px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px',
              color: '#5a6180', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a6180'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}