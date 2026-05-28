// import { useState } from 'react';
// import { Truck, Plus, AlertCircle } from 'lucide-react';
// import api from '../api/api';
// import { useFetch } from '../hooks/hooks';
// import { PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select } from '../components/ui/ui';

// const EMPTY_FORM = {
//   companyId: '', driverId: '', make: '', model: '', year: '',
//   colour: '', registrationNumber: '', vinNumber: '',
//   licenceExpiryDate: '', nextServiceDate: '', odometerKm: '',
// };

// const daysUntil = (date) => {
//   if (!date) return null;
//   return Math.ceil((new Date(date) - new Date()) / 86400000);
// };

// const ExpiryBadge = ({ date, label }) => {
//   const days = daysUntil(date);
//   if (days === null) return <span className="text-gray-300">—</span>;
//   const cls = days <= 7 ? 'text-red-600 font-medium' : days <= 30 ? 'text-yellow-600' : 'text-gray-500';
//   return (
//     <span className={cls}>
//       {new Date(date).toLocaleDateString('en-ZA')}
//       {days <= 30 && <span className="ml-1 text-xs">({days}d)</span>}
//     </span>
//   );
// };

// export default function Vehicles() {
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const { data: vehicles, loading, refetch } = useFetch('/vehicles');
//   const { data: companies } = useFetch('/companies?limit=100');
//   const { data: drivers } = useFetch(
//     form.companyId ? `/drivers?companyId=${form.companyId}` : null,
//     [form.companyId]
//   );

//   const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

//   const handleSave = async () => {
//     if (!form.companyId || !form.make || !form.model || !form.registrationNumber)
//       return setError('Company, make, model and registration number are required');
//     setSaving(true); setError('');
//     try {
//       await api.post('/vehicles', form);
//       setShowModal(false); setForm(EMPTY_FORM); refetch();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save');
//     } finally { setSaving(false); }
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Vehicles"
//         subtitle={`${vehicles?.length ?? 0} registered`}
//         action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add vehicle</Btn>}
//       />

