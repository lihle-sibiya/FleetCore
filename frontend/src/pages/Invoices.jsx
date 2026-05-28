// import { useState } from 'react';
// import { FileText, Plus, Download, CheckCircle } from 'lucide-react';
// import api from '../api/api';
// import { useFetch } from '../hooks/hooks';
// import {
//   PageHeader, Btn, LoadingSpinner, EmptyState, StatusBadge,
//   Modal, FormField, Input, Select
// } from '../components/ui/ui';

// const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

// const SERVICE_TYPES = [
//   { value: 'service', label: 'Vehicle Service' },
//   { value: 'licence_renewal', label: 'Licence Renewal' },
//   { value: 'roadworthy', label: 'Roadworthy Certificate' },
//   { value: 'tyres', label: 'Tyre Replacement' },
//   { value: 'repairs', label: 'Mechanical Repairs' },
//   { value: 'other', label: 'Other' },
// ];

// const EMPTY_FORM = {
//   companyId: '', vehicleId: '', serviceType: 'service',
//   lineItems: [{ description: '', amount: '' }],
//   vatIncluded: true, dueDate: '', notes: '',
// };

// export default function Invoices() {
//   const [statusFilter, setStatusFilter] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const { data, loading, refetch } = useFetch(
//     `/invoices?status=${statusFilter}&limit=50`,
//     [statusFilter]
//   );
//   const { data: companies } = useFetch('/companies?limit=100');
//   const { data: vehicles } = useFetch(
//     form.companyId ? `/vehicles?companyId=${form.companyId}` : null,
//     [form.companyId]
//   );

//   const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

//   const setLineItem = (i, k) => (e) => {
//     const items = [...form.lineItems];
//     items[i] = { ...items[i], [k]: k === 'amount' ? e.target.value : e.target.value };
//     setForm(f => ({ ...f, lineItems: items }));
//   };

//   const addLine = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: '', amount: '' }] }));
//   const removeLine = (i) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));

//   const subtotal = form.lineItems.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
//   const vat = form.vatIncluded ? subtotal * 0.15 : 0;

//   const handleSave = async () => {
//     if (!form.companyId || !form.serviceType) return setError('Company and service type required');
//     setSaving(true); setError('');
//     try {
//       const payload = {
//         ...form,
//         lineItems: form.lineItems
//           .filter(l => l.description && l.amount)
//           .map(l => ({ description: l.description, amount: parseFloat(l.amount) })),
//       };
//       await api.post('/invoices', payload);
//       setShowModal(false); setForm(EMPTY_FORM); refetch();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save');
//     } finally { setSaving(false); }
//   };

//   const downloadPDF = async (id, number) => {
//     const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
//     const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
//     const a = document.createElement('a'); a.href = url; a.download = `${number}.pdf`; a.click();
//     URL.revokeObjectURL(url);
//   };

//   const markPaid = async (id) => {
//     await api.patch(`/invoices/${id}/mark-paid`);
//     refetch();
//   };

//   const FILTERS = ['', 'issued', 'paid', 'overdue', 'draft'];
//   const filterLabel = { '': 'All', issued: 'Issued', paid: 'Paid', overdue: 'Overdue', draft: 'Draft' };

//   return (
//     <div>
//       <PageHeader
//         title="Invoices"
//         subtitle={`${data?.total ?? 0} total`}
//         action={<Btn onClick={() => setShowModal(true)}><Plus size={15} /> New invoice</Btn>}
//       />

//       {/* Status filter tabs */}
//       <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
//         {FILTERS.map(f => (
//           <button key={f} onClick={() => setStatusFilter(f)}
//             className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
//               statusFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
//             }`}>
//             {filterLabel[f]}
//           </button>
//         ))}
//       </div>

