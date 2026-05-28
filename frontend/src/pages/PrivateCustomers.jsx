// import { useState } from 'react';
// import { Users, Plus } from 'lucide-react';
// import api from '../utils/api';
// import { useFetch } from '../hooks';
// import { PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select } from '../components/ui';

// const EMPTY_FORM = { companyId: '', fullName: '', licenceNumber: '', licenceExpiry: '', phone: '', email: '' };

// export default function Drivers() {
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const { data: drivers, loading, refetch } = useFetch('/drivers');
//   const { data: companies } = useFetch('/companies?limit=100');

//   const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

//   const handleSave = async () => {
//     if (!form.companyId || !form.fullName) return setError('Company and name are required');
//     setSaving(true); setError('');
//     try {
//       await api.post('/drivers', form);
//       setShowModal(false); setForm(EMPTY_FORM); refetch();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save');
//     } finally { setSaving(false); }
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Drivers"
//         subtitle={`${drivers?.length ?? 0} registered`}
//         action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add driver</Btn>}
//       />

//       {loading ? <LoadingSpinner /> : !drivers?.length ? (
//         <EmptyState icon={Users} title="No drivers yet"
//           action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add driver</Btn>}
//         />
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 {['Name', 'Company', 'Licence number', 'Licence expiry', 'Phone', 'Email'].map(h => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {drivers.map((d) => (
//                 <tr key={d._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 font-medium text-gray-900">{d.fullName}</td>
//                   <td className="px-4 py-3 text-gray-500">{d.companyId?.name}</td>
//                   <td className="px-4 py-3 text-gray-500 font-mono text-xs">{d.licenceNumber || '—'}</td>
//                   <td className="px-4 py-3 text-gray-500">
//                     {d.licenceExpiry ? new Date(d.licenceExpiry).toLocaleDateString('en-ZA') : '—'}
//                   </td>
//                   <td className="px-4 py-3 text-gray-500">{d.phone || '—'}</td>
//                   <td className="px-4 py-3 text-gray-500">{d.email || '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add driver">
//         {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
//         <FormField label="Company *">
//           <Select value={form.companyId} onChange={set('companyId')}>
//             <option value="">Select company</option>
//             {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//           </Select>
//         </FormField>
//         <FormField label="Full name *"><Input value={form.fullName} onChange={set('fullName')} /></FormField>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Licence number"><Input value={form.licenceNumber} onChange={set('licenceNumber')} /></FormField>
//           <FormField label="Licence expiry"><Input type="date" value={form.licenceExpiry} onChange={set('licenceExpiry')} /></FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} /></FormField>
//           <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
//         </div>
//         <div className="flex justify-end gap-2 mt-1">
//           <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
//           <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add driver'}</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }

import { useState } from 'react';
import api from '../api/api';
import { useFetch, useDebounce } from '../hooks/hooks';

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
const inp = { width:'100%', padding:'9px 12px', fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };
const Btn = ({ children, onClick, variant='primary', disabled }) => <button onClick={onClick} disabled={disabled} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', background:variant==='primary'?'#3b82f6':'#fff', color:variant==='primary'?'#fff':'#374151', border:variant==='primary'?'none':'1px solid #d1d5db', borderRadius:8, fontSize:13.5, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:'inherit' }}>{children}</button>;
const Field = ({ label, required, hint, children }) => <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:5 }}>{label}{required&&<span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}</label>{children}{hint&&<p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>{hint}</p>}</div>;
const Modal = ({ open, onClose, title, children }) => { if (!open) return null; return <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(2px)' }} onClick={onClose}><div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }} onClick={e=>e.stopPropagation()}><div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid #e5e7eb' }}><h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{title}</h2><button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#9ca3af', cursor:'pointer', lineHeight:1 }}>×</button></div><div style={{ padding:24 }}>{children}</div></div></div>; };

const EMPTY = { first_name:'', last_name:'', id_number:'', phone:'', email:'', address:'' };

export default function PrivateCustomers() {
  const [search, setSearch]   = useState('');
  const [showModal, setShow]  = useState(false);
  const [editItem, setEdit]   = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  const q = useDebounce(search);
  const { data: customers, loading, refetch } = useFetch(`/customers/private?search=${q}`, [q]);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setShow(true); };
  const openEdit = c => { setEdit(c); setForm({ first_name:c.first_name, last_name:c.last_name, id_number:c.id_number, phone:c.phone||'', email:c.email||'', address:c.address||'' }); setShow(true); };

  const save = async () => {
    if (!form.first_name||!form.last_name||!form.id_number) return setErr('First name, last name and ID number are required');
    setSaving(true); setErr('');
    try {
      if (editItem) await api.put(`/customers/private/${editItem.id}`, form);
      else          await api.post('/customers/private', form);
      setShow(false); refetch();
    } catch(e) { setErr(e.response?.data?.message||'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:6 }}>CRM / Customers</p>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Private Customers</h1>
          <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>{customers?.length??0} individual clients registered</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:14, pointerEvents:'none' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID…" style={{ paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', width:240 }} />
          </div>
          <Btn onClick={openAdd}>＋ Add Customer</Btn>
        </div>
      </div>

      <div style={card}>
        {loading ? <div style={{ padding:60, textAlign:'center', color:'#9ca3af' }}>Loading…</div>
        : !customers?.length ? <div style={{ padding:60, textAlign:'center' }}><div style={{ fontSize:40, marginBottom:12 }}>👤</div><div style={{ fontSize:15, fontWeight:600, color:'#374151', marginBottom:20 }}>{search?'No customers found':'No customers yet'}</div>{!search&&<Btn onClick={openAdd}>＋ Add Customer</Btn>}</div>
        : <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
          <thead><tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>{['Customer','SA ID Number','Phone','Email','Address',''].map(h=><th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>)}</tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} onClick={()=>openEdit(c)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', transition:'background 0.1s' }} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#dbeafe,#bfdbfe)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#1d4ed8', flexShrink:0 }}>{c.first_name[0]}{c.last_name[0]}</div>
                    <div><div style={{ fontWeight:500 }}>{c.first_name} {c.last_name}</div></div>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:12.5, color:'#6b7280' }}>{c.id_number}</td>
                <td style={{ padding:'12px 16px', color:'#6b7280' }}>{c.phone||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#6b7280' }}>{c.email||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#9ca3af', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.address||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#3b82f6', fontSize:12, fontWeight:500 }}>Edit</td>
              </tr>
            ))}
          </tbody>
        </table></div>}
      </div>

      <Modal open={showModal} onClose={()=>{setShow(false);setErr('');}} title={editItem?'Edit Customer':'Add Private Customer'}>
        {err && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#b91c1c', fontSize:13.5 }}>⚠ {err}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="First name" required><input value={form.first_name} onChange={set('first_name')} style={inp} /></Field>
          <Field label="Last name" required><input value={form.last_name} onChange={set('last_name')} style={inp} /></Field>
        </div>
        <Field label="SA ID Number" required hint="13-digit South African identity number"><input value={form.id_number} onChange={set('id_number')} placeholder="8001015009087" maxLength={13} style={{...inp, fontFamily:'monospace', letterSpacing:1}} /></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Phone"><input value={form.phone} onChange={set('phone')} placeholder="082 000 0000" style={inp} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={set('email')} style={inp} /></Field>
        </div>
        <Field label="Address"><input value={form.address} onChange={set('address')} style={inp} /></Field>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <Btn variant="secondary" onClick={()=>setShow(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving?'Saving…':editItem?'Update':'Add Customer'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
