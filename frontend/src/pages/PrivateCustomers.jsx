import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks/hooks';
import {
  PageHeader, SearchInput, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input
} from '../components/ui/ui';

const EMPTY_FORM = { first_name: '', last_name: '', id_number: '', phone: '', email: '', address: '' };

export default function PrivateCustomers() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search);
  const { data: customers, loading, refetch } = useFetch(
    `/customers/private?search=${debouncedSearch}`,
    [debouncedSearch]
  );

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (c) => {
    setEditItem(c);
    setForm({
      first_name: c.first_name, last_name: c.last_name, id_number: c.id_number,
      phone: c.phone || '', email: c.email || '', address: c.address || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.id_number)
      return setError('First name, last name and ID number are required');
    setSaving(true); setError('');
    try {
      if (editItem) {
        await api.put(`/customers/private/${editItem.id}`, form);
      } else {
        await api.post('/customers/private', form);
      }
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader
        title="Private Customers"
        subtitle={`${customers?.length ?? 0} registered`}
        action={<Btn onClick={openAdd}><Plus size={15} /> Add customer</Btn>}
      />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or ID number..." />
      </div>

      {loading ? <LoadingSpinner /> : !customers?.length ? (
        <EmptyState icon={Users} title="No private customers yet"
          body="Add your first private customer."
          action={<Btn onClick={openAdd}><Plus size={15} />Add customer</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'ID Number', 'Phone', 'Email', 'Address', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(c)}>
                  <td className="px-4 py-3 font-medium text-gray-900">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.id_number}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-[150px] truncate">{c.address || '—'}</td>
                  <td className="px-4 py-3 text-xs text-blue-500 hover:underline">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title={editItem ? 'Edit customer' : 'Add private customer'}>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name *"><Input value={form.first_name} onChange={set('first_name')} /></FormField>
          <FormField label="Last name *"><Input value={form.last_name} onChange={set('last_name')} /></FormField>
        </div>
        <FormField label="SA ID Number *">
          <Input value={form.id_number} onChange={set('id_number')} placeholder="8001015009087" maxLength={13} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} placeholder="082 000 0000" /></FormField>
          <FormField label="Email"><Input type="email" value={form.email} onChange={set('email')} /></FormField>
        </div>
        <FormField label="Address"><Input value={form.address} onChange={set('address')} /></FormField>
        <div className="flex justify-end gap-2 mt-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Save customer'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