//       {loading ? <LoadingSpinner /> : !vehicles?.length ? (
//         <EmptyState icon={Truck} title="No vehicles yet" body="Add your first vehicle."
//           action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add vehicle</Btn>}
//         />
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 {['Registration', 'Vehicle', 'Company', 'Driver', 'Licence expiry', 'Next service', 'km'].map(h => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {vehicles.map((v) => {
//                 const licDays = daysUntil(v.licenceExpiryDate);
//                 const svcDays = daysUntil(v.nextServiceDate);
//                 const urgent = (licDays !== null && licDays <= 14) || (svcDays !== null && svcDays <= 14);
//                 return (
//                   <tr key={v._id} className={`hover:bg-gray-50 ${urgent ? 'bg-red-50/30' : ''}`}>
//                     <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-1.5">
//                       {urgent && <AlertCircle size={13} className="text-red-400" />}
//                       {v.registrationNumber}
//                     </td>
//                     <td className="px-4 py-3 text-gray-700">{v.year} {v.make} {v.model}</td>
//                     <td className="px-4 py-3 text-gray-500">{v.companyId?.name}</td>
//                     <td className="px-4 py-3 text-gray-500">{v.driverId?.fullName || '—'}</td>
//                     <td className="px-4 py-3"><ExpiryBadge date={v.licenceExpiryDate} /></td>
//                     <td className="px-4 py-3"><ExpiryBadge date={v.nextServiceDate} /></td>
//                     <td className="px-4 py-3 text-gray-400">{v.odometerKm ? `${v.odometerKm.toLocaleString()} km` : '—'}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add vehicle">
//         {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Company *">
//             <Select value={form.companyId} onChange={set('companyId')}>
//               <option value="">Select company</option>
//               {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </Select>
//           </FormField>
//           <FormField label="Driver">
//             <Select value={form.driverId} onChange={set('driverId')} disabled={!form.companyId}>
//               <option value="">Select driver</option>
//               {drivers?.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
//             </Select>
//           </FormField>
//         </div>
//         <div className="grid grid-cols-3 gap-3">
//           <FormField label="Make *"><Input value={form.make} onChange={set('make')} placeholder="Toyota" /></FormField>
//           <FormField label="Model *"><Input value={form.model} onChange={set('model')} placeholder="Hilux" /></FormField>
//           <FormField label="Year"><Input type="number" value={form.year} onChange={set('year')} placeholder="2021" /></FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Registration number *"><Input value={form.registrationNumber} onChange={set('registrationNumber')} placeholder="AB123GP" /></FormField>
//           <FormField label="Colour"><Input value={form.colour} onChange={set('colour')} /></FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Licence expiry"><Input type="date" value={form.licenceExpiryDate} onChange={set('licenceExpiryDate')} /></FormField>
//           <FormField label="Next service date"><Input type="date" value={form.nextServiceDate} onChange={set('nextServiceDate')} /></FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="VIN number"><Input value={form.vinNumber} onChange={set('vinNumber')} /></FormField>
//           <FormField label="Odometer (km)"><Input type="number" value={form.odometerKm} onChange={set('odometerKm')} /></FormField>
//         </div>
//         <div className="flex justify-end gap-2 mt-1">
//           <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
//           <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add vehicle'}</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }


import { useState } from 'react';
import api from '../api/api';
import { useFetch } from '../hooks/hooks';

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
const inp = { width:'100%', padding:'9px 12px', fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };
const Btn = ({ children, onClick, variant='primary', disabled }) => <button onClick={onClick} disabled={disabled} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', background:variant==='primary'?'#3b82f6':'#fff', color:variant==='primary'?'#fff':'#374151', border:variant==='primary'?'none':'1px solid #d1d5db', borderRadius:8, fontSize:13.5, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:'inherit' }}>{children}</button>;
const Field = ({ label, required, hint, children }) => <div style={{ marginBottom:16 }}><label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:5 }}>{label}{required&&<span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}</label>{children}{hint&&<p style={{ fontSize:11.5, color:'#9ca3af', marginTop:4 }}>{hint}</p>}</div>;
const Modal = ({ open, onClose, title, children }) => { if (!open) return null; return <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(2px)' }} onClick={onClose}><div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }} onClick={e=>e.stopPropagation()}><div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid #e5e7eb' }}><h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{title}</h2><button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#9ca3af', cursor:'pointer', lineHeight:1 }}>×</button></div><div style={{ padding:24 }}>{children}</div></div></div>; };

const EMPTY = { owner_type:'private', private_customer_id:'', dealership_customer_id:'', make:'', model:'', year:'', vin:'', reg_number:'' };

export default function Vehicles() {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  const { data: vehicles, loading, refetch } = useFetch('/vehicles');
  const { data: privCusts }  = useFetch('/customers/private');
  const { data: dealCusts }  = useFetch('/customers/dealership');

  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const save = async () => {
    if (!form.make||!form.model||!form.year||!form.vin) return setErr('Make, model, year and VIN are required');
    if (form.owner_type==='private'&&!form.private_customer_id) return setErr('Select a private customer');
    if (form.owner_type==='dealership'&&!form.dealership_customer_id) return setErr('Select a dealership customer');
    setSaving(true); setErr('');
    try {
      await api.post('/vehicles', { make:form.make, model:form.model, year:parseInt(form.year), vin:form.vin, reg_number:form.reg_number||null, private_customer_id:form.owner_type==='private'?parseInt(form.private_customer_id):null, dealership_customer_id:form.owner_type==='dealership'?parseInt(form.dealership_customer_id):null });
      setShowNew(false); setForm(EMPTY); refetch();
    } catch(e) { setErr(e.response?.data?.message||'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:6 }}>CRM / Vehicles</p>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Vehicles</h1>
          <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>{vehicles?.length??0} vehicles registered</p>
        </div>
        <Btn onClick={()=>setShowNew(true)}>＋ Add Vehicle</Btn>
      </div>
      <div style={card}>
        {loading ? <div style={{ padding:60, textAlign:'center', color:'#9ca3af' }}>Loading…</div>
        : !vehicles?.length ? <div style={{ padding:60, textAlign:'center' }}><div style={{ fontSize:40, marginBottom:12 }}>🚗</div><div style={{ fontSize:15, fontWeight:600, color:'#374151', marginBottom:20 }}>No vehicles yet</div><Btn onClick={()=>setShowNew(true)}>＋ Add Vehicle</Btn></div>
        : <div style={{ overflowX:'auto' }}><table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
          <thead><tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>{['Reg #','Vehicle','VIN','Owner','Type','Added'].map(h=><th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px', whiteSpace:'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {vehicles.map(v => {
              const owner = v.privateCustomer ? `${v.privateCustomer.first_name} ${v.privateCustomer.last_name}` : v.dealershipCustomer ? `${v.dealershipCustomer.first_name} ${v.dealershipCustomer.last_name}${v.dealershipCustomer.dealership?` · ${v.dealershipCustomer.dealership.name}`:''}` : '—';
              const isPrivate = !!v.private_customer_id;
              return <tr key={v.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.1s' }} onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:13, fontWeight:700, color:'#2563eb' }}>{v.reg_number||'—'}</td>
                <td style={{ padding:'12px 16px', fontWeight:500 }}>{v.year} {v.make} {v.model}</td>
                <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:12, color:'#9ca3af' }}>{v.vin}</td>
                <td style={{ padding:'12px 16px', color:'#374151' }}>{owner}</td>
                <td style={{ padding:'12px 16px' }}><span style={{ fontSize:11.5, background:isPrivate?'#eff6ff':'#f5f3ff', color:isPrivate?'#1d4ed8':'#5b21b6', padding:'3px 10px', borderRadius:99, fontWeight:500 }}>{isPrivate?'Private':'Dealership'}</span></td>
                <td style={{ padding:'12px 16px', color:'#9ca3af', fontSize:12.5 }}>{v.created_at?new Date(v.created_at).toLocaleDateString('en-ZA'):'—'}</td>
              </tr>;
            })}
          </tbody>
        </table></div>}
      </div>
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErr('');setForm(EMPTY);}} title="Register Vehicle">
        {err && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#b91c1c', fontSize:13.5 }}>⚠ {err}</div>}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:8 }}>Owner type</div>
          <div style={{ display:'flex', gap:8 }}>
            {['private','dealership'].map(t=><button key={t} onClick={()=>setForm(f=>({...f,owner_type:t,private_customer_id:'',dealership_customer_id:''}))} style={{ padding:'7px 16px', borderRadius:8, border:`1.5px solid ${form.owner_type===t?'#3b82f6':'#d1d5db'}`, background:form.owner_type===t?'#eff6ff':'#fff', color:form.owner_type===t?'#1d4ed8':'#6b7280', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize' }}>{t}</button>)}
          </div>
        </div>
        {form.owner_type==='private' ? <Field label="Private customer" required><select value={form.private_customer_id} onChange={set('private_customer_id')} style={inp}><option value="">Select customer…</option>{privCusts?.map(c=><option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.id_number}</option>)}</select></Field>
        : <Field label="Dealership customer" required><select value={form.dealership_customer_id} onChange={set('dealership_customer_id')} style={inp}><option value="">Select dealership customer…</option>{dealCusts?.map(c=><option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}</select></Field>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px', gap:12 }}>
          <Field label="Make" required><input value={form.make} onChange={set('make')} placeholder="Toyota" style={inp} /></Field>
          <Field label="Model" required><input value={form.model} onChange={set('model')} placeholder="Hilux" style={inp} /></Field>
          <Field label="Year" required><input type="number" value={form.year} onChange={set('year')} placeholder="2021" min="1990" max="2030" style={inp} /></Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="VIN" required hint="17-character ID"><input value={form.vin} onChange={set('vin')} placeholder="AHTFB3EG900123456" maxLength={17} style={{...inp, fontFamily:'monospace', fontSize:13}} /></Field>
          <Field label="Reg number" hint="Leave blank if not yet issued"><input value={form.reg_number} onChange={set('reg_number')} placeholder="AB 12 CD GP" style={{...inp, fontFamily:'monospace', fontSize:13}} /></Field>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <Btn variant="secondary" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={save} disabled={saving}>{saving?'Saving…':'Register Vehicle'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
