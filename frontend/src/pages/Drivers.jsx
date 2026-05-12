import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks';
import { PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select } from '../components/ui';

const EMPTY_FORM = { companyId: '', fullName: '', licenceNumber: '', licenceExpiry: '', phone: '', email: '' };

export default function Drivers() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: drivers, loading, refetch } = useFetch('/drivers');
  const { data: companies } = useFetch('/companies?limit=100');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.companyId || !form.fullName) return setError('Company and name are required');
    setSaving(true); setError('');
    try {
      await api.post('/drivers', form);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Drivers"
        subtitle={`${drivers?.length ?? 0} registered`}
        action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add driver</Btn>}
      />

      {loading ? <LoadingSpinner /> : !drivers?.length ? (
        <EmptyState icon={Users} title="No drivers yet"
          action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add driver</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Company', 'Licence number', 'Licence expiry', 'Phone', 'Email'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {drivers.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{d.fullName}</td>
                  <td className="px-4 py-3 text-gray-500">{d.companyId?.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{d.licenceNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {d.licenceExpiry ? new Date(d.licenceExpiry).toLocaleDateString('en-ZA') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{d.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{d.email || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add driver">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <FormField label="Company *">
          <Select value={form.companyId} onChange={set('companyId')}>
            <option value="">Select company</option>
            {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </Select>
        </FormField>
        <FormField label="Full name *"><Input value={form.fullName} onChange={set('fullName')} /></FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Licence number"><Input value={form.licenceNumber} onChange={set('licenceNumber')} /></FormField>
          <FormField label="Licence expiry"><Input type="date" value={form.licenceExpiry} onChange={set('licenceExpiry')} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} /></FormField>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add driver'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
