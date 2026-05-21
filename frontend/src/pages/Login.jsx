import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>

      {/* Left branding panel */}
      <div style={{
        flex: '0 0 480px', background: 'linear-gradient(145deg, #0f1117 0%, #131929 60%, #0d1f3c 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Blue accent glow */}
        <div style={{
          position: 'absolute', bottom: '20%', left: '-60px', width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/>
                <path d="M5 12V7h10l4 5"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.3px' }}>FleetCore</div>
              <div style={{ color: '#4b6cb7', fontSize: '12px', fontWeight: 400 }}>Licensing & Registration CRM</div>
            </div>
          </div>

          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '16px' }}>
            Manage licensing.<br />
            <span style={{ color: '#60a5fa' }}>Without the paperwork.</span>
          </h1>
          <p style={{ color: '#6b7fa8', fontSize: '15px', lineHeight: 1.7, maxWidth: '320px' }}>
            Process vehicle registrations, transfers, and invoices — all in one place.
          </p>
        </div>

        {/* Feature list */}
        <div style={{ position: 'relative' }}>
          {[
            { icon: '📋', text: 'Track applications end-to-end' },
            { icon: '📄', text: 'Generate & send PDF invoices' },
            { icon: '🏢', text: 'Manage dealerships & private clients' },
            { icon: '🚗', text: 'Vehicle registration & transfers' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0,
              }}>{f.icon}</div>
              <span style={{ color: '#8fa4c8', fontSize: '14px' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px', background: '#f4f6fb',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 600, color: '#0f1117', marginBottom: '6px', letterSpacing: '-0.4px' }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#7b82a0', fontSize: '14px', marginBottom: '36px' }}>
            Welcome back. Enter your credentials to continue.
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '20px', color: '#b91c1c', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Email address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@fleetcore.co.za"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '11px 14px', fontSize: '14px',
                border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
                background: '#fff', color: '#0f1117', fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#d1d9f0'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%', padding: '11px 14px', fontSize: '14px',
                border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
                background: '#fff', color: '#0f1117', fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#d1d9f0'}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', background: loading ? '#93c5fd' : '#3b82f6',
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              letterSpacing: '0.1px', transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = '#2563eb'; }}
            onMouseLeave={e => { if (!loading) e.target.style.background = '#3b82f6'; }}
          >
            {loading ? 'Signing in…' : 'Sign in →'}
          </button>

          <div style={{
            marginTop: '28px', padding: '16px', background: '#fff', border: '1px solid #e8eaf2',
            borderRadius: '10px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Demo credentials
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.8 }}>
              <div>Admin: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>admin@fleetcore.co.za</span></div>
              <div>Clerk: <span style={{ color: '#3b82f6', fontFamily: "'DM Mono', monospace" }}>clerk@fleetcore.co.za</span></div>
              <div style={{ marginTop: '4px' }}>Password: <span style={{ fontFamily: "'DM Mono', monospace", background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>Demo1234!</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}