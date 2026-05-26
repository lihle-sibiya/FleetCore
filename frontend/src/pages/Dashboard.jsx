// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// import { DollarSign, Building2, Truck, AlertTriangle, Clock } from 'lucide-react';
// import { useFetch } from '../hooks';
// import { StatCard, StatusBadge, LoadingSpinner } from '../components/ui';

// const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
//       <div className="font-medium text-gray-700 mb-1">{label}</div>
//       <div className="text-blue-600">{fmt(payload[0]?.value)}</div>
//       <div className="text-gray-400 text-xs">{payload[1]?.value} jobs</div>
//     </div>
//   );
// };

// export default function Dashboard() {
//   const { data, loading } = useFetch('/dashboard/summary');
//   const { data: dueVehicles } = useFetch('/dashboard/due?days=30');

//   if (loading) return <LoadingSpinner text="Loading dashboard..." />;

//   const d = data || {};
//   const vsLastMonth = d.revenueLastMonth
//     ? (((d.revenueThisMonth - d.revenueLastMonth) / d.revenueLastMonth) * 100).toFixed(1)
//     : null;

//   return (
//     <div>
//       <div className="mb-6">
//         <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
//         <p className="text-sm text-gray-500 mt-0.5">Operations overview</p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           label="Revenue this month"
//           value={fmt(d.revenueThisMonth)}
//           sub={vsLastMonth ? `${vsLastMonth > 0 ? '+' : ''}${vsLastMonth}% vs last month` : undefined}
//           icon={DollarSign} color="green"
//         />
//         <StatCard
//           label="Outstanding"
//           value={fmt(d.outstandingAmount)}
//           sub={d.overdueCount ? `${d.overdueCount} overdue` : 'All current'}
//           icon={AlertTriangle} color={d.overdueCount ? 'red' : 'blue'}
//         />
//         <StatCard label="Companies" value={d.totalCompanies ?? '—'} icon={Building2} color="blue" />
//         <StatCard label="Vehicles" value={d.totalVehicles ?? '—'} icon={Truck} color="blue" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* Revenue chart */}
//         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
//           <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue — last 6 months</h2>
//           {d.monthlyRevenue?.length ? (
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={d.monthlyRevenue} barSize={28}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
//                   tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <div className="flex items-center justify-center h-[220px] text-sm text-gray-300">No data yet</div>
//           )}
//         </div>

//         {/* Recent invoices */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
//           <h2 className="text-sm font-semibold text-gray-800 mb-4">Recent invoices</h2>
//           <div className="space-y-3">
//             {d.recentInvoices?.length ? d.recentInvoices.map((inv) => (
//               <div key={inv._id} className="flex items-center justify-between">
//                 <div>
//                   <div className="text-sm font-medium text-gray-800">{inv.invoiceNumber}</div>
//                   <div className="text-xs text-gray-400">{inv.companyId?.name}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm font-medium text-gray-800">{fmt(inv.total)}</div>
//                   <StatusBadge status={inv.status} />
//                 </div>
//               </div>
//             )) : (
//               <p className="text-sm text-gray-300 py-4 text-center">No invoices yet</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Vehicles due soon */}
//       {dueVehicles?.length > 0 && (
//         <div className="mt-5 bg-white rounded-xl border border-yellow-100 shadow-sm p-5">
//           <div className="flex items-center gap-2 mb-4">
//             <Clock size={15} className="text-yellow-500" />
//             <h2 className="text-sm font-semibold text-gray-800">
//               Services / licences due in next 30 days ({dueVehicles.length})
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-xs text-gray-400 border-b border-gray-50">
//                   <th className="text-left pb-2">Vehicle</th>
//                   <th className="text-left pb-2">Company</th>
//                   <th className="text-left pb-2">Driver</th>
//                   <th className="text-left pb-2">Licence expiry</th>
//                   <th className="text-left pb-2">Next service</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {dueVehicles.slice(0, 6).map((v) => (
//                   <tr key={v._id} className="hover:bg-gray-50">
//                     <td className="py-2 font-medium text-gray-800">{v.registrationNumber}</td>
//                     <td className="py-2 text-gray-600">{v.companyId?.name}</td>
//                     <td className="py-2 text-gray-600">{v.driverId?.fullName || '—'}</td>
//                     <td className="py-2 text-gray-600">
//                       {v.licenceExpiryDate
//                         ? new Date(v.licenceExpiryDate).toLocaleDateString('en-ZA')
//                         : '—'}
//                     </td>
//                     <td className="py-2 text-gray-600">
//                       {v.nextServiceDate
//                         ? new Date(v.nextServiceDate).toLocaleDateString('en-ZA')
//                         : '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from 'react';
// import { applicationAPI } from '../api/api';

