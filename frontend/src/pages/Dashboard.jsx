import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useFetch } from '../hooks/hooks';
import { PageShell, StatCard, Card, CardHeader, Table, TR, TD, InvoiceStatusBadge, AppStatusBadge, Spinner, fmt } from '../components/ui/ui';

const icons = {
  revenue: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  outstanding: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  apps: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  vehicles: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h7a1 1 0 001-1z"/><path d="M5 12V7h10l4 5"/></svg>,
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f1117', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <div style={{ color: '#8b8fa8', fontSize: '12px', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: '#60a5fa', fontSize: '15px', fontWeight: 600 }}>{fmt(payload[0]?.value)}</div>
    </div>
  );
};

export default function Dashboard() {
  const { data, loading } = useFetch('/dashboard/summary');
  const { data: pending } = useFetch('/dashboard/pending');

  if (loading) return <PageShell><Spinner text="Loading dashboard…" /></PageShell>;
  const d = data || {};

  const vsLast = d.revenueLastMonth
    ? (((d.revenueThisMonth - d.revenueLastMonth) / d.revenueLastMonth) * 100).toFixed(1)
    : null;

  return (
    <PageShell>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#0f1117', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
          Operations Dashboard
        </h1>
        <p style={{ fontSize: '13.5px', color: '#7b82a0', margin: 0 }}>
          {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          label="Revenue this month" icon={icons.revenue} color="green"
          value={fmt(d.revenueThisMonth)}
          trend={vsLast ? parseFloat(vsLast) : null}
        />
        <StatCard
          label="Outstanding" icon={icons.outstanding} color={d.overdueCount ? 'red' : 'amber'}
          value={fmt(d.outstandingAmount)}
          sub={d.overdueCount ? `${d.overdueCount} overdue` : 'All current'}
        />
        <StatCard
          label="Active applications" icon={icons.apps} color="blue"
          value={d.totalApplications ?? 0}
          sub="All time"
        />
        <StatCard
          label="Registered vehicles" icon={icons.vehicles} color="purple"
          value={d.totalVehicles ?? 0}
          sub={`${d.totalDealerships ?? 0} dealerships`}
        />
      </div>

      {/* Charts + recent invoices row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '20px' }}>

        {/* Revenue chart */}
        <Card>
          <CardHeader title="Revenue — last 6 months" />
          <div style={{ padding: '20px' }}>
            {d.monthlyRevenue?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.monthlyRevenue} barSize={32} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ba3bf', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ba3bf', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `R${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)', radius: 4 }} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9cfe0', fontSize: '14px' }}>
                No payment data yet
              </div>
            )}
          </div>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader title="Recent invoices" />
          <div style={{ padding: '4px 0' }}>
            {d.recentInvoices?.length ? d.recentInvoices.map(inv => {
              const name = inv.privateCustomer
                ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}`
                : inv.dealership?.name || '—';
              return (
                <div key={inv.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 20px', borderBottom: '1px solid #f6f7fb',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#1a1d2e', fontFamily: "'DM Mono', monospace" }}>{inv.invoice_number}</div>
                    <div style={{ fontSize: '12px', color: '#9ba3bf', marginTop: '2px' }}>{name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f1117' }}>{fmt(inv.total)}</div>
                    <div style={{ marginTop: '3px' }}><InvoiceStatusBadge status={inv.status} /></div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#c9cfe0', fontSize: '13.5px' }}>No invoices yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Pending applications */}
      {pending?.length > 0 && (
        <Card>
          <CardHeader title={`Pending applications (${pending.length})`} />
          <Table headers={['#', 'Type', 'Vehicle', 'Customer', 'Status', 'Created']}>
            {pending.slice(0, 8).map(app => {
              const customer = app.privateCustomer
                ? `${app.privateCustomer.first_name} ${app.privateCustomer.last_name}`
                : app.dealershipCustomer
                  ? `${app.dealershipCustomer.first_name} ${app.dealershipCustomer.last_name}`
                  : '—';
              return (
                <TR key={app.id}>
                  <TD mono muted>#{app.id}</TD>
                  <TD>
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {app.app_type === 'new_registration' ? 'New Registration' : 'Ownership Transfer'}
                    </span>
                  </TD>
                  <TD muted>{app.vehicle ? `${app.vehicle.make} ${app.vehicle.model}` : '—'}</TD>
                  <TD>{customer}</TD>
                  <TD><AppStatusBadge status={app.status} /></TD>
                  <TD muted>{new Date(app.created_at).toLocaleDateString('en-ZA')}</TD>
                </TR>
              );
            })}
          </Table>
        </Card>
      )}
    </PageShell>
  );
}