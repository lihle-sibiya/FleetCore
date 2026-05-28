// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/api';
// import { Zap } from 'lucide-react';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!form.email || !form.password) return setError('Please fill in all fields');
//     setLoading(true); setError('');
//     try {
//       const { data } = await api.post('/auth/login', form);
//       login(data);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
//         {/* Brand */}
//         <div className="flex items-center gap-2 mb-8">
//           <div className="bg-blue-600 p-2 rounded-xl">
//             <Zap size={18} className="text-white" />
//           </div>
//           <div>
//             <div className="font-bold text-gray-900 text-lg leading-none">FleetCore</div>
//             <div className="text-xs text-gray-400">Fleet Management</div>
//           </div>
//         </div>

//         <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h1>
//         <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

//         {error && (
//           <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
//               placeholder="admin@fleetcore.co.za"
//               className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
//                 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
//               placeholder="••••••••"
//               className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
//                 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium
//             hover:bg-blue-700 transition-colors disabled:opacity-50"
//         >
//           {loading ? 'Signing in...' : 'Sign in'}
//         </button>

//         {/* Demo credentials hint */}
//         <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
//           <div className="font-medium text-gray-600 mb-1">Demo credentials</div>
//           <div>Admin: admin@fleetcore.co.za</div>
//           <div>Clerk: clerk@fleetcore.co.za</div>
//           <div className="mt-0.5">Password: <span className="font-mono">Demo1234!</span></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/api';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!form.email || !form.password) return setError('Please fill in all fields');
//     setLoading(true); setError('');
//     try {
//       const { data } = await api.post('/auth/login', form);
//       login(data);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid credentials');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>

//       {/* Left branding panel */}
//       <div style={{
//         flex: '0 0 480px', background: 'linear-gradient(145deg, #0f1117 0%, #131929 60%, #0d1f3c 100%)',
//         display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
//         padding: '48px', borderRight: '1px solid rgba(255,255,255,0.06)',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         {/* Background grid */}
//         <div style={{
//           position: 'absolute', inset: 0, opacity: 0.04,
//           backgroundImage: 'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
//           backgroundSize: '40px 40px',
//         }} />
//         {/* Blue accent glow */}
//         <div style={{
//           position: 'absolute', bottom: '20%', left: '-60px', width: '280px', height: '280px',
//           background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
//           pointerEvents: 'none',
//         }} />

//         <div style={{ position: 'relative' }}>
//           {/* Logo */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
//             <div style={{
//               width: '40px', height: '40px', borderRadius: '10px',
//               background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>
//               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
//                 <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
//                 <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/>
//                 <path d="M5 12V7h10l4 5"/>
//               </svg>
//             </div>
//             <div>
//               <div style={{ color: '#fff', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.3px' }}>FleetCore</div>
//               <div style={{ color: '#4b6cb7', fontSize: '12px', fontWeight: 400 }}>Licensing & Registration CRM</div>
//             </div>
//           </div>

//           <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '16px' }}>
//             Manage licensing.<br />
//             <span style={{ color: '#60a5fa' }}>Without the paperwork.</span>
//           </h1>
//           <p style={{ color: '#6b7fa8', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>
//             Process vehicle registrations, transfers, and invoices — all in one place.
//           </p>
//         </div>

//         {/* Feature list */}
//         <div style={{ position: 'relative' }}>
//           {[
//             { icon: '📋', text: 'Track applications end-to-end' },
//             { icon: '📄', text: 'Generate & send PDF invoices' },
//             { icon: '🏢', text: 'Manage dealerships & private clients' },
//             { icon: '🚗', text: 'Vehicle registration & transfers' },
//           ].map(f => (
//             <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
//               <div style={{
//                 width: '32px', height: '32px', borderRadius: '8px',
//                 background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
//               }}>{f.icon}</div>
//               <span style={{ color: '#8fa4c8', fontSize: '14px' }}>{f.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right login form */}
//       <div style={{
//         flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         padding: '48px', background: '#f4f6fb',
//       }}>
//         <div style={{ width: '100%', maxWidth: '400px' }}>
//           <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#0f1117', marginBottom: '6px', letterSpacing: '-0.4px' }}>
//             Sign in to your account
//           </h2>
//           <p style={{ color: '#7b82a0', fontSize: '14px', marginBottom: '36px' }}>
//             Welcome back. Enter your credentials to continue.
//           </p>

