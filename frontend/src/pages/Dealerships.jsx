// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Building2, Plus, ChevronRight } from 'lucide-react';
// import api from '../api/api';
// import { useFetch, useDebounce } from '../hooks/hooks';
// import {
//   PageHeader, SearchInput, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input
// } from '../components/ui/ui';

// const EMPTY_FORM = { name: '', registrationNumber: '', vatNumber: '', phone: '', email: '', address: '' };

// export default function Companies() {
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const debouncedSearch = useDebounce(search);
//   const { data, loading, refetch } = useFetch(
//     `/companies?search=${debouncedSearch}&limit=50`,
//     [debouncedSearch]
//   );

//   const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

//   const handleSave = async () => {
//     if (!form.name || !form.phone) return setError('Name and phone are required');
//     setSaving(true); setError('');
//     try {
//       await api.post('/companies', form);
//       setShowModal(false); setForm(EMPTY_FORM); refetch();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save');
//     } finally { setSaving(false); }
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Companies"
//         subtitle={`${data?.total ?? 0} fleet clients`}
//         action={
//           <Btn onClick={() => setShowModal(true)}>
//             <Plus size={15} /> Add company
//           </Btn>
//         }
//       />

//       <div className="mb-4">
//         <SearchInput value={search} onChange={setSearch} placeholder="Search companies..." />
//       </div>

