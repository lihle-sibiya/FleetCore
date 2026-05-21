// ─── Page shell ──────────────────────────────────────────────────────────────
export const PageShell = ({ children }) => (
  <div style={{ padding: '28px 32px', maxWidth: '1280px', width: '100%' }}>
    {children}
  </div>
);

// ─── Page header ─────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action, breadcrumb }) => (
  <div style={{ marginBottom: '24px' }}>
    {breadcrumb && <div style={{ fontSize: '12px', color: '#9ba3bf', marginBottom: '6px', fontWeight: 400 }}>{breadcrumb}</div>}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#0f1117', margin: 0, letterSpacing: '-0.4px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '13.5px', color: '#7b82a0', margin: '3px 0 0' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, icon, color = 'blue', trend }) => {
  const palette = {
    blue:   { bg: '#eff6ff', iconBg: '#dbeafe', iconColor: '#2563eb', text: '#1d4ed8' },
    green:  { bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#16a34a', text: '#15803d' },
    amber:  { bg: '#fffbeb', iconBg: '#fef3c7', iconColor: '#d97706', text: '#b45309' },
    red:    { bg: '#fef2f2', iconBg: '#fee2e2', iconColor: '#dc2626', text: '#b91c1c' },
    purple: { bg: '#faf5ff', iconBg: '#ede9fe', iconColor: '#7c3aed', text: '#6d28d9' },
  };
  const p = palette[color] || palette.blue;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8eaf2', borderRadius: '12px',
      padding: '20px', boxShadow: '0 1px 3px rgba(15,17,23,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{label}</span>
        {icon && (
          <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: p.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.iconColor }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 600, color: '#0f1117', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: '#9ba3bf', marginTop: '6px' }}>{sub}</div>}
      {trend && <div style={{ fontSize: '12px', color: trend > 0 ? '#16a34a' : '#dc2626', marginTop: '6px', fontWeight: 500 }}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
      </div>}
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', border: '1px solid #e8eaf2', borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(15,17,23,0.05)', ...style,
  }}>
    {children}
  </div>
);

// ─── Card header ──────────────────────────────────────────────────────────────
export const CardHeader = ({ title, action }) => (
  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f2f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f1117' }}>{title}</span>
    {action}
  </div>
);

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ headers, children, empty }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
      <thead>
        <tr style={{ background: '#f8f9fc' }}>
          {headers.map(h => (
            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11.5px', fontWeight: 600, color: '#7b82a0', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e8eaf2', whiteSpace: 'nowrap' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    {empty}
  </div>
);

export const TR = ({ children, onClick }) => (
  <tr
    onClick={onClick}
    style={{ borderBottom: '1px solid #f0f2f8', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.background = '#f8f9fc'; }}
    onMouseLeave={e => { e.currentTarget.style.background = ''; }}
  >
    {children}
  </tr>
);

export const TD = ({ children, mono, muted, style = {} }) => (
  <td style={{
    padding: '12px 16px', color: muted ? '#7b82a0' : '#1a1d2e',
    fontFamily: mono ? "'DM Mono', monospace" : 'inherit', fontSize: mono ? '12.5px' : '13.5px',
    ...style,
  }}>
    {children}
  </td>
);

// ─── Buttons ──────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button' }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
    fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', border: 'none',
    transition: 'all 0.12s', outline: 'none', whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: '12px', borderRadius: '6px' },
    md: { padding: '8px 16px', fontSize: '13.5px', borderRadius: '8px' },
    lg: { padding: '11px 22px', fontSize: '14.5px', borderRadius: '9px' },
  };
  const variants = {
    primary:   { background: '#3b82f6', color: '#fff' },
    secondary: { background: '#f1f3f9', color: '#374151', border: '1px solid #e2e6f3' },
    danger:    { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
    ghost:     { background: 'transparent', color: '#6b7280' },
    success:   { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], opacity: disabled ? 0.5 : 1 }}
      onMouseEnter={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = '#2563eb'; }}
      onMouseLeave={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = '#3b82f6'; }}
    >
      {children}
    </button>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = 'gray' }) => {
  const styles = {
    blue:   { background: '#dbeafe', color: '#1e40af' },
    green:  { background: '#dcfce7', color: '#166534' },
    amber:  { background: '#fef3c7', color: '#92400e' },
    red:    { background: '#fee2e2', color: '#991b1b' },
    purple: { background: '#ede9fe', color: '#5b21b6' },
    gray:   { background: '#f1f3f9', color: '#4b5563' },
    indigo: { background: '#e0e7ff', color: '#3730a3' },
    teal:   { background: '#ccfbf1', color: '#0f766e' },
  };
  const s = styles[color] || styles.gray;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: '99px', fontSize: '11.5px', fontWeight: 500,
      ...s,
    }}>
      {label}
    </span>
  );
};