// const Dashboard = () => {
//   const [stats, setStats] = useState({ pending: 0, completed: 0, total: 0 });

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">FleetCore Overview</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
//           <h3 className="text-lg">Pending Applications</h3>
//           <p className="text-3xl font-bold">{stats.pending}</p>
//         </div>
//         <div className="bg-green-500 text-white p-6 rounded-lg shadow">
//           <h3 className="text-lg">Completed Today</h3>
//           <p className="text-3xl font-bold">{stats.completed}</p>
//         </div>
//         <div className="bg-purple-500 text-white p-6 rounded-lg shadow">
//           <h3 className="text-lg">Total Revenue</h3>
//           <p className="text-3xl font-bold">R 0.00</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFetch } from '../hooks/hooks';

const fmt = n => `R ${Number(n||0).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString('en-ZA') : '—';

const card = { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' };

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0d1117', borderRadius:9, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.25)' }}>
      <div style={{ color:'#7a8399', fontSize:12, marginBottom:4 }}>{label}</div>
      <div style={{ color:'#60a5fa', fontSize:16, fontWeight:600 }}>{fmt(payload[0]?.value)}</div>
    </div>
  );
};

const INV_COLORS = { draft:'#6b7280', sent:'#3b82f6', paid:'#10b981', overdue:'#ef4444', cancelled:'#9ca3af' };
const APP_COLORS = { pending:'#f59e0b', documents_received:'#3b82f6', submitted_to_licensing:'#6366f1', completed:'#10b981', cancelled:'#9ca3af' };

export default function Dashboard() {
  const { data, loading } = useFetch('/dashboard/summary');
  const { data: pending }  = useFetch('/dashboard/pending');

  const d = data || {};

  const vsLast = d.revenueLastMonth && d.revenueLastMonth > 0
    ? (((d.revenueThisMonth - d.revenueLastMonth) / d.revenueLastMonth) * 100).toFixed(1)
    : null;

  const STATS = [
    { label:'Revenue this month', value: fmt(d.revenueThisMonth), sub: vsLast ? `${vsLast>0?'+':''}${vsLast}% vs last month` : 'No data last month', icon:'💰', color:'#10b981', bg:'#ecfdf5' },
    { label:'Outstanding',        value: fmt(d.outstandingAmount),  sub: d.overdueCount ? `${d.overdueCount} overdue` : 'All current', icon:'⚠', color: d.overdueCount?'#ef4444':'#f59e0b', bg: d.overdueCount?'#fef2f2':'#fffbeb' },
    { label:'Applications',       value: d.totalApplications ?? 0,  sub:'All time',   icon:'📋', color:'#3b82f6', bg:'#eff6ff' },
    { label:'Vehicles registered',value: d.totalVehicles ?? 0,      sub:`${d.totalDealerships??0} dealerships`, icon:'🚗', color:'#8b5cf6', bg:'#f5f3ff' },
  ];

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:12 }}>
      <div style={{ width:36, height:36, border:'3px solid #dbeafe', borderTopColor:'#3b82f6', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
      <span style={{ color:'#9ca3af', fontSize:14 }}>Loading dashboard…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', maxWidth:1300, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', letterSpacing:'-0.4px', margin:0 }}>Operations Dashboard</h1>
        <p style={{ color:'#6b7280', fontSize:13.5, marginTop:4 }}>{new Date().toLocaleDateString('en-ZA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {STATS.map(s => (
          <div key={s.label} style={card}>
            <div style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <span style={{ fontSize:13, fontWeight:500, color:'#6b7280' }}>{s.label}</span>
                <div style={{ width:38, height:38, borderRadius:10, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
              </div>
              <div style={{ fontSize:26, fontWeight:700, color:'#111827', letterSpacing:'-0.5px', lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#9ca3af', marginTop:6 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent invoices */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginBottom:20 }}>

        {/* Revenue bar chart */}
        <div style={card}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ fontWeight:600, fontSize:14, color:'#111827' }}>Revenue — last 6 months</span>
          </div>
          <div style={{ padding:20 }}>
            {d.monthlyRevenue?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.monthlyRevenue} barSize={34} margin={{top:4,right:4,left:4,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize:12, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v=>`R${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTip />} cursor={{ fill:'rgba(59,130,246,0.06)', radius:4 }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#d1d5db', fontSize:14 }}>No payment data yet — run the seed to populate</div>
            )}
          </div>
        </div>

        {/* Recent invoices */}
        <div style={card}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
            <span style={{ fontWeight:600, fontSize:14, color:'#111827' }}>Recent invoices</span>
          </div>
          <div>
            {d.recentInvoices?.length ? d.recentInvoices.map(inv => {
              const name = inv.privateCustomer ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}` : inv.dealership?.name || '—';
              const clr  = INV_COLORS[inv.status] || '#6b7280';
              return (
                <div key={inv.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderBottom:'1px solid #f9fafb' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#111827', fontFamily:'monospace' }}>{inv.invoice_number}</div>
                    <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{name}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#111827' }}>{fmt(inv.total)}</div>
                    <span style={{ fontSize:11, background:`${clr}18`, color:clr, padding:'2px 8px', borderRadius:99, fontWeight:500 }}>{inv.status}</span>
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding:'40px 20px', textAlign:'center', color:'#d1d5db', fontSize:13.5 }}>No invoices yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Pending applications table */}
      {pending?.length > 0 && (
        <div style={card}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontWeight:600, fontSize:14, color:'#111827' }}>Pending applications</span>
            <span style={{ background:'#eff6ff', color:'#1d4ed8', fontSize:11.5, fontWeight:500, padding:'2px 10px', borderRadius:99 }}>{pending.length}</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13.5 }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e5e7eb' }}>
                  {['#','Type','Vehicle','Customer','Status','Created'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.slice(0,8).map(app => {
                  const customer = app.privateCustomer ? `${app.privateCustomer.first_name} ${app.privateCustomer.last_name}` : app.dealershipCustomer ? `${app.dealershipCustomer.first_name} ${app.dealershipCustomer.last_name}` : '—';
                  const sc = APP_COLORS[app.status]||'#6b7280';
                  return (
                    <tr key={app.id} style={{ borderBottom:'1px solid #f1f5f9' }}>
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontFamily:'monospace', fontSize:12.5 }}>#{app.id}</td>
                      <td style={{ padding:'12px 16px', color:'#374151', fontSize:13 }}>{app.app_type==='new_registration'?'New Registration':'Ownership Transfer'}</td>
                      <td style={{ padding:'12px 16px', fontWeight:500 }}>{app.vehicle?`${app.vehicle.make} ${app.vehicle.model}`:'—'}</td>
                      <td style={{ padding:'12px 16px', color:'#374151' }}>{customer}</td>
                      <td style={{ padding:'12px 16px' }}><span style={{ fontSize:11.5, background:`${sc}18`, color:sc, padding:'3px 10px', borderRadius:99, fontWeight:500 }}>{app.status?.replace(/_/g,' ')}</span></td>
                      <td style={{ padding:'12px 16px', color:'#9ca3af', fontSize:12.5 }}>{fmtDate(app.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}