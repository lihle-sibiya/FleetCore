import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks';
import {
  PageHeader, SearchInput, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input
} from '../components/ui';

const EMPTY_FORM = { name: '', registrationNumber: '', vatNumber: '', phone: '', email: '', address: '' };

export default function Companies() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search);
  const { data, loading, refetch } = useFetch(
    `/companies?search=${debouncedSearch}&limit=50`,
    [debouncedSearch]
  );

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name || !form.phone) return setError('Name and phone are required');
    setSaving(true); setError('');
    try {
      await api.post('/companies', form);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle={`${data?.total ?? 0} fleet clients`}
        action={
          <Btn onClick={() => setShowModal(true)}>
            <Plus size={15} /> Add company
          </Btn>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search companies..." />
      </div>

      {loading ? <LoadingSpinner /> : !data?.companies?.length ? (
        <EmptyState icon={Building2} title="No companies yet"
          body="Add your first fleet client to get started."
          action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />Add company</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Company', 'Reg number', 'Phone', 'Email', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.companies.map((co) => (
                <tr key={co._id} className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/companies/${co._id}`)}>
                  <td className="px-4 py-3 font-medium text-gray-900">{co.name}</td>
                  <td className="px-4 py-3 text-gray-500">{co.registrationNumber || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{co.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{co.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-300"><ChevronRight size={15} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title="Add company">
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <FormField label="Company name *"><Input value={form.name} onChange={set('name')} /></FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Reg number"><Input value={form.registrationNumber} onChange={set('registrationNumber')} /></FormField>
          <FormField label="VAT number"><Input value={form.vatNumber} onChange={set('vatNumber')} /></FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone *"><Input value={form.phone} onChange={set('phone')} /></FormField>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
        </div>
        <FormField label="Address"><Input value={form.address} onChange={set('address')} /></FormField>
        <div className="flex justify-end gap-2 mt-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save company'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