//           {error && (
//             <div style={{
//               background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
//               padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px',
//               display: 'flex', alignItems: 'center', gap: '8px',
//             }}>
//               <span>⚠</span> {error}
//             </div>
//           )}

//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
//               Email address
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
//               placeholder="you@fleetcore.co.za"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               style={{
//                 width: '100%', padding: '11px 14px', fontSize: '14px',
//                 border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
//                 background: '#fff', color: '#0f1117', fontFamily: 'inherit',
//                 transition: 'border-color 0.15s',
//               }}
//               onFocus={e => e.target.style.borderColor = '#3b82f6'}
//               onBlur={e => e.target.style.borderColor = '#d1d9f0'}
//             />
//           </div>

//           <div style={{ marginBottom: '28px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
//               placeholder="••••••••"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               style={{
//                 width: '100%', padding: '11px 14px', fontSize: '14px',
//                 border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
//                 background: '#fff', color: '#0f1117', fontFamily: 'inherit',
//               }}
//               onFocus={e => e.target.style.borderColor = '#3b82f6'}
//               onBlur={e => e.target.style.borderColor = '#d1d9f0'}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#3b82f6',
//               color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
//               fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
//               letterSpacing: '0.1px', transition: 'background 0.15s',
//             }}
//             onMouseEnter={e => { if (!loading) e.target.style.background = '#2563eb'; }}
//             onMouseLeave={e => { if (!loading) e.target.style.background = '#3b82f6'; }}
//           >
//             {loading ? 'Signing in…' : 'Sign in →'}
//           </button>

//           <div style={{
//             marginTop: '28px', padding: '16px', background: '#fff', border: '1px solid #e8eaf2',
//             borderRadius: '10px',
//           }}>
//             <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//               Demo credentials
//             </div>
//             <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.8 }}>
//               <div>Admin: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>admin@fleetcore.co.za</span></div>
//               <div>Clerk: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>clerk@fleetcore.co.za</span></div>
//               <div style={{ marginTop: '4px' }}>Password: <span style={{ fontFamily: "'DM Mono', monospace", background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>Demo1234!</span></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../api/api';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async () => {
//     if (!form.email || !form.password) return setError('Please fill in all fields');
//     setLoading(true); setError('');
//     try {
//       const { data } = await api.post('/auth/login', form);
//       login(data);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid credentials');
//     } finally { setLoading(false); }
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>

//       {/* Left branding panel */}
//       <div style={{
//         flex: '0 0 480px', background: 'linear-gradient(145deg, #0f1117 0%, #131929 60%, #0d1f3c 100%)',
//         display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
//         padding: '48px', borderRight: '1px solid rgba(255,255,255,0.06)',
//         position: 'relative', overflow: 'hidden',
//       }}>
//         {/* Background grid */}
//         <div style={{
//           position: 'absolute', inset: 0, opacity: 0.04,
//           backgroundImage: 'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
//           backgroundSize: '40px 40px',
//         }} />
//         {/* Blue accent glow */}
//         <div style={{
//           position: 'absolute', bottom: '20%', left: '-60px', width: '280px', height: '280px',
//           background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
//           pointerEvents: 'none',
//         }} />

//         <div style={{ position: 'relative' }}>
//           {/* Logo */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
//             <div style={{
//               width: '40px', height: '40px', borderRadius: '10px',
//               background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>
//               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
//                 <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
//                 <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/>
//                 <path d="M5 12V7h10l4 5"/>
//               </svg>
//             </div>
//             <div>
//               <div style={{ color: '#fff', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.3px' }}>FleetCore</div>
//               <div style={{ color: '#4b6cb7', fontSize: '12px', fontWeight: 400 }}>Licensing & Registration CRM</div>
//             </div>
//           </div>

