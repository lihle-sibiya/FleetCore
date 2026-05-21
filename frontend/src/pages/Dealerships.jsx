import { useState } from 'react';
import api from '../utils/api';
import { useFetch, useDebounce } from '../hooks/hooks';
import {
  PageShell, PageHeader, Card, Table, TR, TD, Btn,
  SearchBar, Modal, Field, FormRow, Input, EmptyState, Spinner, Alert
} from '../components/ui/ui';

const EMPTY = { name: '', contact_name: '', phone: '', email: '', address: '' };

export default function Dealerships() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const q = useDebounce(search);
  const { data, loading, refetch } = useFetch(`/dealerships?search=${q}&limit=50`, [q]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = d => {
    setEditItem(d);
    setForm({ name: d.name, contact_name: d.contact_name || '', phone: d.phone || '', email: d.email || '', address: d.address || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return setError('Dealership name is required');
    setSaving(true); setError('');
    try {
      if (editItem) await api.put(`/dealerships/${editItem.id}`, form);
      else await api.post('/dealerships', form);
      setShowModal(false); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <PageShell>
      <PageHeader
        title="Dealerships"
        subtitle={`${data?.total ?? 0} dealerships registered`}
        breadcrumb="CRM / Dealerships"
        action={
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search dealerships…" />
            <Btn onClick={openAdd}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add Dealership
            </Btn>
          </div>
        }
      />

      <Card>
        {loading ? <Spinner /> : !data?.dealerships?.length ? (
          <EmptyState icon="🏢" title="No dealerships found"
            body={search ? 'Try a different search term.' : 'Add your first dealership.'}
            action={!search && <Btn onClick={openAdd}>Add Dealership</Btn>}
          />
        ) : (
          <Table headers={['Dealership', 'Contact', 'Phone', 'Email', 'Address', '']}>
            {data.dealerships.map(d => (
              <TR key={d.id} onClick={() => openEdit(d)}>
                <TD>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: '#5b21b6',
                    }}>
                      {d.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 500 }}>{d.name}</div>
                  </div>
                </TD>
                <TD muted>{d.contact_name || '—'}</TD>
                <TD muted>{d.phone || '—'}</TD>
                <TD muted>{d.email || '—'}</TD>
                <TD muted style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.address || '—'}</TD>
                <TD><span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500 }}>Edit</span></TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); }} title={editItem ? 'Edit Dealership' : 'Add Dealership'}>
        <Alert type="error" message={error} />
        <FormRow>
          <Field label="Dealership name" required>
            <Input value={form.name} onChange={set('name')} placeholder="ABC Motors" />
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Contact person">
            <Input value={form.contact_name} onChange={set('contact_name')} placeholder="John Smith" />
          </Field>
        </FormRow>
        <FormRow cols={2}>
          <Field label="Phone"><Input value={form.phone} onChange={set('phone')} placeholder="011 000 0000" /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} /></Field>
        </FormRow>
        <FormRow>
          <Field label="Address"><Input value={form.address} onChange={set('address')} /></Field>
        </FormRow>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editItem ? 'Update' : 'Add Dealership'}</Btn>
        </div>
      </Modal>
    </PageShell>
  );
}