// ─── Status helpers ───────────────────────────────────────────────────────────
export const AppStatusBadge = ({ status }) => {
  const map = {
    pending:                { label: 'Pending',    color: 'amber' },
    documents_received:     { label: 'Docs in',    color: 'blue' },
    submitted_to_licensing: { label: 'Submitted',  color: 'indigo' },
    completed:              { label: 'Completed',  color: 'green' },
    cancelled:              { label: 'Cancelled',  color: 'gray' },
  };
  const b = map[status] || { label: status, color: 'gray' };
  return <Badge label={b.label} color={b.color} />;
};

export const InvoiceStatusBadge = ({ status }) => {
  const map = {
    draft:     { label: 'Draft',     color: 'gray' },
    sent:      { label: 'Sent',      color: 'blue' },
    paid:      { label: 'Paid',      color: 'green' },
    overdue:   { label: 'Overdue',   color: 'red' },
    cancelled: { label: 'Cancelled', color: 'gray' },
  };
  const b = map[status] || { label: status, color: 'gray' };
  return <Badge label={b.label} color={b.color} />;
};

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, width = '520px', children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,17,23,0.55)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '14px', width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(15,17,23,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #f0f2f8',
        }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f1117' }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9ba3bf', padding: '4px', borderRadius: '6px',
            display: 'flex', alignItems: 'center',
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Form components ──────────────────────────────────────────────────────────
export const FormRow = ({ children, cols = 1 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', marginBottom: '16px' }}>
    {children}
  </div>
);

export const Field = ({ label, required, children, hint }) => (
  <div>
    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#374151', marginBottom: '5px' }}>
      {label}{required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#9ba3bf' }}>{hint}</p>}
  </div>
);

const inputStyle = {
  width: '100%', padding: '9px 12px', fontSize: '13.5px',
  border: '1px solid #d1d9f0', borderRadius: '8px', outline: 'none',
  background: '#fff', color: '#0f1117', fontFamily: 'inherit',
  boxSizing: 'border-box', transition: 'border-color 0.12s',
};

export const Input = ({ className, ...props }) => (
  <input style={inputStyle} {...props}
    onFocus={e => e.target.style.borderColor = '#3b82f6'}
    onBlur={e => e.target.style.borderColor = '#d1d9f0'}
  />
);

export const Select = ({ children, ...props }) => (
  <select style={{ ...inputStyle, background: '#fff' }} {...props}
    onFocus={e => e.target.style.borderColor = '#3b82f6'}
    onBlur={e => e.target.style.borderColor = '#d1d9f0'}
  >
    {children}
  </select>
);

export const Textarea = ({ ...props }) => (
  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} {...props}
    onFocus={e => e.target.style.borderColor = '#3b82f6'}
    onBlur={e => e.target.style.borderColor = '#d1d9f0'}
  />
);

// ─── Search bar ───────────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ba3bf" strokeWidth="2"
      style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}>
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
    <input
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{
        padding: '8px 12px 8px 32px', fontSize: '13.5px', border: '1px solid #d1d9f0',
        borderRadius: '8px', background: '#fff', color: '#0f1117', outline: 'none',
        fontFamily: 'inherit', width: '260px', transition: 'border-color 0.12s',
      }}
      onFocus={e => e.target.style.borderColor = '#3b82f6'}
      onBlur={e => e.target.style.borderColor = '#d1d9f0'}
    />
  </div>
);

// ─── Tab bar ──────────────────────────────────────────────────────────────────
export const TabBar = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', gap: '2px', background: '#f1f3f9', padding: '4px',
    borderRadius: '9px', width: 'fit-content', marginBottom: '20px',
  }}>
    {tabs.map(t => (
      <button key={t.value} onClick={() => onChange(t.value)} style={{
        padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer',
        fontSize: '13px', fontWeight: active === t.value ? 500 : 400, fontFamily: 'inherit',
        background: active === t.value ? '#fff' : 'transparent',
        color: active === t.value ? '#0f1117' : '#7b82a0',
        boxShadow: active === t.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.12s',
      }}>
        {t.label}{t.count !== undefined && (
          <span style={{
            marginLeft: '6px', background: active === t.value ? '#dbeafe' : '#e8eaf2',
            color: active === t.value ? '#1d4ed8' : '#7b82a0',
            padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 500,
          }}>{t.count}</span>
        )}
      </button>
    ))}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, body, action }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    {icon && <div style={{ fontSize: '36px', marginBottom: '12px' }}>{icon}</div>}
    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', margin: '0 0 6px' }}>{title}</h3>
    {body && <p style={{ fontSize: '13.5px', color: '#7b82a0', margin: '0 0 20px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>{body}</p>}
    {action}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ text = 'Loading…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #dbeafe',
      borderTopColor: '#3b82f6', animation: 'spin 0.7s linear infinite', marginBottom: '12px',
    }} />
    <span style={{ fontSize: '13.5px', color: '#9ba3bf' }}>{text}</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── Alert ────────────────────────────────────────────────────────────────────
export const Alert = ({ type = 'error', message }) => {
  if (!message) return null;
  const s = {
    error:   { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', icon: '⚠' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534', icon: '✓' },
    info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', icon: 'ℹ' },
  }[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: '8px',
      padding: '10px 14px', marginBottom: '16px', color: s.color,
      fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <span>{s.icon}</span> {message}
    </div>
  );
};

export const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;