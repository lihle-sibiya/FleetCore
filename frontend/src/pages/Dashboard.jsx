import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, Building2, Truck, AlertTriangle, ClipboardList } from 'lucide-react';
import { useFetch } from '../hooks/hooks';
import { StatCard, StatusBadge, LoadingSpinner } from '../components/ui/ui';

const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
      <div className="font-medium text-gray-700 mb-1">{label}</div>
      <div className="text-blue-600">{fmt(payload[0]?.value)}</div>
      <div className="text-gray-400 text-xs">{payload[1]?.value} jobs</div>
    </div>
  );
};

export default function Dashboard() {
  const { data, loading } = useFetch('/dashboard/summary');

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const d = data || {};
  const vsLastMonth = d.revenueLastMonth
    ? (((d.revenueThisMonth - d.revenueLastMonth) / d.revenueLastMonth) * 100).toFixed(1)
    : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Operations overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Revenue this month"
          value={fmt(d.revenueThisMonth)}
          sub={vsLastMonth ? `${vsLastMonth > 0 ? '+' : ''}${vsLastMonth}% vs last month` : undefined}
          icon={DollarSign} color="green"
        />
        <StatCard
          label="Outstanding"
          value={fmt(d.outstandingAmount)}
          sub={d.overdueCount ? `${d.overdueCount} overdue` : 'All current'}
          icon={AlertTriangle} color={d.overdueCount ? 'red' : 'blue'}
        />
        <StatCard label="Dealerships" value={d.totalDealerships ?? '—'} icon={Building2} color="blue" />
        <StatCard label="Vehicles" value={d.totalVehicles ?? '—'} icon={Truck} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue — last 6 months</h2>
          {d.monthlyRevenue?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.monthlyRevenue} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-sm text-gray-300">No data yet</div>
          )}
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Recent invoices</h2>
          <div className="space-y-3">
            {d.recentInvoices?.length ? d.recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-800">{inv.invoice_number}</div>
                  <div className="text-xs text-gray-400">
                    {inv.privateCustomer
                      ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}`
                      : inv.dealership?.name || '—'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{fmt(inv.total)}</div>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-300 py-4 text-center">No invoices yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending applications */}
      {d.totalApplications > 0 && (
        <div className="mt-5 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList size={15} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-gray-800">
              Total applications: {d.totalApplications}
            </h2>
          </div>
          <p className="text-xs text-gray-400">Go to Applications to manage statuses and documents.</p>
        </div>
      )}
    </div>
  );
}
