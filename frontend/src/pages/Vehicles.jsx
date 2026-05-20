import { useState } from 'react';
import { Truck, Plus } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select
} from '../components/ui/ui';

const EMPTY_FORM = {
  owner_type: 'private',
  private_customer_id: '',
  dealership_customer_id: '',
  make: '', model: '', year: '', vin: '', reg_number: '',
};

export default function Vehicles() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: vehicles, loading, refetch } = useFetch('/vehicles');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealershipCustomers } = useFetch('/customers/dealership');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.make || !form.model || !form.year || !form.vin)
      return setError('Make, model, year and VIN are required');
    if (form.owner_type === 'private' && !form.private_customer_id)
      return setError('Please select a private customer');
    if (form.owner_type === 'dealership' && !form.dealership_customer_id)
      return setError('Please select a dealership customer');

    setSaving(true); setError('');
    try {
      const payload = {
        make: form.make, model: form.model, year: parseInt(form.year), vin: form.vin, reg_number: form.reg_number,
        private_customer_id:    form.owner_type === 'private'    ? form.private_customer_id    : null,
        dealership_customer_id: form.owner_type === 'dealership' ? form.dealership_customer_id : null,
      };
      await api.post('/vehicles', payload);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Vehicles"
        subtitle={`${vehicles?.length ?? 0} registered`}
        action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add vehicle</Btn>}
      />

      {loading ? <LoadingSpinner /> : !vehicles?.length ? (
        <EmptyState icon={Truck} title="No vehicles yet" body="Add your first vehicle."
          action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add vehicle</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Reg number', 'Vehicle', 'VIN', 'Owner', 'Owner type'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((v) => {
                const owner = v.privateCustomer
                  ? `${v.privateCustomer.first_name} ${v.privateCustomer.last_name}`
                  : v.dealershipCustomer
                    ? `${v.dealershipCustomer.first_name} ${v.dealershipCustomer.last_name} (${v.dealershipCustomer.dealership?.name || '—'})`
                    : '—';
                const ownerType = v.private_customer_id ? 'Private' : 'Dealership';
                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 font-mono text-xs">{v.reg_number || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{v.vin}</td>
                    <td className="px-4 py-3 text-gray-600">{owner}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        ownerType === 'Private' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>{ownerType}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); setForm(EMPTY_FORM); }} title="Add vehicle">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

        {/* Owner type toggle */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
          {['private', 'dealership'].map((t) => (
            <button key={t} onClick={() => setForm(f => ({ ...f, owner_type: t, private_customer_id: '', dealership_customer_id: '' }))}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors capitalize ${
                form.owner_type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >{t}</button>
          ))}
        </div>

        {form.owner_type === 'private' ? (
          <FormField label="Private customer *">
            <Select value={form.private_customer_id} onChange={set('private_customer_id')}>
              <option value="">Select customer</option>
              {privateCustomers?.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.id_number}</option>
              ))}
            </Select>
          </FormField>
        ) : (
          <FormField label="Dealership customer *">
            <Select value={form.dealership_customer_id} onChange={set('dealership_customer_id')}>
              <option value="">Select dealership customer</option>
              {dealershipCustomers?.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.dealership?.name || '—'}</option>
              ))}
            </Select>
          </FormField>
        )}

        <div className="grid grid-cols-3 gap-3">
          <FormField label="Make *"><Input value={form.make} onChange={set('make')} placeholder="Toyota" /></FormField>
          <FormField label="Model *"><Input value={form.model} onChange={set('model')} placeholder="Hilux" /></FormField>
          <FormField label="Year *"><Input type="number" value={form.year} onChange={set('year')} placeholder="2021" /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="VIN *"><Input value={form.vin} onChange={set('vin')} placeholder="AHTFB3EG900123456" /></FormField>
          <FormField label="Reg number"><Input value={form.reg_number} onChange={set('reg_number')} placeholder="AB 12 CD GP" /></FormField>
        </div>

        <div className="flex justify-end gap-2 mt-1">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add vehicle'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
