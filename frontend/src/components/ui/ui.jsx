// // Shared UI primitives — used across all pages

// export const StatusBadge = ({ status }) => {
//   const styles = {
//     paid:    'bg-green-100 text-green-800',
//     issued:  'bg-yellow-100 text-yellow-800',
//     overdue: 'bg-red-100 text-red-800',
//     draft:   'bg-gray-100 text-gray-600',
//   };
//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
//       {status}
//     </span>
//   );
// };

// export const StatCard = ({ label, value, sub, icon: Icon, color = 'blue' }) => {
//   const colors = {
//     blue:   'bg-blue-50 text-blue-600',
//     green:  'bg-green-50 text-green-600',
//     yellow: 'bg-yellow-50 text-yellow-600',
//     red:    'bg-red-50 text-red-600',
//   };
//   return (
//     <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//       <div className="flex items-center justify-between mb-3">
//         <span className="text-sm text-gray-500">{label}</span>
//         {Icon && (
//           <span className={`p-2 rounded-lg ${colors[color]}`}>
//             <Icon size={16} />
//           </span>
//         )}
//       </div>
//       <div className="text-2xl font-bold text-gray-900">{value}</div>
//       {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
//     </div>
//   );
// };

// export const PageHeader = ({ title, subtitle, action }) => (
//   <div className="flex items-start justify-between mb-6">
//     <div>
//       <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
//       {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
//     </div>
//     {action}
//   </div>
// );

// export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
//   <input
//     type="text"
//     value={value}
//     onChange={(e) => onChange(e.target.value)}
//     placeholder={placeholder}
//     className="w-full sm:w-72 px-3 py-2 text-sm border border-gray-200 rounded-lg
//                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//   />
// );

// export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button', className = '' }) => {
//   const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
//   const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
//   const variants = {
//     primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
//     secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-400',
//     danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
//     ghost:     'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
//   };
//   return (
//     <button type={type} onClick={onClick} disabled={disabled}
//       className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
//       {children}
//     </button>
//   );
// };

// export const LoadingSpinner = ({ text = 'Loading...' }) => (
//   <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//     <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3" />
//     <span className="text-sm">{text}</span>
//   </div>
// );

// export const EmptyState = ({ icon: Icon, title, body, action }) => (
//   <div className="flex flex-col items-center justify-center py-16 text-center">
//     {Icon && <Icon size={36} className="text-gray-300 mb-3" />}
//     <h3 className="text-sm font-medium text-gray-700">{title}</h3>
//     {body && <p className="text-sm text-gray-400 mt-1 max-w-xs">{body}</p>}
//     {action && <div className="mt-4">{action}</div>}
//   </div>
// );

// export const Modal = ({ open, onClose, title, children }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/40" onClick={onClose} />
//       <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-5 border-b border-gray-100">
//           <h2 className="text-base font-semibold text-gray-900">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
//         </div>
//         <div className="p-5">{children}</div>
//       </div>
//     </div>
//   );
// };

// export const FormField = ({ label, error, children }) => (
//   <div className="mb-4">
//     {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
//     {children}
//     {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//   </div>
// );

// export const Input = ({ className = '', ...props }) => (
//   <input
//     className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
//       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
//     {...props}
//   />
// );

// export const Select = ({ children, className = '', ...props }) => (
//   <select
//     className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white
//       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
//     {...props}
//   >
//     {children}
//   </select>
// );

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  blue: '#3b82f6', blueDark: '#1d4ed8', blueLight: '#eff6ff', blueBorder: '#bfdbfe',
  green: '#10b981', greenLight: '#ecfdf5', greenBorder: '#a7f3d0',
  amber: '#f59e0b', amberLight: '#fffbeb', amberBorder: '#fde68a',
  red: '#ef4444', redLight: '#fef2f2', redBorder: '#fecaca',
  purple: '#8b5cf6', purpleLight: '#f5f3ff', purpleBorder: '#ddd6fe',
  indigo: '#6366f1', indigoLight: '#eef2ff', indigoBorder: '#c7d2fe',
  gray: '#6b7280', grayLight: '#f9fafb', grayBorder: '#e5e7eb',
  text: '#111827', textSub: '#6b7280', textMuted: '#9ca3af',
  card: '#ffffff', cardBorder: '#e5e7eb',
  shadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
};

// ─── Layout shell ─────────────────────────────────────────────────────────────
export const Shell = ({ children }) => (
  <div style={{ padding: '28px 32px', maxWidth: '1300px', margin: '0 auto' }}>{children}</div>
);

