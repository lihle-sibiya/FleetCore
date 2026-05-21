import { useState } from 'react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageShell, PageHeader, Card, Table, TR, TD, Btn, InvoiceStatusBadge,
  TabBar, Modal, Field, FormRow, Input, Select, EmptyState, Spinner, Alert, fmt
} from '../components/ui/ui';

const EMPTY_FORM = {
  bill_to: 'private', application_id: '',
  private_customer_id: '', dealership_id: '',
  subtotal: '', vat_included: true, due_date: '',
};
const EMPTY_PAY = { method: 'eft', amount: '', reference: '' };

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [payForm, setPayForm] = useState(EMPTY_PAY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useFetch(`/invoices?status=${statusFilter}&limit=100`, [statusFilter]);
  const { data: allData } = useFetch('/invoices?limit=1000');
  const { data: applications } = useFetch('/applications?limit=200');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealerships } = useFetch('/dealerships?limit=100');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPay = k => e => setPayForm(f => ({ ...f, [k]: e.target.value }));

  const all = allData?.invoices || [];
  const counts = {
    '': all.length,
    draft: all.filter(i => i.status === 'draft').length,
    sent: all.filter(i => i.status === 'sent').length,
    overdue: all.filter(i => i.status === 'overdue').length,
    paid: all.filter(i => i.status === 'paid').length,
  };

  const TABS = [
    { value: '', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'paid', label: 'Paid' },
  ].map(t => ({ ...t, count: counts[t.value] }));

  const subtotal = parseFloat(form.subtotal) || 0;
  const vat = form.vat_included ? subtotal * 0.15 : 0;

  const handleCreate = async () => {
    if (!form.application_id || !form.subtotal) return setError('Application and amount are required');
    if (form.bill_to === 'private' && !form.private_customer_id) return setError('Select a private customer');
    if (form.bill_to === 'dealership' && !form.dealership_id) return setError('Select a dealership');
    setSaving(true); setError('');
    try {
      await api.post('/invoices', {
        application_id: parseInt(form.application_id),
        subtotal: parseFloat(form.subtotal),
        vat_included: form.vat_included,
        due_date: form.due_date || null,
        private_customer_id: form.bill_to === 'private' ? parseInt(form.private_customer_id) : null,
        dealership_id: form.bill_to === 'dealership' ? parseInt(form.dealership_id) : null,
      });
      setShowNew(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally { setSaving(false); }
  };

  const handlePayment = async () => {
    if (!payForm.amount) return;
    setSaving(true);
    try {
      await api.post(`/invoices/${payModal.id}/payments`, {
        amount: parseFloat(payForm.amount), method: payForm.method,
        reference: payForm.reference || null,
      });
      setPayModal(null); setPayForm(EMPTY_PAY); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally { setSaving(false); }
  };

  const downloadPDF = async (id, number) => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = `${number}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert('PDF generation failed'); }
  };

  const invoices = data?.invoices || [];

  return (
    <PageShell>
      <PageHeader
        title="Invoices"
        subtitle="Bill private customers and dealerships for licensing services"
        breadcrumb="CRM / Invoices"
        action={
          <Btn onClick={() => setShowNew(true)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Invoice
          </Btn>
        }
      />

      <TabBar tabs={TABS} active={statusFilter} onChange={setStatusFilter} />

      <Card>
        {loading ? <Spinner /> : !invoices.length ? (
          <EmptyState icon="📄" title="No invoices found" body="Create your first invoice for a licensing application."
            action={<Btn onClick={() => setShowNew(true)}>New Invoice</Btn>}
          />
        ) : (
          <Table headers={['Invoice #', 'Billed to', 'Application', 'Subtotal', 'VAT', 'Total', 'Status', 'Due', '']}>
            {invoices.map(inv => {
              const billedTo = inv.privateCustomer
                ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}`
                : inv.dealership?.name || '—';
              const appType = inv.application?.app_type === 'new_registration' ? 'New Reg' : 'Transfer';
              return (
                <TR key={inv.id}>
                  <TD mono style={{ color: '#2563eb', fontWeight: 500 }}>{inv.invoice_number}</TD>
                  <TD><div style={{ fontWeight: 500 }}>{billedTo}</div></TD>
                  <TD>
                    {inv.application && (
                      <span style={{
                        background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px',
                        borderRadius: '99px', fontSize: '11.5px', fontWeight: 500,
                      }}>{appType} #{inv.application_id}</span>
                    )}
                  </TD>
                  <TD mono muted>{fmt(inv.subtotal)}</TD>
                  <TD mono muted>{fmt(inv.vat)}</TD>
                  <TD mono style={{ fontWeight: 600 }}>{fmt(inv.total)}</TD>
                  <TD><InvoiceStatusBadge status={inv.status} /></TD>
                  <TD muted style={{ fontSize: '12px' }}>
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-ZA') : '—'}
                  </TD>
                  <TD>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={() => downloadPDF(inv.id, inv.invoice_number)}
                        title="Download PDF"
                        style={{
                          background: 'none', border: '1px solid #e2e6f3', borderRadius: '6px',
                          padding: '5px 8px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e6f3'; e.currentTarget.style.color = '#6b7280'; }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                      </button>
                      {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                        <button onClick={() => { setPayModal(inv); setPayForm({ ...EMPTY_PAY, amount: inv.total }); }}
                          title="Record payment"
                          style={{
                            background: 'none', border: '1px solid #e2e6f3', borderRadius: '6px',
                            padding: '5px 8px', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e6f3'; e.currentTarget.style.color = '#6b7280'; }}
                        >
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </TD>
                </TR>
              );
            })}
          </Table>
        )}
      </Card>

      {/* New Invoice Modal */}
      <Modal open={showNew} onClose={() => { setShowNew(false); setError(''); setForm(EMPTY_FORM); }} title="Create Invoice">
        <Alert type="error" message={error} />
        <FormRow>
          <Field label="Application" required>
            <Select value={form.application_id} onChange={set('application_id')}>
              <option value="">Select application…</option>
              {applications?.applications?.map(a => (
                <option key={a.id} value={a.id}>
                  #{a.id} — {a.app_type?.replace(/_/g, ' ')} — {a.vehicle ? `${a.vehicle.make} ${a.vehicle.model}` : '—'}
                </option>
              ))}
            </Select>
          </Field>
        </FormRow>

        {/* Bill to toggle */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Bill to</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['private', 'dealership'].map(t => (
              <button key={t}
                onClick={() => setForm(f => ({ ...f, bill_to: t, private_customer_id: '', dealership_id: '' }))}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                  borderColor: form.bill_to === t ? '#3b82f6' : '#d1d9f0',
                  background: form.bill_to === t ? '#eff6ff' : '#fff',
                  color: form.bill_to === t ? '#1d4ed8' : '#6b7280',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                }}
              >Private customer</button>
            ))[form.bill_to === 'private' ? 0 : 1]}
            {form.bill_to !== 'private' && (
              <button
                onClick={() => setForm(f => ({ ...f, bill_to: 'private', dealership_id: '' }))}
                style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid #d1d9f0', background: '#fff', color: '#6b7280', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
              >Private customer</button>
            )}
            {['private', 'dealership'].map(t => (
              <button key={`d-${t}`}
                onClick={() => setForm(f => ({ ...f, bill_to: 'dealership', private_customer_id: '' }))}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                  borderColor: form.bill_to === 'dealership' ? '#3b82f6' : '#d1d9f0',
                  background: form.bill_to === 'dealership' ? '#eff6ff' : '#fff',
                  color: form.bill_to === 'dealership' ? '#1d4ed8' : '#6b7280',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Dealership</button>
            )).slice(0, 1)}
          </div>
        </div>

        {form.bill_to === 'private' ? (
          <FormRow>
            <Field label="Private customer" required>
              <Select value={form.private_customer_id} onChange={set('private_customer_id')}>
                <option value="">Select customer…</option>
                {privateCustomers?.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                ))}
              </Select>
            </Field>
          </FormRow>
        ) : (
          <FormRow>
            <Field label="Dealership" required>
              <Select value={form.dealership_id} onChange={set('dealership_id')}>
                <option value="">Select dealership…</option>
                {dealerships?.dealerships?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </Field>
          </FormRow>
        )}

        <FormRow cols={2}>
          <Field label="Subtotal (excl. VAT)" required>
            <Input type="number" step="0.01" min="0" value={form.subtotal} onChange={set('subtotal')} placeholder="0.00" />
          </Field>
          <Field label="Due date">
            <Input type="date" value={form.due_date} onChange={set('due_date')} />
          </Field>
        </FormRow>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input type="checkbox" id="vat" checked={form.vat_included}
            onChange={e => setForm(f => ({ ...f, vat_included: e.target.checked }))}
            style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} />
          <label htmlFor="vat" style={{ fontSize: '13.5px', color: '#374151', cursor: 'pointer' }}>
            Include VAT (15%)
          </label>
        </div>

        {subtotal > 0 && (
          <div style={{ background: '#f8f9fc', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7b82a0', marginBottom: '6px' }}>
              <span>Subtotal</span><span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7b82a0', marginBottom: '8px' }}>
              <span>VAT (15%)</span><span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(vat)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#0f1117', borderTop: '1px solid #e8eaf2', paddingTop: '8px' }}>
              <span>Total</span><span style={{ fontFamily: "'DM Mono', monospace" }}>{fmt(subtotal + vat)}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={saving}>{saving ? 'Creating…' : 'Create Invoice'}</Btn>
        </div>
      </Modal>

      {/* Record Payment Modal */}
      <Modal open={!!payModal} onClose={() => { setPayModal(null); setError(''); }} title={`Record Payment — ${payModal?.invoice_number}`}>
        <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: 500, marginBottom: '2px' }}>Invoice total</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f1117', fontFamily: "'DM Mono', monospace" }}>{fmt(payModal?.total)}</div>
        </div>
        <FormRow>
          <Field label="Payment method">
            <Select value={payForm.method} onChange={setPay('method')}>
              <option value="eft">EFT Transfer</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </Select>
          </Field>
        </FormRow>
        <FormRow cols={2}>
          <Field label="Amount" required>
            <Input type="number" step="0.01" value={payForm.amount} onChange={setPay('amount')} />
          </Field>
          <Field label="Reference (optional)">
            <Input value={payForm.reference} onChange={setPay('reference')} placeholder="EFT ref / receipt #" />
          </Field>
        </FormRow>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Btn variant="secondary" onClick={() => setPayModal(null)}>Cancel</Btn>
          <Btn variant="success" onClick={handlePayment} disabled={saving}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            {saving ? 'Recording…' : 'Record Payment'}
          </Btn>
        </div>
      </Modal>
    </PageShell>
  );
}