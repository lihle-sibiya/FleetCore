// import React, { useEffect, useState } from 'react';
// import { applicationAPI } from '../../api/api';

// const ApplicationList = () => {
//   const [apps, setApps] = useState([]);

//   useEffect(() => {
//     applicationAPI.getAll().then(res => setApps(res.data));
//   }, []);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-bold">Licensing Applications</h2>
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">New Application</button>
//       </div>
      
//       <table className="min-w-full bg-white border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-3 text-left">App ID</th>
//             <th className="p-3 text-left">Vehicle (VIN)</th>
//             <th className="p-3 text-left">Type</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Fee Paid</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {apps.map(app => (
//             <tr key={app.id} className="border-t">
//               <td className="p-3">#{app.id}</td>
//               <td className="p-3 font-mono text-sm">{app.vin}</td>
//               <td className="p-3 capitalize">{app.app_type.replace('_', ' ')}</td>
//               <td className="p-3">
//                 <span className={`px-2 py-1 rounded text-xs ${
//                   app.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {app.status}
//                 </span>
//               </td>
//               <td className="p-3">R {app.licensing_fee_paid || '0.00'}</td>
//               <td className="p-3">
//                 <button className="text-blue-600 hover:underline">View Docs</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ApplicationList;

import { useState } from 'react';
import api from '../api/api';
import { useFetch } from '../hooks/hooks';

const fmt = d => d ? new Date(d).toLocaleDateString('en-ZA') : '—';
const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
const STATUS_STEPS = ['pending','documents_received','submitted_to_licensing','completed','cancelled'];
const STATUS_COLOR = { pending:'#f59e0b', documents_received:'#3b82f6', submitted_to_licensing:'#6366f1', completed:'#10b981', cancelled:'#9ca3af' };
const STATUS_LABEL = { pending:'Pending', documents_received:'Docs In', submitted_to_licensing:'Submitted', completed:'Completed', cancelled:'Cancelled' };

const Badge = ({ status }) => { const c = STATUS_COLOR[status]||'#9ca3af'; return <span style={{ fontSize:11.5, background:`${c}18`, color:c, padding:'3px 10px', borderRadius:99, fontWeight:500, whiteSpace:'nowrap' }}>{STATUS_LABEL[status]||status}</span>; };
const TypeBadge = ({ type }) => <span style={{ fontSize:11.5, background: type==='new_registration'?'#eff6ff':'#f5f3ff', color: type==='new_registration'?'#1d4ed8':'#5b21b6', padding:'3px 10px', borderRadius:99, fontWeight:500 }}>{type==='new_registration'?'New Registration':'Ownership Transfer'}</span>;

const Btn = ({ children, onClick, variant='primary', size='md', disabled }) => {
  const bg = { primary:'#3b82f6', secondary:'#fff', ghost:'transparent' }[variant];
  const co = { primary:'#fff', secondary:'#374151', ghost:'#6b7280' }[variant];
  const bd = { primary:'none', secondary:'1px solid #d1d5db', ghost:'none' }[variant];
  const pd = size==='sm' ? '5px 12px' : '9px 18px';
  return <button onClick={onClick} disabled={disabled} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:pd, background:bg, color:co, border:bd, borderRadius:8, fontSize: size==='sm'?12:13.5, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:'inherit', transition:'background 0.12s', whiteSpace:'nowrap' }}
    onMouseEnter={e=>{ if(!disabled&&variant==='primary') e.currentTarget.style.background='#2563eb'; }}
    onMouseLeave={e=>{ if(!disabled&&variant==='primary') e.currentTarget.style.background='#3b82f6'; }}
  >{children}</button>;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(2px)' }} onClick={onClose}>
    <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }} onClick={e=>e.stopPropagation()}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid #e5e7eb' }}>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{title}</h2>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#9ca3af', cursor:'pointer', lineHeight:1 }}>×</button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>;
};

const inp = { width:'100%', padding:'9px 12px', fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };
const Field = ({ label, required, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:5 }}>{label}{required&&<span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}</label>
    {children}
  </div>
);

const TABS = [
  { value:'', label:'All' },
  { value:'pending', label:'Pending' },
  { value:'documents_received', label:'Docs In' },
  { value:'submitted_to_licensing', label:'Submitted' },
  { value:'completed', label:'Completed' },
];

const EMPTY_FORM = { app_type:'new_registration', owner_type:'private', vehicle_id:'', private_customer_id:'', dealership_customer_id:'' };

