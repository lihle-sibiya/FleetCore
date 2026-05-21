import { useState } from 'react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageShell, PageHeader, Card, Table, TR, TD, Btn, Badge,
  Modal, Field, FormRow, Input, Select, EmptyState, Spinner, Alert
} from '../components/ui/ui';

const EMPTY_FORM = {
  owner_type: 'private', private_customer_id: '', dealership_customer_id: '',
  make: '', model: '', year: '', vin: '', reg_number: '',
};

export default function Vehicles() {
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: vehicles, loading, refetch } = useFetch('/vehicles');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealershipCustomers } = useFetch('/customers/dealership');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.make || !form.model || !form.year || !form.vin) return setError('Make, model, year and VIN are required');
    if (form.owner_type === 'private' && !form.private_customer_id) return setError('Select a private customer');
    if (form.owner_type === 'dealership' && !form.dealership_customer_id) return setError('Select a dealership customer');
    setSaving(true); setError('');
    try {
      await api.post('/vehicles', {
        make: form.make, model: form.model, year: parseInt(form.year),
        vin: form.vin, reg_number: form.reg_number || null,
        private_customer_id: form.owner_type === 'private' ? parseInt(form.private_customer_id) : null,
        dealership_customer_id: form.owner_type === 'dealership' ? parseInt(form.dealership_customer_id) : null,
      });
      setShowNew(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vehicle');
    } finally { setSaving(false); }
  };

  return (
    <PageShell>
      <PageHeader
        title="Vehicles"
        subtitle={`${vehicles?.length ?? 0} vehicles registered in the system`}
        breadcrumb="CRM / Vehicles"
        action={
          <Btn onClick={() => setShowNew(true)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Vehicle
          </Btn>
        }
      />

      <Card>
        {loading ? <Spinner /> : !vehicles?.length ? (
          <EmptyState icon="🚗" title="No vehicles registered" body="Add a vehicle to start processing applications."
            action={<Btn onClick={() => setShowNew(true)}>Add Vehicle</Btn>}
          />
        ) : (
          <Table headers={['Registration', 'Vehicle', 'VIN', 'Owner', 'Owner type', 'Added']}>
            {vehicles.map(v => {
              const owner = v.privateCustomer
                ? `${v.privateCustomer.first_name} ${v.privateCustomer.last_name}`
                : v.dealershipCustomer
                  ? `${v.dealershipCustomer.first_name} ${v.dealershipCustomer.last_name}${v.dealershipCustomer.dealership ? ` · ${v.dealershipCustomer.dealership.name}` : ''}`
                  : '—';
              const ownerType = v.private_customer_id ? 'private' : 'dealership';
              return (
                <TR key={v.id}>
                  <TD mono style={{ color: '#2563eb', fontWeight: 600, fontSize: '13px' }}>{v.reg_number || '—'}</TD>
                  <TD>
                    <div style={{ fontWeight: 500 }}>{v.year} {v.make} {v.model}</div>
                  </TD>
                  <TD mono muted>{v.vin}</TD>
                  <TD>{owner}</TD>
                  <TD><Badge label={ownerType === 'private' ? 'Private' : 'Dealership'} color={ownerType === 'private' ? 'blue' : 'purple'} /></TD>
                  <TD muted>{new Date(v.created_at).toLocaleDateString('en-ZA')}</TD>
                </TR>
              );
            })}
          </Table>
        )}
      </Card>

      <Modal open={showNew} onClose={() => { setShowNew(false); setError(''); setForm(EMPTY_FORM); }} title="Register Vehicle">
        <Alert type="error" message={error} />

        {/* Owner type */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Owner type</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['private', 'dealership'].map(t => (
              <button key={t}
                onClick={() => setForm(f => ({ ...f, owner_type: t, private_customer_id: '', dealership_customer_id: '' }))}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                  borderColor: form.owner_type === t ? '#3b82f6' : '#d1d9f0',
                  background: form.owner_type === t ? '#eff6ff' : '#fff',
                  color: form.owner_type === t ? '#1d4ed8' : '#6b7280',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        {form.owner_type === 'private' ? (
          <FormRow>
            <Field label="Private customer" required>
              <Select value={form.private_customer_id} onChange={set('private_customer_id')}>
                <option value="">Select customer…</option>
                {privateCustomers?.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.id_number}</option>
                ))}
              </Select>
            </Field>
          </FormRow>
        ) : (
          <FormRow>
            <Field label="Dealership customer" required>
              <Select value={form.dealership_customer_id} onChange={set('dealership_customer_id')}>
                <option value="">Select dealership customer…</option>
                {dealershipCustomers?.map(c => (
                  <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                ))}
              </Select>
            </Field>
          </FormRow>
        )}

        <FormRow cols={3}>
          <Field label="Make" required><Input value={form.make} onChange={set('make')} placeholder="Toyota" /></Field>
          <Field label="Model" required><Input value={form.model} onChange={set('model')} placeholder="Hilux" /></Field>
          <Field label="Year" required><Input type="number" value={form.year} onChange={set('year')} placeholder="2021" min="1900" max="2030" /></Field>
        </FormRow>
        <FormRow cols={2}>
          <Field label="VIN" required hint="17-character vehicle identification number">
            <Input value={form.vin} onChange={set('vin')} placeholder="AHTFB3EG900123456" maxLength={17} style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }} />
          </Field>
          <Field label="Registration number" hint="Leave blank if not yet registered">
            <Input value={form.reg_number} onChange={set('reg_number')} placeholder="AB 12 CD GP" style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }} />
          </Field>
        </FormRow>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Register Vehicle'}</Btn>
        </div>
      </Modal>
    </PageShell>
  );
}