//           <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '16px' }}>
//             Manage licensing.<br />
//             <span style={{ color: '#60a5fa' }}>Without the paperwork.</span>
//           </h1>
//           <p style={{ color: '#6b7fa8', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>
//             Process vehicle registrations, transfers, and invoices — all in one place.
//           </p>
//         </div>

//         {/* Feature list */}
//         <div style={{ position: 'relative' }}>
//           {[
//             { icon: '📋', text: 'Track applications end-to-end' },
//             { icon: '📄', text: 'Generate & send PDF invoices' },
//             { icon: '🏢', text: 'Manage dealerships & private clients' },
//             { icon: '🚗', text: 'Vehicle registration & transfers' },
//           ].map(f => (
//             <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
//               <div style={{
//                 width: '32px', height: '32px', borderRadius: '8px',
//                 background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
//               }}>{f.icon}</div>
//               <span style={{ color: '#8fa4c8', fontSize: '14px' }}>{f.text}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right login form */}
//       <div style={{
//         flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         padding: '48px', background: '#f4f6fb',
//       }}>
//         <div style={{ width: '100%', maxWidth: '400px' }}>
//           <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#0f1117', marginBottom: '6px', letterSpacing: '-0.4px' }}>
//             Sign in to your account
//           </h2>
//           <p style={{ color: '#7b82a0', fontSize: '14px', marginBottom: '36px' }}>
//             Welcome back. Enter your credentials to continue.
//           </p>

//           {error && (
//             <div style={{
//               background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
//               padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px',
//               display: 'flex', alignItems: 'center', gap: '8px',
//             }}>
//               <span>⚠</span> {error}
//             </div>
//           )}

//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
//               Email address
//             </label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
//               placeholder="you@fleetcore.co.za"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               style={{
//                 width: '100%', padding: '11px 14px', fontSize: '14px',
//                 border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
//                 background: '#fff', color: '#0f1117', fontFamily: 'inherit',
//                 transition: 'border-color 0.15s',
//               }}
//               onFocus={e => e.target.style.borderColor = '#3b82f6'}
//               onBlur={e => e.target.style.borderColor = '#d1d9f0'}
//             />
//           </div>

