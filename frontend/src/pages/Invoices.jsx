import { useState } from 'react';
import { FileText, Plus, Download, CheckCircle, CreditCard } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select
} from '../components/ui/ui';

const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const InvoiceStatusBadge = ({ status }) => {
  const styles = {
    draft:     'bg-gray-100 text-gray-600',
    sent:      'bg-yellow-100 text-yellow-800',
    paid:      'bg-green-100 text-green-800',
    overdue:   'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-400',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
      {status}
    </span>
  );
};

const EMPTY_FORM = {
  bill_to: 'private',
  application_id: '',
  private_customer_id: '',
  dealership_id: '',
  subtotal: '',
  vat_included: true,
  due_date: '',
};

const EMPTY_PAYMENT = { method: 'eft', amount: '', reference: '' };

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [payModal, setPayModal] = useState(null); // invoice to pay
  const [form, setForm] = useState(EMPTY_FORM);
  const [payForm, setPayForm] = useState(EMPTY_PAYMENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useFetch(
    `/invoices?status=${statusFilter}&limit=50`,
    [statusFilter]
  );
  const { data: applications } = useFetch('/applications?limit=100');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealerships } = useFetch('/dealerships?limit=100');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPay = (k) => (e) => setPayForm(f => ({ ...f, [k]: e.target.value }));

  const subtotal = parseFloat(form.subtotal) || 0;
  const vat = form.vat_included ? subtotal * 0.15 : 0;
  const total = subtotal + vat;

  const handleSave = async () => {
    if (!form.application_id || !form.subtotal) return setError('Application and amount are required');
    if (form.bill_to === 'private' && !form.private_customer_id) return setError('Select a private customer');
    if (form.bill_to === 'dealership' && !form.dealership_id) return setError('Select a dealership');
    setSaving(true); setError('');
    try {
      const payload = {
        application_id: parseInt(form.application_id),
        subtotal: parseFloat(form.subtotal),
        vat_included: form.vat_included,
        due_date: form.due_date || null,
        private_customer_id: form.bill_to === 'private'    ? parseInt(form.private_customer_id) : null,
        dealership_id:       form.bill_to === 'dealership' ? parseInt(form.dealership_id)       : null,
      };
      await api.post('/invoices', payload);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handlePayment = async () => {
    if (!payForm.amount) return;
    setSaving(true);
    try {
      await api.post(`/invoices/${payModal.id}/payments`, {
        amount: parseFloat(payForm.amount),
        method: payForm.method,
        reference: payForm.reference || null,
      });
      setPayModal(null); setPayForm(EMPTY_PAYMENT); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally { setSaving(false); }
  };

  const downloadPDF = async (id, number) => {
    const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = `${number}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const STATUS_FILTERS = [
    { value: '', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle={`${data?.total ?? 0} total`}
        action={<Btn onClick={() => setShowModal(true)}><Plus size={15} /> New invoice</Btn>}
      />

      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              statusFilter === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : !data?.invoices?.length ? (
        <EmptyState icon={FileText} title="No invoices" body="Create your first invoice."
          action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />New invoice</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Invoice #', 'Billed to', 'Subtotal', 'VAT', 'Total', 'Status', 'Due date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.invoices.map((inv) => {
                const billedTo = inv.privateCustomer
                  ? `${inv.privateCustomer.first_name} ${inv.privateCustomer.last_name}`
                  : inv.dealership?.name || '—';
                return (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{inv.invoice_number}</td>
                    <td className="px-4 py-3 text-gray-700">{billedTo}</td>
                    <td className="px-4 py-3 text-gray-500">{fmt(inv.subtotal)}</td>
                    <td className="px-4 py-3 text-gray-400">{fmt(inv.vat)}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{fmt(inv.total)}</td>
                    <td className="px-4 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('en-ZA') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => downloadPDF(inv.id, inv.invoice_number)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Download PDF">
                          <Download size={13} />
                        </button>
                        {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                          <button onClick={() => { setPayModal(inv); setPayForm({ ...EMPTY_PAYMENT, amount: inv.total }); }}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Record payment">
                            <CreditCard size={13} />
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

      {/* New Invoice Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); setForm(EMPTY_FORM); }} title="New Invoice">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

        <FormField label="Application *">
          <Select value={form.application_id} onChange={set('application_id')}>
            <option value="">Select application</option>
            {applications?.applications?.map(a => (
              <option key={a.id} value={a.id}>
                #{a.id} — {a.app_type?.replace(/_/g, ' ')} — {a.vehicle ? `${a.vehicle.make} ${a.vehicle.model}` : '—'}
              </option>
            ))}
          </Select>
        </FormField>

        {/* Bill to toggle */}
        <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg w-fit">
          {['private', 'dealership'].map((t) => (
            <button key={t}
              onClick={() => setForm(f => ({ ...f, bill_to: t, private_customer_id: '', dealership_id: '' }))}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors capitalize ${
                form.bill_to === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              Bill to {t}
            </button>
          ))}
        </div>

        {form.bill_to === 'private' ? (
          <FormField label="Private customer *">
            <Select value={form.private_customer_id} onChange={set('private_customer_id')}>
              <option value="">Select customer</option>
              {privateCustomers?.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </Select>
          </FormField>
        ) : (
          <FormField label="Dealership *">
            <Select value={form.dealership_id} onChange={set('dealership_id')}>
              <option value="">Select dealership</option>
              {dealerships?.dealerships?.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Subtotal (excl VAT) *">
            <Input type="number" step="0.01" value={form.subtotal} onChange={set('subtotal')} placeholder="0.00" />
          </FormField>
          <FormField label="Due date">
            <Input type="date" value={form.due_date} onChange={set('due_date')} />
          </FormField>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="vat" checked={form.vat_included}
            onChange={(e) => setForm(f => ({ ...f, vat_included: e.target.checked }))}
            className="rounded" />
          <label htmlFor="vat" className="text-sm text-gray-700">Include VAT (15%)</label>
        </div>

        {subtotal > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>VAT (15%)</span><span>{fmt(vat)}</span></div>
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1"><span>Total</span><span>{fmt(total)}</span></div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create invoice'}</Btn>
        </div>
      </Modal>

      {/* Record Payment Modal */}
      <Modal open={!!payModal} onClose={() => { setPayModal(null); setError(''); }} title={`Record Payment — ${payModal?.invoice_number}`}>
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          Invoice total: <strong>{fmt(payModal?.total)}</strong>
        </div>
        <FormField label="Payment method">
          <Select value={payForm.method} onChange={setPay('method')}>
            <option value="eft">EFT</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </Select>
        </FormField>
        <FormField label="Amount">
          <Input type="number" step="0.01" value={payForm.amount} onChange={setPay('amount')} />
        </FormField>
        <FormField label="Reference (optional)">
          <Input value={payForm.reference} onChange={setPay('reference')} placeholder="EFT ref / receipt #" />
        </FormField>
        <div className="flex justify-end gap-2 mt-2">
          <Btn variant="secondary" onClick={() => setPayModal(null)}>Cancel</Btn>
          <Btn onClick={handlePayment} disabled={saving}>{saving ? 'Saving...' : 'Record payment'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
