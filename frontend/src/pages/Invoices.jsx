import { useState } from 'react';
import { FileText, Plus, Download, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks';
import {
  PageHeader, Btn, LoadingSpinner, EmptyState, StatusBadge,
  Modal, FormField, Input, Select
} from '../components/ui';

const fmt = (n) => `R ${Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

const SERVICE_TYPES = [
  { value: 'service', label: 'Vehicle Service' },
  { value: 'licence_renewal', label: 'Licence Renewal' },
  { value: 'roadworthy', label: 'Roadworthy Certificate' },
  { value: 'tyres', label: 'Tyre Replacement' },
  { value: 'repairs', label: 'Mechanical Repairs' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = {
  companyId: '', vehicleId: '', serviceType: 'service',
  lineItems: [{ description: '', amount: '' }],
  vatIncluded: true, dueDate: '', notes: '',
};

export default function Invoices() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useFetch(
    `/invoices?status=${statusFilter}&limit=50`,
    [statusFilter]
  );
  const { data: companies } = useFetch('/companies?limit=100');
  const { data: vehicles } = useFetch(
    form.companyId ? `/vehicles?companyId=${form.companyId}` : null,
    [form.companyId]
  );

  const setField = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const setLineItem = (i, k) => (e) => {
    const items = [...form.lineItems];
    items[i] = { ...items[i], [k]: k === 'amount' ? e.target.value : e.target.value };
    setForm(f => ({ ...f, lineItems: items }));
  };

  const addLine = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: '', amount: '' }] }));
  const removeLine = (i) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }));

  const subtotal = form.lineItems.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const vat = form.vatIncluded ? subtotal * 0.15 : 0;

  const handleSave = async () => {
    if (!form.companyId || !form.serviceType) return setError('Company and service type required');
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        lineItems: form.lineItems
          .filter(l => l.description && l.amount)
          .map(l => ({ description: l.description, amount: parseFloat(l.amount) })),
      };
      await api.post('/invoices', payload);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const downloadPDF = async (id, number) => {
    const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = `${number}.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const markPaid = async (id) => {
    await api.patch(`/invoices/${id}/mark-paid`);
    refetch();
  };

  const FILTERS = ['', 'issued', 'paid', 'overdue', 'draft'];
  const filterLabel = { '': 'All', issued: 'Issued', paid: 'Paid', overdue: 'Overdue', draft: 'Draft' };

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle={`${data?.total ?? 0} total`}
        action={<Btn onClick={() => setShowModal(true)}><Plus size={15} /> New invoice</Btn>}
      />

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              statusFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {filterLabel[f]}
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
                {['Invoice', 'Company', 'Vehicle', 'Service', 'Total', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-gray-700">{inv.companyId?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{inv.vehicleId?.registrationNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{inv.serviceType.replace('_', ' ')}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{fmt(inv.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => downloadPDF(inv._id, inv.invoiceNumber)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download PDF">
                        <Download size={13} />
                      </button>
                      {inv.status !== 'paid' && (
                        <button onClick={() => markPaid(inv._id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as paid">
                          <CheckCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Invoice Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); setForm(EMPTY_FORM); }} title="New Invoice">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Company *">
            <Select value={form.companyId} onChange={setField('companyId')}>
              <option value="">Select company</option>
              {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Vehicle">
            <Select value={form.vehicleId} onChange={setField('vehicleId')} disabled={!form.companyId}>
              <option value="">Select vehicle</option>
              {vehicles?.map(v => <option key={v._id} value={v._id}>{v.registrationNumber} — {v.make} {v.model}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Service type *">
            <Select value={form.serviceType} onChange={setField('serviceType')}>
              {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </FormField>
          <FormField label="Due date"><Input type="date" value={form.dueDate} onChange={setField('dueDate')} /></FormField>
        </div>

        {/* Line items */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Line items</label>
            <button onClick={addLine} className="text-xs text-blue-600 hover:underline">+ Add line</button>
          </div>
          {form.lineItems.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Description" value={item.description}
                onChange={setLineItem(i, 'description')} className="flex-1" />
              <Input placeholder="Amount" type="number" value={item.amount}
                onChange={setLineItem(i, 'amount')} className="w-28" />
              {form.lineItems.length > 1 && (
                <button onClick={() => removeLine(i)} className="text-gray-300 hover:text-red-500 text-lg px-1">&times;</button>
              )}
            </div>
          ))}
          <div className="text-right text-sm text-gray-500 mt-2 space-y-0.5">
            <div>Subtotal: {fmt(subtotal)}</div>
            <div className="flex items-center justify-end gap-2">
              <label className="text-xs">Include VAT (15%)</label>
              <input type="checkbox" checked={form.vatIncluded}
                onChange={(e) => setForm(f => ({ ...f, vatIncluded: e.target.checked }))} />
              {form.vatIncluded && <span>{fmt(vat)}</span>}
            </div>
            <div className="font-semibold text-gray-800">Total: {fmt(subtotal + vat)}</div>
          </div>
        </div>

        <FormField label="Notes">
          <textarea value={form.notes} onChange={setField('notes')} rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </FormField>

        <div className="flex justify-end gap-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create invoice'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