// ─── Page header ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action, crumb }) => (
  <div style={{ marginBottom: '24px' }}>
    {crumb && <p style={{ fontSize: '12px', color: C.textMuted, marginBottom: '6px' }}>{crumb}</p>}
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: C.text, letterSpacing: '-0.4px', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '13.5px', color: C.textSub, marginTop: '4px' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', boxShadow: C.shadow, ...style }}>{children}</div>
);

export const CardHead = ({ title, sub, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.cardBorder}` }}>
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px', color: C.text }}>{title}</div>
      {sub && <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>{sub}</div>}
    </div>
    {action}
  </div>
);

// ─── Stat card ────────────────────────────────────────────────────────────────
export const Stat = ({ label, value, sub, color = 'blue', icon }) => {
  const map = { blue: [C.blueLight, C.blue], green: [C.greenLight, C.green], amber: [C.amberLight, C.amber], red: [C.redLight, C.red], purple: [C.purpleLight, C.purple] };
  const [bg, fg] = map[color] || map.blue;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: '12px', padding: '20px', boxShadow: C.shadow }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: C.textSub }}>{label}</span>
        {icon && <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fg, fontSize: '17px' }}>{icon}</div>}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: C.text, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: C.textMuted, marginTop: '6px' }}>{sub}</div>}
    </div>
  );
};

// ─── Table ────────────────────────────────────────────────────────────────────
export const Table = ({ heads, children }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${C.cardBorder}`, background: '#f8fafc' }}>
          {heads.map(h => (
            <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Tr = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ borderBottom: `1px solid #f1f5f9`, cursor: onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.background = '#f8fafc'; }}
    onMouseLeave={e => { e.currentTarget.style.background = ''; }}>
    {children}
  </tr>
);

export const Td = ({ children, mono, muted, bold, style: s = {} }) => (
  <td style={{ padding: '12px 16px', color: muted ? C.textSub : C.text, fontWeight: bold ? 600 : 400, fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit', fontSize: mono ? '12.5px' : '13.5px', ...s }}>{children}</td>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = 'gray' }) => {
  const map = {
    blue: { bg: C.blueLight, fg: C.blueDark }, green: { bg: C.greenLight, fg: '#065f46' },
    amber: { bg: C.amberLight, fg: '#92400e' }, red: { bg: C.redLight, fg: '#991b1b' },
    purple: { bg: C.purpleLight, fg: '#5b21b6' }, indigo: { bg: C.indigoLight, fg: '#3730a3' },
    gray: { bg: '#f3f4f6', fg: '#374151' }, teal: { bg: '#f0fdfa', fg: '#0f766e' },
  };
  const { bg, fg } = map[color] || map.gray;
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '99px', fontSize: '11.5px', fontWeight: 500, background: bg, color: fg, whiteSpace: 'nowrap' }}>{label}</span>;
};

export const AppBadge = ({ status }) => {
  const m = { pending: ['Pending', 'amber'], documents_received: ['Docs In', 'blue'], submitted_to_licensing: ['Submitted', 'indigo'], completed: ['Completed', 'green'], cancelled: ['Cancelled', 'gray'] };
  const [l, c] = m[status] || [status, 'gray'];
  return <Badge label={l} color={c} />;
};

export const InvBadge = ({ status }) => {
  const m = { draft: ['Draft', 'gray'], sent: ['Sent', 'blue'], paid: ['Paid', 'green'], overdue: ['Overdue', 'red'], cancelled: ['Cancelled', 'gray'] };
  const [l, c] = m[status] || [status, 'gray'];
  return <Badge label={l} color={c} />;
};

// ─── Buttons ──────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = 'primary', size = 'md', disabled, type = 'button' }) => {
  const sizes = { sm: { padding: '5px 12px', fontSize: '12px', borderRadius: '7px' }, md: { padding: '9px 18px', fontSize: '13.5px', borderRadius: '8px' }, lg: { padding: '11px 24px', fontSize: '14.5px', borderRadius: '9px' } };
  const variants = {
    primary: { background: C.blue, color: '#fff', border: 'none' },
    secondary: { background: '#fff', color: '#374151', border: `1px solid #d1d5db` },
    danger: { background: C.redLight, color: '#991b1b', border: `1px solid ${C.redBorder}` },
    success: { background: C.greenLight, color: '#065f46', border: `1px solid ${C.greenBorder}` },
    ghost: { background: 'transparent', color: C.textSub, border: 'none' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...sizes[size], ...variants[variant], display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
      transition: 'all 0.12s', outline: 'none', whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = C.blueDark; }}
      onMouseLeave={e => { if (!disabled && variant === 'primary') e.currentTarget.style.background = C.blue; }}
    >{children}</button>
  );
};