export default function Applications() {
  const [tab, setTab]           = useState('');
  const [showNew, setShowNew]   = useState(false);
  const [detail, setDetail]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState('');

  const { data, loading, refetch } = useFetch(`/applications?status=${tab}&limit=100`, [tab]);
  const { data: allData }          = useFetch('/applications?limit=1000');
  const { data: vehicles }         = useFetch('/vehicles');
  const { data: privCusts }        = useFetch('/customers/private');
  const { data: dealCusts }        = useFetch('/customers/dealership');

  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const apps = data?.applications || [];
  const all  = allData?.applications || [];
  const counts = { '':all.length, pending:all.filter(a=>a.status==='pending').length, documents_received:all.filter(a=>a.status==='documents_received').length, submitted_to_licensing:all.filter(a=>a.status==='submitted_to_licensing').length, completed:all.filter(a=>a.status==='completed').length };

  const create = async () => {
    if (!form.vehicle_id) return setErr('Please select a vehicle');
    if (form.owner_type==='private' && !form.private_customer_id) return setErr('Please select a private customer');
    if (form.owner_type==='dealership' && !form.dealership_customer_id) return setErr('Please select a dealership customer');
    setSaving(true); setErr('');
    try {
      await api.post('/applications', {
        app_type: form.app_type,
        vehicle_id: parseInt(form.vehicle_id),
        private_customer_id:    form.owner_type==='private'    ? parseInt(form.private_customer_id)    : null,
        dealership_customer_id: form.owner_type==='dealership' ? parseInt(form.dealership_customer_id) : null,
      });
      setShowNew(false); setForm(EMPTY_FORM); refetch();
    } catch(e) { setErr(e.response?.data?.message || 'Failed to create'); }
    finally { setSaving(false); }
  };

  const advance = async (app) => {
    const idx = STATUS_STEPS.indexOf(app.status);
    if (idx < 0 || app.status==='completed' || app.status==='cancelled') return;
    await api.patch(`/applications/${app.id}/status`, { status: STATUS_STEPS[idx+1] });
    refetch();
    if (detail?.id===app.id) setDetail({...detail, status: STATUS_STEPS[idx+1]});
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:6 }}>CRM / Applications</p>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Applications</h1>
          <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>Vehicle registrations & ownership transfers</p>
        </div>
        <Btn onClick={() => setShowNew(true)}>＋ New Application</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:2, background:'#f1f5f9', padding:4, borderRadius:10, width:'fit-content', marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)} style={{
            padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit',
            fontSize:13, fontWeight: tab===t.value ? 500 : 400,
            background: tab===t.value ? '#fff' : 'transparent',
            color: tab===t.value ? '#111827' : '#6b7280',
            boxShadow: tab===t.value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition:'all 0.12s',
          }}>
            {t.label}
            <span style={{ marginLeft:6, padding:'1px 7px', borderRadius:99, fontSize:11, fontWeight:500, background: tab===t.value ? '#dbeafe' : '#e2e8f0', color: tab===t.value ? '#1d4ed8' : '#6b7280' }}>{counts[t.value]??0}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={card}>
        {loading ? (
          <div style={{ padding:60, textAlign:'center', color:'#9ca3af' }}>Loading…</div>
        ) : !apps.length ? (
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            <div style={{ fontSize:15, fontWeight:600, color:'#374151', marginBottom:6 }}>No applications found</div>
            <div style={{ fontSize:13.5, color:'#6b7280', marginBottom:20 }}>Create your first application to get started.</div>
            <Btn onClick={() => setShowNew(true)}>＋ New Application</Btn>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>
                  {['#','Type','Vehicle','Customer','Status','Fee Paid','Created',''].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apps.map(app => {
                  const customer = app.privateCustomer ? `${app.privateCustomer.first_name} ${app.privateCustomer.last_name}` : app.dealershipCustomer ? `${app.dealershipCustomer.first_name} ${app.dealershipCustomer.last_name}` : '—';
                  const canAdv = app.status !== 'completed' && app.status !== 'cancelled';
                  return (
                    <tr key={app.id} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', transition:'background 0.1s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}
                    >
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontFamily:'monospace', fontSize:12.5 }} onClick={()=>setDetail(app)}>#{app.id}</td>
                      <td style={{ padding:'12px 16px' }} onClick={()=>setDetail(app)}><TypeBadge type={app.app_type} /></td>
                      <td style={{ padding:'12px 16px' }} onClick={()=>setDetail(app)}>
                        <div style={{ fontWeight:500 }}>{app.vehicle ? `${app.vehicle.make} ${app.vehicle.model} ${app.vehicle.year}` : '—'}</div>
                        {app.vehicle?.reg_number && <div style={{ fontSize:11.5, color:'#9ca3af', fontFamily:'monospace' }}>{app.vehicle.reg_number}</div>}
                      </td>
                      <td style={{ padding:'12px 16px', color:'#374151' }} onClick={()=>setDetail(app)}>{customer}</td>
                      <td style={{ padding:'12px 16px' }} onClick={()=>setDetail(app)}><Badge status={app.status} /></td>
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontFamily:'monospace', fontSize:12.5 }} onClick={()=>setDetail(app)}>
                        {app.licensing_fee_paid ? `R ${Number(app.licensing_fee_paid).toFixed(2)}` : '—'}
                      </td>
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontSize:12.5 }} onClick={()=>setDetail(app)}>{fmt(app.created_at)}</td>
                      <td style={{ padding:'12px 16px' }}>
                        {canAdv && <Btn size="sm" variant="secondary" onClick={e=>{e.stopPropagation();advance(app);}}>Advance →</Btn>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Application Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErr('');setForm(EMPTY_FORM);}} title="New Application">
        {err && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#b91c1c', fontSize:13.5 }}>⚠ {err}</div>}
        <Field label="Application type" required>
          <select value={form.app_type} onChange={set('app_type')} style={inp}>
            <option value="new_registration">New Registration</option>
            <option value="ownership_transfer">Ownership Transfer</option>
          </select>
        </Field>
        <Field label="Vehicle" required>
          <select value={form.vehicle_id} onChange={set('vehicle_id')} style={inp}>
            <option value="">Select vehicle…</option>
            {vehicles?.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} {v.year} — {v.reg_number||v.vin}</option>)}
          </select>
        </Field>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:8 }}>Customer type</div>
          <div style={{ display:'flex', gap:8 }}>
            {['private','dealership'].map(t => (
              <button key={t} onClick={()=>setForm(f=>({...f,owner_type:t,private_customer_id:'',dealership_customer_id:''}))} style={{ padding:'7px 16px', borderRadius:8, border:`1.5px solid ${form.owner_type===t?'#3b82f6':'#d1d5db'}`, background:form.owner_type===t?'#eff6ff':'#fff', color:form.owner_type===t?'#1d4ed8':'#6b7280', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
        {form.owner_type==='private' ? (
          <Field label="Private customer" required>
            <select value={form.private_customer_id} onChange={set('private_customer_id')} style={inp}>
              <option value="">Select customer…</option>
              {privCusts?.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.id_number}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Dealership customer" required>
            <select value={form.dealership_customer_id} onChange={set('dealership_customer_id')} style={inp}>
              <option value="">Select dealership customer…</option>
              {dealCusts?.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </Field>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:8 }}>
          <Btn variant="secondary" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={create} disabled={saving}>{saving?'Creating…':'Create Application'}</Btn>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={()=>setDetail(null)} title={`Application #${detail?.id}`}>
        {detail && (
          <div>
            {/* Pipeline */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Status Pipeline</div>
              <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #e5e7eb' }}>
                {['pending','documents_received','submitted_to_licensing','completed'].map((s,i,arr) => {
                  const idx = STATUS_STEPS.indexOf(detail.status);
                  const isDone   = idx > i;
                  const isActive = detail.status === s;
                  const labels   = ['Pending','Docs In','Submitted','Completed'];
                  return (
                    <div key={s} style={{ flex:1, textAlign:'center', padding:'8px 4px', borderRight: i<arr.length-1?'1px solid #e5e7eb':'none', background: isActive?'#3b82f6': isDone?'#dbeafe':'#f8fafc', color: isActive?'#fff': isDone?'#1d4ed8':'#9ca3af', fontSize:11.5, fontWeight: isActive?600:400 }}>
                      {labels[i]}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
              {[
                { l:'Type', v: detail.app_type==='new_registration'?'New Registration':'Ownership Transfer' },
                { l:'Status', v: <Badge status={detail.status} /> },
                { l:'Vehicle', v: detail.vehicle ? `${detail.vehicle.make} ${detail.vehicle.model} ${detail.vehicle.year}` : '—' },
                { l:'VIN', v: detail.vehicle?.vin || '—', mono:true },
                { l:'Reg number', v: detail.vehicle?.reg_number || '—', mono:true },
                { l:'Licensing fee', v: detail.licensing_fee_paid ? `R ${Number(detail.licensing_fee_paid).toFixed(2)}` : '—' },
                { l:'Dept ref', v: detail.licensing_dept_ref || '—', mono:true },
                { l:'Created', v: fmt(detail.created_at) },
                detail.submitted_at && { l:'Submitted', v: fmt(detail.submitted_at) },
                detail.completed_at && { l:'Completed', v: fmt(detail.completed_at) },
              ].filter(Boolean).map(item => (
                <div key={item.l}>
                  <div style={{ fontSize:11, color:'#9ca3af', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:3 }}>{item.l}</div>
                  <div style={{ fontSize:14, color:'#111827', fontFamily: item.mono?'monospace':'inherit' }}>{item.v}</div>
                </div>
              ))}
            </div>
            {detail.status!=='completed' && detail.status!=='cancelled' && (
              <div style={{ display:'flex', justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid #f1f5f9' }}>
                <Btn onClick={()=>advance(detail)}>Advance to next status →</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