//       {loading ? <LoadingSpinner /> : !data?.companies?.length ? (
//         <EmptyState icon={Building2} title="No companies yet"
//           body="Add your first fleet client to get started."
//           action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add company</Btn>}
//         />
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 {['Company', 'Reg number', 'Phone', 'Email', ''].map(h => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {data.companies.map((co) => (
//                 <tr key={co._id} className="hover:bg-gray-50 cursor-pointer"
//                   onClick={() => navigate(`/companies/${co._id}`)}>
//                   <td className="px-4 py-3 font-medium text-gray-900">{co.name}</td>
//                   <td className="px-4 py-3 text-gray-500">{co.registrationNumber || '—'}</td>
//                   <td className="px-4 py-3 text-gray-600">{co.phone}</td>
//                   <td className="px-4 py-3 text-gray-500">{co.email || '—'}</td>
//                   <td className="px-4 py-3 text-gray-300"><ChevronRight size={15} /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add company">
//         {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
//         <FormField label="Company name *"><Input value={form.name} onChange={set('name')} /></FormField>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Reg number"><Input value={form.registrationNumber} onChange={set('registrationNumber')} /></FormField>
//           <FormField label="VAT number"><Input value={form.vatNumber} onChange={set('vatNumber')} /></FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Phone *"><Input value={form.phone} onChange={set('phone')} /></FormField>
//           <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
//         </div>
//         <FormField label="Address"><Input value={form.address} onChange={set('address')} /></FormField>
//         <div className="flex justify-end gap-2 mt-2">
//           <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
//           <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save company'}</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }


import { useState } from 'react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks/hooks';

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
const inp = { width:'100%', padding:'9px 12px', fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };
const Btn = ({ children, onClick, variant='primary', disabled }) => <button onClick={onClick} disabled={disabled} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', background:variant==='primary'?'#3b82f6':'#fff', color:variant==='primary'?'#fff':'#374151', border:variant==='primary'?'none':'1px solid #d1d5db', borderRadius:8, fontSize:13.5, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:'inherit' }}>{children}</button>;
const Field = ({ label, required, children }) => <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:5 }}>{label}{required&&<span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}</label>{children}</div>;
const Modal = ({ open, onClose, title, children }) => { if (!open) return null; return <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(2px)' }} onClick={onClose}><div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:500, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }} onClick={e=>e.stopPropagation()}><div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid #e5e7eb' }}><h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{title}</h2><button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#9ca3af', cursor:'pointer', lineHeight:1 }}>×</button></div><div style={{ padding:24 }}>{children}</div></div></div>; };

const EMPTY = { name:'', contact_name:'', phone:'', email:'', address:'' };

export default function Dealerships() {
  const [search, setSearch]  = useState('');
  const [showModal, setShow] = useState(false);
  const [editItem, setEdit]  = useState(null);
  const [form, setForm]      = useState(EMPTY);
  const [saving, setSaving]  = useState(false);
  const [err, setErr]        = useState('');

  const q = useDebounce(search);
  const { data, loading, refetch } = useFetch(`/dealerships?search=${q}&limit=50`, [q]);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const openAdd  = () => { setEdit(null); setForm(EMPTY); setShow(true); };
  const openEdit = d => { setEdit(d); setForm({ name:d.name, contact_name:d.contact_name||'', phone:d.phone||'', email:d.email||'', address:d.address||'' }); setShow(true); };

  const save = async () => {
    if (!form.name) return setErr('Dealership name is required');
    setSaving(true); setErr('');
    try {
      if (editItem) await api.put(`/dealerships/${editItem.id}`, form);
      else          await api.post('/dealerships', form);
      setShow(false); refetch();
    } catch(e) { setErr(e.response?.data?.message||'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:6 }}>CRM / Dealerships</p>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Dealerships</h1>
          <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>{data?.total??0} dealerships registered</p>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:14, pointerEvents:'none' }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dealerships…" style={{ paddingLeft:32, paddingRight:12, paddingTop:8, paddingBottom:8, fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', width:240 }} />
          </div>
          <Btn onClick={openAdd}>＋ Add Dealership</Btn>
        </div>
      </div>

      <div style={card}>
        {loading ? <div style={{ padding:60, textAlign:'center', color:'#9ca3af' }}>Loading…</div>
        : !data?.dealerships?.length ? <div style={{ padding:60, textAlign:'center' }}><div style={{ fontSize:40, marginBottom:12 }}>🏢</div><div style={{ fontSize:15, fontWeight:600, color:'#374151', marginBottom:20 }}>{search?'No dealerships found':'No dealerships yet'}</div>{!search&&<Btn onClick={openAdd}>＋ Add Dealership</Btn>}</div>
        : <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
          <thead><tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>{['Dealership','Contact','Phone','Email','Address',''].map(h=><th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>)}</tr></thead>
          <tbody>
            {data.dealerships.map(d => (
              <tr key={d.id} onClick={()=>openEdit(d)} style={{ borderBottom:'1px solid #f1f5f9', cursor:'pointer', transition:'background 0.1s' }} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#ede9fe,#ddd6fe)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#5b21b6', flexShrink:0 }}>{d.name.slice(0,2).toUpperCase()}</div>
                    <div style={{ fontWeight:500 }}>{d.name}</div>
                  </div>
                </td>
                <td style={{ padding:'12px 16px', color:'#6b7280' }}>{d.contact_name||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#6b7280' }}>{d.phone||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#6b7280' }}>{d.email||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#9ca3af', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.address||'—'}</td>
                <td style={{ padding:'12px 16px', color:'#3b82f6', fontSize:12, fontWeight:500 }}>Edit</td>
              </tr>
            ))}
          </tbody>
        </table></div>}
      </div>

      <Modal open={showModal} onClose={()=>{setShow(false);setErr('');}} title={editItem?'Edit Dealership':'Add Dealership'}>
        {err && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#b91c1c', fontSize:13.5 }}>⚠ {err}</div>}
        <Field label="Dealership name" required><input value={form.name} onChange={set('name')} placeholder="ABC Motors" style={inp} /></Field>
        <Field label="Contact person"><input value={form.contact_name} onChange={set('contact_name')} placeholder="John Smith" style={inp} /></Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Phone"><input value={form.phone} onChange={set('phone')} placeholder="011 000 0000" style={inp} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={set('email')} style={inp} /></Field>
        </div>
        <Field label="Address"><input value={form.address} onChange={set('address')} style={inp} /></Field>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <Btn variant="secondary" onClick={()=>setShow(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving?'Saving…':editItem?'Update':'Add Dealership'}</Btn>
        </div>
      </Modal>
    </div>
  );
}