//       {loading ? <LoadingSpinner /> : !data?.invoices?.length ? (
//         <EmptyState icon={FileText} title="No invoices" body="Create your first invoice."
//           action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />New invoice</Btn>}
//         />
//       ) : (
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-100">
//               <tr>
//                 {['Invoice', 'Company', 'Vehicle', 'Service', 'Total', 'Status', ''].map(h => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {data.invoices.map((inv) => (
//                 <tr key={inv._id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{inv.invoiceNumber}</td>
//                   <td className="px-4 py-3 text-gray-700">{inv.companyId?.name}</td>
//                   <td className="px-4 py-3 text-gray-500">{inv.vehicleId?.registrationNumber || '—'}</td>
//                   <td className="px-4 py-3 text-gray-500 capitalize">{inv.serviceType.replace('_', ' ')}</td>
//                   <td className="px-4 py-3 font-medium text-gray-800">{fmt(inv.total)}</td>
//                   <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-1">
//                       <button onClick={() => downloadPDF(inv._id, inv.invoiceNumber)}
//                         className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Download PDF">
//                         <Download size={13} />
//                       </button>
//                       {inv.status !== 'paid' && (
//                         <button onClick={() => markPaid(inv._id)}
//                           className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Mark as paid">
//                           <CheckCircle size={13} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* New Invoice Modal */}
//       <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); setForm(EMPTY_FORM); }} title="New Invoice">
//         {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Company *">
//             <Select value={form.companyId} onChange={setField('companyId')}>
//               <option value="">Select company</option>
//               {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </Select>
//           </FormField>
//           <FormField label="Vehicle">
//             <Select value={form.vehicleId} onChange={setField('vehicleId')} disabled={!form.companyId}>
//               <option value="">Select vehicle</option>
//               {vehicles?.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.make} {v.model}</option>)}
//             </Select>
//           </FormField>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <FormField label="Service type *">
//             <Select value={form.serviceType} onChange={setField('serviceType')}>
//               {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
//             </Select>
//           </FormField>
//           <FormField label="Due date"><Input type="date" value={form.dueDate} onChange={setField('dueDate')} /></FormField>
//         </div>

//         {/* Line items */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-2">
//             <label className="text-sm font-medium text-gray-700">Line items</label>
//             <button onClick={addLine} className="text-xs text-blue-600 hover:underline">+ Add line</button>
//           </div>
//           {form.lineItems.map((item, i) => (
//             <div key={i} className="flex gap-2 mb-2">
//               <Input placeholder="Description" value={item.description}
//                 onChange={setLineItem(i, 'description')} className="flex-1" />
//               <Input placeholder="Amount" type="number" value={item.amount}
//                 onChange={setLineItem(i, 'amount')} className="w-28" />
//               {form.lineItems.length > 1 && (
//                 <button onClick={() => removeLine(i)} className="text-gray-300 hover:text-red-500 text-lg px-1">&times;</button>
//               )}
//             </div>
//           ))}
//           <div className="text-right text-sm text-gray-500 mt-2 space-y-0.5">
//             <div>Subtotal: {fmt(subtotal)}</div>
//             <div className="flex items-center justify-end gap-2">
//               <label className="text-xs">Include VAT (15%)</label>
//               <input type="checkbox" checked={form.vatIncluded}
//                 onChange={(e) => setForm(f => ({ ...f, vatIncluded: e.target.checked }))} />
//               {form.vatIncluded && <span>{fmt(vat)}</span>}
//             </div>
//             <div className="font-semibold text-gray-800">Total: {fmt(subtotal + vat)}</div>
//           </div>
//         </div>

//         <FormField label="Notes">
//           <textarea value={form.notes} onChange={setField('notes')} rows={2}
//             className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
//         </FormField>

//         <div className="flex justify-end gap-2">
//           <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
//           <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create invoice'}</Btn>
//         </div>
//       </Modal>
//     </div>
//   );
// }


import { useState } from 'react';
import api from '../api/api';
import { useFetch } from '../hooks/hooks';