//           <div style={{ marginBottom: '28px' }}>
//             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
//               placeholder="••••••••"
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               style={{
//                 width: '100%', padding: '11px 14px', fontSize: '14px',
//                 border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
//                 background: '#fff', color: '#0f1117', fontFamily: 'inherit',
//               }}
//               onFocus={e => e.target.style.borderColor = '#3b82f6'}
//               onBlur={e => e.target.style.borderColor = '#d1d9f0'}
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#3b82f6',
//               color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
//               fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
//               letterSpacing: '0.1px', transition: 'background 0.15s',
//             }}
//             onMouseEnter={e => { if (!loading) e.target.style.background = '#2563eb'; }}
//             onMouseLeave={e => { if (!loading) e.target.style.background = '#3b82f6'; }}
//           >
//             {loading ? 'Signing in…' : 'Sign in →'}
//           </button>

//           <div style={{
//             marginTop: '28px', padding: '16px', background: '#fff', border: '1px solid #e8eaf2',
//             borderRadius: '10px',
//           }}>
//             <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
//               Demo credentials
//             </div>
//             <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.8 }}>
//               <div>Admin: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>admin@fleetcore.co.za</span></div>
//               <div>Clerk: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>clerk@fleetcore.co.za</span></div>
//               <div style={{ marginTop: '4px' }}>Password: <span style={{ fontFamily: "'DM Mono', monospace", background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>Demo1234!</span></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.email || !form.password) return setError('Please enter email and password');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', fontSize:14, border:'1.5px solid #d1d5db', borderRadius:9, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* Left panel */}
      <div style={{ flex:'0 0 480px', background:'linear-gradient(160deg,#0d1117 0%,#111827 50%,#0c1a2e 100%)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:48, position:'relative', overflow:'hidden' }}>
        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)', backgroundSize:'44px 44px' }} />
        {/* Glow */}
        <div style={{ position:'absolute', bottom:'15%', left:-80, width:300, height:300, background:'radial-gradient(circle,rgba(59,130,246,0.2) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:56 }}>
            <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🚗</div>
            <div>
              <div style={{ color:'#f1f5f9', fontWeight:700, fontSize:18, letterSpacing:'-0.3px' }}>FleetCore</div>
              <div style={{ color:'#334e7a', fontSize:12 }}>Licensing & Registration CRM</div>
            </div>
          </div>

          <h1 style={{ color:'#f1f5f9', fontSize:34, fontWeight:700, lineHeight:1.15, letterSpacing:'-0.5px', marginBottom:16 }}>
            Manage licensing.<br/>
            <span style={{ color:'#60a5fa' }}>Without the paperwork.</span>
          </h1>
          <p style={{ color:'#4b6585', fontSize:15, lineHeight:1.7, maxWidth:320 }}>
            Process vehicle registrations, ownership transfers, and invoices — all in one place.
          </p>
        </div>

        <div style={{ position:'relative' }}>
          {[
            ['📋','Track applications end-to-end'],
            ['📄','Generate & send PDF invoices with VAT'],
            ['🏢','Manage dealerships & private clients'],
            ['🚗','Vehicle registration & ownership transfers'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:13 }}>
              <div style={{ width:34, height:34, borderRadius:8, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{icon}</div>
              <span style={{ color:'#7a90aa', fontSize:13.5 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48, background:'#f0f2f8' }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <h2 style={{ fontSize:26, fontWeight:700, color:'#111827', marginBottom:6, letterSpacing:'-0.4px' }}>Sign in</h2>
          <p style={{ color:'#6b7280', fontSize:14, marginBottom:32 }}>Welcome back. Enter your credentials to continue.</p>

          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:9, padding:'11px 14px', marginBottom:20, color:'#b91c1c', fontSize:13.5, display:'flex', gap:8, alignItems:'center' }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#374151', marginBottom:6 }}>Email address</label>
            <input {...{type:'email', value:form.email, placeholder:'admin@fleetcore.co.za', style:inp,
              onChange:e => setForm(f=>({...f,email:e.target.value})),
              onKeyDown:e => e.key==='Enter' && submit(),
              onFocus:e => e.target.style.borderColor='#3b82f6',
              onBlur:e => e.target.style.borderColor='#d1d5db',
            }} />
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#374151', marginBottom:6 }}>Password</label>
            <input {...{type:'password', value:form.password, placeholder:'••••••••', style:inp,
              onChange:e => setForm(f=>({...f,password:e.target.value})),
              onKeyDown:e => e.key==='Enter' && submit(),
              onFocus:e => e.target.style.borderColor='#3b82f6',
              onBlur:e => e.target.style.borderColor='#d1d5db',
            }} />
          </div>

          <button onClick={submit} disabled={loading} style={{
            width:'100%', padding:'12px', background: loading?'#93c5fd':'#3b82f6', color:'#fff',
            border:'none', borderRadius:9, fontSize:14, fontWeight:600, cursor: loading?'not-allowed':'pointer',
            fontFamily:'inherit', letterSpacing:'0.1px', transition:'background 0.15s',
          }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.background='#2563eb'; }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.background='#3b82f6'; }}
          >{loading ? 'Signing in…' : 'Sign in →'}</button>

          <div style={{ marginTop:28, padding:16, background:'#fff', border:'1px solid #e5e7eb', borderRadius:11 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#374151', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Demo credentials</div>
            <div style={{ fontSize:13, color:'#6b7280', lineHeight:2 }}>
              <div>Admin: <span style={{ color:'#3b82f6', fontFamily:'monospace' }}>admin@fleetcore.co.za</span></div>
              <div>Clerk: <span style={{ color:'#3b82f6', fontFamily:'monospace' }}>clerk@fleetcore.co.za</span></div>
              <div style={{ marginTop:4 }}>Password: <span style={{ fontFamily:'monospace', background:'#f3f4f6', padding:'1px 7px', borderRadius:4 }}>Demo1234!</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