// ─── Search ───────────────────────────────────────────────────────────────────
export const Search = ({ value, onChange, placeholder = 'Search…' }) => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
    <span style={{ position: 'absolute', left: '10px', color: C.textMuted, fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13.5px', border: `1px solid #d1d5db`, borderRadius: '8px', background: '#fff', color: C.text, outline: 'none', width: '260px', transition: 'border-color 0.12s' }}
      onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
  </div>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', gap: '2px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '20px' }}>
    {tabs.map(t => (
      <button key={t.value} onClick={() => onChange(t.value)} style={{
        padding: '6px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: '13px', fontWeight: active === t.value ? 500 : 400,
        background: active === t.value ? '#fff' : 'transparent',
        color: active === t.value ? C.text : C.textSub,
        boxShadow: active === t.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.12s',
      }}>
        {t.label}
        {t.count !== undefined && (
          <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '99px', fontSize: '11px', fontWeight: 500, background: active === t.value ? C.blueLight : '#e2e8f0', color: active === t.value ? C.blueDark : C.textSub }}>{t.count}</span>
        )}
      </button>
    ))}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, width = '520px', children }) => {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${C.cardBorder}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: C.text, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: C.textMuted, lineHeight: 1, padding: '2px 6px', borderRadius: '4px' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Form components ──────────────────────────────────────────────────────────
const inputBase = { width: '100%', padding: '9px 12px', fontSize: '13.5px', border: `1px solid #d1d5db`, borderRadius: '8px', outline: 'none', background: '#fff', color: C.text, boxSizing: 'border-box', transition: 'border-color 0.12s', fontFamily: 'inherit' };
const focusStyle = e => e.target.style.borderColor = C.blue;
const blurStyle  = e => e.target.style.borderColor = '#d1d5db';

export const Field = ({ label, required, hint, children }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 500, color: '#374151', marginBottom: '5px' }}>{label}{required && <span style={{ color: C.red, marginLeft: '3px' }}>*</span>}</label>}
    {children}
    {hint && <p style={{ fontSize: '11.5px', color: C.textMuted, marginTop: '4px' }}>{hint}</p>}
  </div>
);

export const Row = ({ cols = 1, children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', marginBottom: '16px' }}>{children}</div>
);

export const Input = ({ style: s = {}, ...p }) => <input style={{ ...inputBase, ...s }} {...p} onFocus={focusStyle} onBlur={blurStyle} />;
export const Sel   = ({ children, ...p })      => <select style={{ ...inputBase, background: '#fff' }} {...p} onFocus={focusStyle} onBlur={blurStyle}>{children}</select>;
export const Textarea = ({ ...p })             => <textarea style={{ ...inputBase, resize: 'vertical', minHeight: '72px' }} {...p} onFocus={focusStyle} onBlur={blurStyle} />;

// ─── Toggle pills ─────────────────────────────────────────────────────────────
export const Toggle = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
    {options.map(o => (
      <button key={o.value} onClick={() => onChange(o.value)} style={{
        padding: '7px 16px', borderRadius: '8px', border: `1px solid ${value === o.value ? C.blue : '#d1d5db'}`,
        background: value === o.value ? C.blueLight : '#fff', color: value === o.value ? C.blueDark : C.textSub,
        fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s',
      }}>{o.label}</button>
    ))}
  </div>
);

// ─── Empty + Spinner ──────────────────────────────────────────────────────────
export const Empty = ({ icon = '📭', title, body, action }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{title}</h3>
    {body && <p style={{ fontSize: '13.5px', color: C.textSub, maxWidth: '320px', margin: '0 auto 20px' }}>{body}</p>}
    {action}
  </div>
);

export const Spinner = ({ text = 'Loading…' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
    <div style={{ width: '32px', height: '32px', border: `3px solid ${C.blueLight}`, borderTopColor: C.blue, borderRadius: '50%', animation: 'fc-spin 0.7s linear infinite', marginBottom: '12px' }} />
    <span style={{ fontSize: '13.5px', color: C.textMuted }}>{text}</span>
    <style>{`@keyframes fc-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── Alert ────────────────────────────────────────────────────────────────────
export const Alert = ({ type = 'error', msg }) => {
  if (!msg) return null;
  const s = { error: [C.redLight, C.redBorder, '#991b1b', '⚠'], info: [C.blueLight, C.blueBorder, C.blueDark, 'ℹ'], success: [C.greenLight, C.greenBorder, '#065f46', '✓'] }[type];
  return <div style={{ background: s[0], border: `1px solid ${s[1]}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: s[2], fontSize: '13.5px', display: 'flex', gap: '8px', alignItems: 'center' }}><span>{s[3]}</span>{msg}</div>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = n => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const fmtDate = d => d ? new Date(d).toLocaleDateString('en-ZA') : '—';