import { useState } from 'react';
import { Building2, Plus, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks/hooks';
import {
  PageHeader, SearchInput, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input
} from '../components/ui/ui';

const EMPTY_FORM = { name: '', contact_name: '', phone: '', email: '', address: '' };

export default function Dealerships() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search);
  const { data, loading, refetch } = useFetch(
    `/dealerships?search=${debouncedSearch}&limit=50`,
    [debouncedSearch]
  );

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (d) => {
    setEditItem(d);
    setForm({ name: d.name, contact_name: d.contact_name || '', phone: d.phone || '', email: d.email || '', address: d.address || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return setError('Dealership name is required');
    setSaving(true); setError('');
    try {
      if (editItem) {
        await api.put(`/dealerships/${editItem.id}`, form);
      } else {
        await api.post('/dealerships', form);
      }
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Dealerships"
        subtitle={`${data?.total ?? 0} registered`}
        action={
          <Btn onClick={openAdd}>
            <Plus size={15} /> Add dealership
          </Btn>
        }
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search dealerships..." />
      </div>

      {loading ? <LoadingSpinner /> : !data?.dealerships?.length ? (
        <EmptyState icon={Building2} title="No dealerships yet"
          body="Add your first dealership to get started."
          action={<Btn onClick={openAdd}><Plus size={15} />Add dealership</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Dealership', 'Contact', 'Phone', 'Email', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.dealerships.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(d)}>
                  <td className="px-4 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-gray-500">{d.contact_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{d.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{d.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-300"><ChevronRight size={15} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title={editItem ? 'Edit dealership' : 'Add dealership'}>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <FormField label="Dealership name *"><Input value={form.name} onChange={set('name')} placeholder="ABC Motors" /></FormField>
        <FormField label="Contact person"><Input value={form.contact_name} onChange={set('contact_name')} /></FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} placeholder="011 000 0000" /></FormField>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
        </div>
        <FormField label="Address"><Input value={form.address} onChange={set('address')} /></FormField>
        <div className="flex justify-end gap-2 mt-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Save dealership'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
