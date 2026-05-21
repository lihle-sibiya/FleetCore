import { useState } from 'react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageShell, PageHeader, Card, Table, TR, TD, Btn, AppStatusBadge, Badge,
  TabBar, Modal, Field, FormRow, Input, Select, EmptyState, Spinner, Alert
} from '../components/ui/ui';

const STATUS_STEPS = ['pending', 'documents_received', 'submitted_to_licensing', 'completed', 'cancelled'];
const TYPE_LABELS = { new_registration: 'New Registration', ownership_transfer: 'Ownership Transfer' };

const EMPTY_FORM = {
  app_type: 'new_registration', owner_type: 'private',
  vehicle_id: '', private_customer_id: '', dealership_customer_id: '',
};

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useFetch(
    `/applications?status=${statusFilter}&limit=100`,
    [statusFilter]
  );
  const { data: allData } = useFetch('/applications?limit=1000');
  const { data: vehicles } = useFetch('/vehicles');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealershipCustomers } = useFetch('/customers/dealership');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // Count by status for tabs
  const all = allData?.applications || [];
  const counts = {
    '': all.length,
    pending: all.filter(a => a.status === 'pending').length,
    documents_received: all.filter(a => a.status === 'documents_received').length,
    submitted_to_licensing: all.filter(a => a.status === 'submitted_to_licensing').length,
    completed: all.filter(a => a.status === 'completed').length,
  };

  const TABS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'documents_received', label: 'Docs Received' },
    { value: 'submitted_to_licensing', label: 'Submitted' },
    { value: 'completed', label: 'Completed' },
  ].map(t => ({ ...t, count: counts[t.value] }));

  const handleCreate = async () => {
    if (!form.vehicle_id) return setError('Vehicle is required');
    if (form.owner_type === 'private' && !form.private_customer_id) return setError('Select a private customer');
    if (form.owner_type === 'dealership' && !form.dealership_customer_id) return setError('Select a dealership customer');
    setSaving(true); setError('');
    try {
      await api.post('/applications', {
        app_type: form.app_type,
        vehicle_id: parseInt(form.vehicle_id),
        private_customer_id: form.owner_type === 'private' ? parseInt(form.private_customer_id) : null,
        dealership_customer_id: form.owner_type === 'dealership' ? parseInt(form.dealership_customer_id) : null,
      });
      setShowNew(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create application');
    } finally { setSaving(false); }
  };

  const advance = async (app) => {
    const idx = STATUS_STEPS.indexOf(app.status);
    if (idx < 0 || app.status === 'completed' || app.status === 'cancelled') return;
    await api.patch(`/applications/${app.id}/status`, { status: STATUS_STEPS[idx + 1] });
    refetch();
    if (detail?.id === app.id) setDetail({ ...detail, status: STATUS_STEPS[idx + 1] });
  };

  const apps = data?.applications || [];

  return (
    <PageShell>
      <PageHeader
        title="Applications"
        subtitle="Licensing and transfer of ownership applications"
        breadcrumb="CRM / Applications"
        action={
          <Btn onClick={() => setShowNew(true)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New Application
          </Btn>
        }
      />

      <TabBar tabs={TABS} active={statusFilter} onChange={setStatusFilter} />

      <Card>
        {loading ? <Spinner /> : !apps.length ? (
          <EmptyState icon="📋" title="No applications found" body="Create a new application to get started."
            action={<Btn onClick={() => setShowNew(true)}>New Application</Btn>}
          />
        ) : (
          <Table headers={['App #', 'Type', 'Vehicle', 'Customer', 'Status', 'Licence Fee', 'Created', '']}>
            {apps.map(app => {
              const customer = app.privateCustomer
                ? `${app.privateCustomer.first_name} ${app.privateCustomer.last_name}`
                : app.dealershipCustomer
                  ? `${app.dealershipCustomer.first_name} ${app.dealershipCustomer.last_name}`
                  : '—';
              const canAdvance = app.status !== 'completed' && app.status !== 'cancelled';
              return (
                <TR key={app.id} onClick={() => setDetail(app)}>
                  <TD mono muted>#{app.id}</TD>
                  <TD>
                    <Badge
                      label={app.app_type === 'new_registration' ? 'New Reg' : 'Transfer'}
                      color={app.app_type === 'new_registration' ? 'blue' : 'purple'}
                    />
                  </TD>
                  <TD>
                    <div style={{ fontWeight: 500 }}>
                      {app.vehicle ? `${app.vehicle.make} ${app.vehicle.model} ${app.vehicle.year}` : '—'}
                    </div>
                    {app.vehicle?.reg_number && <div style={{ fontSize: '11.5px', color: '#9ba3bf', fontFamily: "'DM Mono', monospace" }}>{app.vehicle.reg_number}</div>}
                  </TD>
                  <TD>{customer}</TD>
                  <TD><AppStatusBadge status={app.status} /></TD>
                  <TD mono muted>{app.licensing_fee_paid ? `R ${Number(app.licensing_fee_paid).toFixed(2)}` : '—'}</TD>
                  <TD muted>{new Date(app.created_at).toLocaleDateString('en-ZA')}</TD>
                  <TD>
                    {canAdvance && (
                      <Btn size="sm" variant="secondary" onClick={e => { e.stopPropagation(); advance(app); }}>
                        Advance →
                      </Btn>
                    )}
                  </TD>
                </TR>
              );
            })}
          </Table>
        )}
      </Card>

      {/* New application modal */}
      <Modal open={showNew} onClose={() => { setShowNew(false); setError(''); setForm(EMPTY_FORM); }} title="New Application">
        <Alert type="error" message={error} />
        <FormRow>
          <Field label="Application type" required>
            <Select value={form.app_type} onChange={set('app_type')}>
              <option value="new_registration">New Registration</option>
              <option value="ownership_transfer">Ownership Transfer</option>
            </Select>
          </Field>
        </FormRow>
        <FormRow>
          <Field label="Vehicle" required>
            <Select value={form.vehicle_id} onChange={set('vehicle_id')}>
              <option value="">Select vehicle…</option>
              {vehicles?.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} {v.year} — {v.reg_number || v.vin}</option>
              ))}
            </Select>
          </Field>
        </FormRow>

        {/* Owner type toggle */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Customer type</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['private', 'dealership'].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, owner_type: t, private_customer_id: '', dealership_customer_id: '' }))}
                style={{
                  padding: '7px 16px', borderRadius: '8px', border: '1px solid',
                  borderColor: form.owner_type === t ? '#3b82f6' : '#d1d9f0',
                  background: form.owner_type === t ? '#eff6ff' : '#fff',
                  color: form.owner_type === t ? '#1d4ed8' : '#6b7280',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
                }}
              >{t} customer</button>
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Btn variant="secondary" onClick={() => setShowNew(false)}>Cancel</Btn>
          <Btn onClick={handleCreate} disabled={saving}>{saving ? 'Creating…' : 'Create Application'}</Btn>
        </div>
      </Modal>

      {/* Detail panel modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Application #${detail?.id}`} width="600px">
        {detail && (
          <div>
            {/* Status pipeline */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#9ba3bf', fontWeight: 500, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Pipeline</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                {['pending', 'documents_received', 'submitted_to_licensing', 'completed'].map((s, i, arr) => {
                  const steps = ['Pending', 'Docs In', 'Submitted', 'Completed'];
                  const done = STATUS_STEPS.indexOf(detail.status) > i;
                  const active = detail.status === s;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        flex: 1, textAlign: 'center', padding: '6px 4px',
                        background: active ? '#3b82f6' : done ? '#dbeafe' : '#f1f3f9',
                        color: active ? '#fff' : done ? '#1d4ed8' : '#9ba3bf',
                        fontSize: '11.5px', fontWeight: active ? 600 : 400,
                        borderRadius: i === 0 ? '6px 0 0 6px' : i === arr.length - 1 ? '0 6px 6px 0' : '0',
                        borderRight: i < arr.length - 1 ? '1px solid #e8eaf2' : 'none',
                      }}>
                        {steps[i]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Application type', value: TYPE_LABELS[detail.app_type] },
                { label: 'Status', value: <AppStatusBadge status={detail.status} /> },
                { label: 'Vehicle', value: detail.vehicle ? `${detail.vehicle.make} ${detail.vehicle.model} ${detail.vehicle.year}` : '—' },
                { label: 'VIN', value: detail.vehicle?.vin || '—', mono: true },
                { label: 'Reg number', value: detail.vehicle?.reg_number || '—', mono: true },
                { label: 'Licensing fee paid', value: detail.licensing_fee_paid ? `R ${Number(detail.licensing_fee_paid).toFixed(2)}` : '—' },
                { label: 'Dept reference', value: detail.licensing_dept_ref || '—', mono: true },
                { label: 'Created', value: new Date(detail.created_at).toLocaleDateString('en-ZA') },
                detail.submitted_at && { label: 'Submitted', value: new Date(detail.submitted_at).toLocaleDateString('en-ZA') },
                detail.completed_at && { label: 'Completed', value: new Date(detail.completed_at).toLocaleDateString('en-ZA') },
              ].filter(Boolean).map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '11.5px', color: '#9ba3bf', fontWeight: 500, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', color: '#1a1d2e', fontFamily: item.mono ? "'DM Mono', monospace" : 'inherit', fontWeight: item.bold ? 600 : 400 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {detail.status !== 'completed' && detail.status !== 'cancelled' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #f0f2f8' }}>
                <Btn onClick={() => advance(detail)}>
                  Advance to next status →
                </Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageShell>
  );
}