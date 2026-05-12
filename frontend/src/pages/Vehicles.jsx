import { useState } from 'react';
import { Truck, Plus, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks';
import { PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select } from '../components/ui';

const EMPTY_FORM = {
  companyId: '', driverId: '', make: '', model: '', year: '',
  colour: '', registrationNumber: '', vinNumber: '',
  licenceExpiryDate: '', nextServiceDate: '', odometerKm: '',
};

const daysUntil = (date) => {
  if (!date) return null;
  return Math.ceil((new Date(date) - new Date()) / 86400000);
};

const ExpiryBadge = ({ date, label }) => {
  const days = daysUntil(date);
  if (days === null) return <span className="text-gray-300">—</span>;
  const cls = days <= 7 ? 'text-red-600 font-medium' : days <= 30 ? 'text-yellow-600' : 'text-gray-500';
  return (
    <span className={cls}>
      {new Date(date).toLocaleDateString('en-ZA')}
      {days <= 30 && <span className="ml-1 text-xs">({days}d)</span>}
    </span>
  );
};

export default function Vehicles() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: vehicles, loading, refetch } = useFetch('/vehicles');
  const { data: companies } = useFetch('/companies?limit=100');
  const { data: drivers } = useFetch(
    form.companyId ? `/drivers?companyId=${form.companyId}` : null,
    [form.companyId]
  );

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.companyId || !form.make || !form.model || !form.registrationNumber)
      return setError('Company, make, model and registration number are required');
    setSaving(true); setError('');
    try {
      await api.post('/vehicles', form);
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
                {['Registration', 'Vehicle', 'Company', 'Driver', 'Licence expiry', 'Next service', 'km'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((v) => {
                const licDays = daysUntil(v.licenceExpiryDate);
                const svcDays = daysUntil(v.nextServiceDate);
                const urgent = (licDays !== null && licDays <= 14) || (svcDays !== null && svcDays <= 14);
                return (
                  <tr key={v._id} className={`hover:bg-gray-50 ${urgent ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-1.5">
                      {urgent && <AlertCircle size={13} className="text-red-400" />}
                      {v.registrationNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3 text-gray-500">{v.companyId?.name}</td>
                    <td className="px-4 py-3 text-gray-500">{v.driverId?.fullName || '—'}</td>
                    <td className="px-4 py-3"><ExpiryBadge date={v.licenceExpiryDate} /></td>
                    <td className="px-4 py-3"><ExpiryBadge date={v.nextServiceDate} /></td>
                    <td className="px-4 py-3 text-gray-400">{v.odometerKm ? `${v.odometerKm.toLocaleString()} km` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add vehicle">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Company *">
            <Select value={form.companyId} onChange={set('companyId')}>
              <option value="">Select company</option>
              {companies?.companies?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Driver">
            <Select value={form.driverId} onChange={set('driverId')} disabled={!form.companyId}>
              <option value="">Select driver</option>
              {drivers?.map(d => <option key={d._id} value={d._id}>{d.fullName}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Make *"><Input value={form.make} onChange={set('make')} placeholder="Toyota" /></FormField>
          <FormField label="Model *"><Input value={form.model} onChange={set('model')} placeholder="Hilux" /></FormField>
          <FormField label="Year"><Input type="number" value={form.year} onChange={set('year')} placeholder="2021" /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Registration number *"><Input value={form.registrationNumber} onChange={set('registrationNumber')} placeholder="AB123GP" /></FormField>
          <FormField label="Colour"><Input value={form.colour} onChange={set('colour')} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Licence expiry"><Input type="date" value={form.licenceExpiryDate} onChange={set('licenceExpiryDate')} /></FormField>
          <FormField label="Next service date"><Input type="date" value={form.nextServiceDate} onChange={set('nextServiceDate')} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="VIN number"><Input value={form.vinNumber} onChange={set('vinNumber')} /></FormField>
          <FormField label="Odometer (km)"><Input type="number" value={form.odometerKm} onChange={set('odometerKm')} /></FormField>
        </div>
        <div className="flex justify-end gap-2 mt-1">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Add vehicle'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
