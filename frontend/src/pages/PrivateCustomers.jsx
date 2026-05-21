import { useState } from 'react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks/hooks';
import {
  PageShell, PageHeader, Card, Table, TR, TD, Btn,
  SearchBar, Modal, Field, FormRow, Input, EmptyState, Spinner, Alert
} from '../components/ui/ui';

const EMPTY = { first_name: '', last_name: '', id_number: '', phone: '', email: '', address: '' };

export default function PrivateCustomers() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const q = useDebounce(search);
  const { data: customers, loading, refetch } = useFetch(`/customers/private?search=${q}`, [q]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = c => {
    setEditItem(c);
    setForm({ first_name: c.first_name, last_name: c.last_name, id_number: c.id_number, phone: c.phone || '', email: c.email || '', address: c.address || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.id_number) return setError('First name, last name and ID number are required');
    setSaving(true); setError('');
    try {
      if (editItem) await api.put(`/customers/private/${editItem.id}`, form);
      else await api.post('/customers/private', form);
      setShowModal(false); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <PageShell>
      <PageHeader
        title="Private Customers"
        subtitle={`${customers?.length ?? 0} individual clients registered`}
        breadcrumb="CRM / Customers"
        action={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID…" />
            <Btn onClick={openAdd}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add Customer
            </Btn>
          </div>
        }
      />

      <Card>
        {loading ? <Spinner /> : !customers?.length ? (
          <EmptyState icon="👤" title="No private customers found"
            body={search ? 'Try a different search term.' : 'Add your first private customer.'}
            action={!search && <Btn onClick={openAdd}>Add Customer</Btn>}
          />
        ) : (
          <Table headers={['Name', 'SA ID Number', 'Phone', 'Email', 'Address', '']}>
            {customers.map(c => (
              <TR key={c.id} onClick={() => openEdit(c)}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 600, color: '#1d4ed8',
                    }}>
                      {c.first_name[0]}{c.last_name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{c.first_name} {c.last_name}</div>
                      <div style={{ fontSize: '11.5px', color: '#9ba3bf' }}>ID: {c.id_number}</div>
                    </div>
                  </div>
                </TD>
                <TD mono muted>{c.id_number}</TD>
                <TD muted>{c.phone || '—'}</TD>
                <TD muted>{c.email || '—'}</TD>
                <TD muted style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '—'}</TD>
                <TD>
                  <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500 }}>Edit</span>
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title={editItem ? 'Edit Customer' : 'Add Private Customer'}>
        <Alert type="error" message={error} />
        <FormRow cols={2}>
          <Field label="First name" required><Input value={form.first_name} onChange={set('first_name')} /></Field>
          <Field label="Last name" required><Input value={form.last_name} onChange={set('last_name')} /></Field>
        </FormRow>
        <FormRow>
          <Field label="SA ID Number" required hint="13-digit South African identity number">
            <Input value={form.id_number} onChange={set('id_number')} placeholder="8001015009087" maxLength={13}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '13.5px', letterSpacing: '1px' }} />
          </Field>
        </FormRow>
        <FormRow cols={2}>
          <Field label="Phone"><Input value={form.phone} onChange={set('phone')} placeholder="082 000 0000" /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        </FormRow>
        <FormRow>
          <Field label="Address"><Input value={form.address} onChange={set('address')} /></Field>
        </FormRow>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add Customer'}</Btn>
        </div>
      </Modal>
    </PageShell>
  );
}