const fmt = n => `R ${Number(n||0).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-ZA') : '—';
const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };
const inp = { width:'100%', padding:'9px 12px', fontSize:13.5, border:'1.5px solid #d1d5db', borderRadius:8, outline:'none', background:'#fff', color:'#111827', fontFamily:'inherit', boxSizing:'border-box' };
const INV_C = { draft:'#6b7280', sent:'#3b82f6', paid:'#10b981', overdue:'#ef4444', cancelled:'#9ca3af' };

const Btn = ({ children, onClick, variant='primary', size='md', disabled }) => {
  const S = { primary:{bg:'#3b82f6',co:'#fff',bd:'none'}, secondary:{bg:'#fff',co:'#374151',bd:'1px solid #d1d5db'}, success:{bg:'#ecfdf5',co:'#065f46',bd:'1px solid #a7f3d0'} }[variant]||{};
  return <button onClick={onClick} disabled={disabled} style={{ display:'inline-flex', alignItems:'center', gap:6, padding: size==='sm'?'5px 12px':'9px 18px', background:S.bg, color:S.co, border:S.bd, borderRadius:8, fontSize: size==='sm'?12:13.5, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1, fontFamily:'inherit', whiteSpace:'nowrap', transition:'background 0.12s' }}
    onMouseEnter={e=>{ if(!disabled&&variant==='primary') e.currentTarget.style.background='#2563eb'; }}
    onMouseLeave={e=>{ if(!disabled&&variant==='primary') e.currentTarget.style.background='#3b82f6'; }}
  >{children}</button>;
};

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(2px)' }} onClick={onClose}>
    <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }} onClick={e=>e.stopPropagation()}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid #e5e7eb' }}>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#111827', margin:0 }}>{title}</h2>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, color:'#9ca3af', cursor:'pointer', lineHeight:1 }}>×</button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>;
};

const Field = ({ label, required, children }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ display:'block', fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:5 }}>{label}{required&&<span style={{ color:'#ef4444', marginLeft:3 }}>*</span>}</label>
    {children}
  </div>
);

const TABS = [{ value:'',label:'All' },{ value:'draft',label:'Draft' },{ value:'sent',label:'Sent' },{ value:'overdue',label:'Overdue' },{ value:'paid',label:'Paid' }];
const EMPTY_FORM = { bill_to:'private', application_id:'', private_customer_id:'', dealership_id:'', subtotal:'', vat_included:true, due_date:'' };
const EMPTY_PAY  = { method:'eft', amount:'', reference:'' };

export default function Invoices() {
  const [tab, setTab]         = useState('');
  const [showNew, setShowNew] = useState(false);
  const [payModal, setPay]    = useState(null);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [payForm, setPayForm] = useState(EMPTY_PAY);
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState('');

  const { data, loading, refetch } = useFetch(`/invoices?status=${tab}&limit=100`, [tab]);
  const { data: allData }          = useFetch('/invoices?limit=1000');
  const { data: apps }             = useFetch('/applications?limit=200');
  const { data: privCusts }        = useFetch('/customers/private');
  const { data: dealerships }      = useFetch('/dealerships?limit=100');

  const set    = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const setPF  = k => e => setPayForm(f=>({...f,[k]:e.target.value}));
  const all    = allData?.invoices || [];
  const invs   = data?.invoices || [];
  const counts = { '':all.length, draft:all.filter(i=>i.status==='draft').length, sent:all.filter(i=>i.status==='sent').length, overdue:all.filter(i=>i.status==='overdue').length, paid:all.filter(i=>i.status==='paid').length };
  const sub    = parseFloat(form.subtotal)||0;
  const vat    = form.vat_included ? sub*0.15 : 0;

  const create = async () => {
    if (!form.application_id || !form.subtotal) return setErr('Application and amount required');
    if (form.bill_to==='private' && !form.private_customer_id) return setErr('Select a private customer');
    if (form.bill_to==='dealership' && !form.dealership_id) return setErr('Select a dealership');
    setSaving(true); setErr('');
    try {
      await api.post('/invoices', {
        application_id: parseInt(form.application_id), subtotal: parseFloat(form.subtotal),
        vat_included: form.vat_included, due_date: form.due_date || null,
        private_customer_id: form.bill_to==='private' ? parseInt(form.private_customer_id) : null,
        dealership_id:       form.bill_to==='dealership' ? parseInt(form.dealership_id) : null,
      });
      setShowNew(false); setForm(EMPTY_FORM); refetch();
    } catch(e) { setErr(e.response?.data?.message||'Failed to create'); }
    finally { setSaving(false); }
  };

  const recordPay = async () => {
    if (!payForm.amount) return;
    setSaving(true);
    try {
      await api.post(`/invoices/${payModal.id}/payments`, { amount:parseFloat(payForm.amount), method:payForm.method, reference:payForm.reference||null });
      setPay(null); setPayForm(EMPTY_PAY); refetch();
    } catch(e) { setErr(e.response?.data?.message||'Payment failed'); }
    finally { setSaving(false); }
  };

  const downloadPDF = async (id, number) => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType:'blob' });
      const url = URL.createObjectURL(new Blob([res.data],{type:'application/pdf'}));
      const a = document.createElement('a'); a.href=url; a.download=`${number}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert('PDF not available yet'); }
  };

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <p style={{ fontSize:12, color:'#9ca3af', marginBottom:6 }}>CRM / Invoices</p>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Invoices</h1>
          <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>Bill customers and dealerships for licensing services</p>
        </div>
        <Btn onClick={()=>setShowNew(true)}>＋ New Invoice</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:2, background:'#f1f5f9', padding:4, borderRadius:10, width:'fit-content', marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t.value} onClick={()=>setTab(t.value)} style={{ padding:'7px 14px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight: tab===t.value?500:400, background: tab===t.value?'#fff':'transparent', color: tab===t.value?'#111827':'#6b7280', boxShadow: tab===t.value?'0 1px 3px rgba(0,0,0,0.08)':'none', transition:'all 0.12s' }}>
            {t.label} <span style={{ marginLeft:6, padding:'1px 7px', borderRadius:99, fontSize:11, fontWeight:500, background: tab===t.value?'#dbeafe':'#e2e8f0', color: tab===t.value?'#1d4ed8':'#6b7280' }}>{counts[t.value]??0}</span>
          </button>
        ))}
      </div>

      <div style={card}>
        {loading ? <div style={{ padding:60, textAlign:'center', color:'#9ca3af' }}>Loading…</div>
        : !invs.length ? (
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🧾</div>
            <div style={{ fontSize:15, fontWeight:600, color:'#374151', marginBottom:6 }}>No invoices found</div>
            <div style={{ fontSize:13.5, color:'#6b7280', marginBottom:20 }}>Create your first invoice for a licensing application.</div>
            <Btn onClick={()=>setShowNew(true)}>＋ New Invoice</Btn>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>
                  {['Invoice #','Billed to','Application','Subtotal','VAT','Total','Status','Due','Actions'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invs.map(inv => {
                  const billed = inv.privateCustomer ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}` : inv.dealership?.name || '—';
                  const sc = INV_C[inv.status]||'#6b7280';
                  return (
                    <tr key={inv.id} style={{ borderBottom:'1px solid #f1f5f9', transition:'background 0.1s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:12.5, fontWeight:600, color:'#2563eb' }}>{inv.invoice_number}</td>
                      <td style={{ padding:'12px 16px', fontWeight:500 }}>{billed}</td>
                      <td style={{ padding:'12px 16px' }}>{inv.application_id ? <span style={{ fontSize:11.5, background:'#eff6ff', color:'#1d4ed8', padding:'2px 8px', borderRadius:99, fontWeight:500 }}>#{inv.application_id}</span> : '—'}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:12.5, color:'#6b7280' }}>{fmt(inv.subtotal)}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:12.5, color:'#6b7280' }}>{fmt(inv.vat)}</td>
                      <td style={{ padding:'12px 16px', fontFamily:'monospace', fontSize:13, fontWeight:700 }}>{fmt(inv.total)}</td>
                      <td style={{ padding:'12px 16px' }}><span style={{ fontSize:11.5, background:`${sc}18`, color:sc, padding:'3px 10px', borderRadius:99, fontWeight:500 }}>{inv.status}</span></td>
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontSize:12.5 }}>{fmtDate(inv.due_date)}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>downloadPDF(inv.id,inv.invoice_number)} title="Download PDF" style={{ padding:'5px 8px', background:'none', border:'1px solid #e5e7eb', borderRadius:7, cursor:'pointer', fontSize:13, color:'#6b7280', transition:'all 0.12s' }}
                            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#3b82f6'; e.currentTarget.style.color='#3b82f6'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280'; }}>
                            ⬇
                          </button>
                          {inv.status!=='paid' && inv.status!=='cancelled' && (
                            <button onClick={()=>{ setPay(inv); setPayForm({...EMPTY_PAY, amount:inv.total}); }} title="Record payment" style={{ padding:'5px 8px', background:'none', border:'1px solid #e5e7eb', borderRadius:7, cursor:'pointer', fontSize:13, color:'#6b7280', transition:'all 0.12s' }}
                              onMouseEnter={e=>{ e.currentTarget.style.borderColor='#10b981'; e.currentTarget.style.color='#10b981'; }}
                              onMouseLeave={e=>{ e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.color='#6b7280'; }}>
                              💳
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Invoice Modal */}
      <Modal open={showNew} onClose={()=>{setShowNew(false);setErr('');setForm(EMPTY_FORM);}} title="Create Invoice">
        {err && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 14px', marginBottom:16, color:'#b91c1c', fontSize:13.5 }}>⚠ {err}</div>}
        <Field label="Application" required>
          <select value={form.application_id} onChange={set('application_id')} style={inp}>
            <option value="">Select application…</option>
            {apps?.applications?.map(a => <option key={a.id} value={a.id}>#{a.id} — {a.app_type?.replace(/_/g,' ')} — {a.vehicle?`${a.vehicle.make} ${a.vehicle.model}`:'—'}</option>)}
          </select>
        </Field>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12.5, fontWeight:500, color:'#374151', marginBottom:8 }}>Bill to</div>
          <div style={{ display:'flex', gap:8 }}>
            {['private','dealership'].map(t => (
              <button key={t} onClick={()=>setForm(f=>({...f,bill_to:t,private_customer_id:'',dealership_id:''}))} style={{ padding:'7px 16px', borderRadius:8, border:`1.5px solid ${form.bill_to===t?'#3b82f6':'#d1d5db'}`, background:form.bill_to===t?'#eff6ff':'#fff', color:form.bill_to===t?'#1d4ed8':'#6b7280', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit', textTransform:'capitalize' }}>{t}</button>
            ))}
          </div>
        </div>
        {form.bill_to==='private' ? (
          <Field label="Private customer" required>
            <select value={form.private_customer_id} onChange={set('private_customer_id')} style={inp}>
              <option value="">Select customer…</option>
              {privCusts?.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </Field>
        ) : (
          <Field label="Dealership" required>
            <select value={form.dealership_id} onChange={set('dealership_id')} style={inp}>
              <option value="">Select dealership…</option>
              {dealerships?.dealerships?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <Field label="Subtotal (excl. VAT)" required>
            <input type="number" step="0.01" min="0" value={form.subtotal} onChange={set('subtotal')} placeholder="0.00" style={inp} />
          </Field>
          <Field label="Due date">
            <input type="date" value={form.due_date} onChange={set('due_date')} style={inp} />
          </Field>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <input type="checkbox" id="vat" checked={form.vat_included} onChange={e=>setForm(f=>({...f,vat_included:e.target.checked}))} style={{ width:16, height:16, accentColor:'#3b82f6' }} />
          <label htmlFor="vat" style={{ fontSize:13.5, color:'#374151', cursor:'pointer' }}>Include VAT (15%)</label>
        </div>
        {sub > 0 && (
          <div style={{ background:'#f8fafc', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
            {[['Subtotal', fmt(sub)], ['VAT (15%)', fmt(vat)], ['Total', fmt(sub+vat)]].map(([l,v],i) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize: i===2?15:13, fontWeight: i===2?700:400, color: i===2?'#111827':'#6b7280', borderTop: i===2?'1px solid #e5e7eb':undefined, paddingTop: i===2?8:undefined, marginBottom: i<2?6:0 }}>
                <span>{l}</span><span style={{ fontFamily:'monospace' }}>{v}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
          <Btn variant="secondary" onClick={()=>setShowNew(false)}>Cancel</Btn>
          <Btn onClick={create} disabled={saving}>{saving?'Creating…':'Create Invoice'}</Btn>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal open={!!payModal} onClose={()=>setPay(null)} title={`Record Payment — ${payModal?.invoice_number}`}>
        <div style={{ background:'#eff6ff', borderRadius:9, padding:'14px 16px', marginBottom:20 }}>
          <div style={{ fontSize:12, color:'#1d4ed8', fontWeight:500, marginBottom:2 }}>Invoice total</div>
          <div style={{ fontSize:22, fontWeight:700, color:'#111827', fontFamily:'monospace' }}>{fmt(payModal?.total)}</div>
        </div>
        <Field label="Payment method">
          <select value={payForm.method} onChange={setPF('method')} style={inp}>
            <option value="eft">EFT Transfer</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Amount" required>
            <input type="number" step="0.01" value={payForm.amount} onChange={setPF('amount')} style={inp} />
          </Field>
          <Field label="Reference (optional)">
            <input value={payForm.reference} onChange={setPF('reference')} placeholder="EFT ref / receipt #" style={inp} />
          </Field>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:8 }}>
          <Btn variant="secondary" onClick={()=>setPay(null)}>Cancel</Btn>
          <Btn variant="success" onClick={recordPay} disabled={saving}>{saving?'Recording…':'✓ Record Payment'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
