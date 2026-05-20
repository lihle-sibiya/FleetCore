import { useState } from 'react';
import { ClipboardList, Plus, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import { useFetch } from '../hooks/hooks';
import {
  PageHeader, Btn, LoadingSpinner, EmptyState, Modal, FormField, Input, Select
} from '../components/ui/ui';

const STATUS_STEPS = ['pending', 'documents_received', 'submitted_to_licensing', 'completed', 'cancelled'];
const TYPE_LABELS = { new_registration: 'New Registration', ownership_transfer: 'Ownership Transfer' };

const AppStatusBadge = ({ status }) => {
  const styles = {
    pending:                 'bg-yellow-100 text-yellow-800',
    documents_received:      'bg-blue-100 text-blue-800',
    submitted_to_licensing:  'bg-purple-100 text-purple-800',
    completed:               'bg-green-100 text-green-800',
    cancelled:               'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

const EMPTY_FORM = {
  app_type: 'new_registration',
  owner_type: 'private',
  vehicle_id: '',
  private_customer_id: '',
  dealership_customer_id: '',
};

export default function Applications() {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, loading, refetch } = useFetch(
    `/applications?status=${statusFilter}&app_type=${typeFilter}&limit=50`,
    [statusFilter, typeFilter]
  );
  const { data: vehicles } = useFetch('/vehicles');
  const { data: privateCustomers } = useFetch('/customers/private');
  const { data: dealershipCustomers } = useFetch('/customers/dealership');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.vehicle_id) return setError('Vehicle is required');
    if (form.owner_type === 'private' && !form.private_customer_id) return setError('Select a private customer');
    if (form.owner_type === 'dealership' && !form.dealership_customer_id) return setError('Select a dealership customer');
    setSaving(true); setError('');
    try {
      const payload = {
        app_type: form.app_type,
        vehicle_id: parseInt(form.vehicle_id),
        private_customer_id:    form.owner_type === 'private'    ? parseInt(form.private_customer_id)    : null,
        dealership_customer_id: form.owner_type === 'dealership' ? parseInt(form.dealership_customer_id) : null,
      };
      await api.post('/applications', payload);
      setShowModal(false); setForm(EMPTY_FORM); refetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create');
    } finally { setSaving(false); }
  };

  const advanceStatus = async (app) => {
    const idx = STATUS_STEPS.indexOf(app.status);
    if (idx === -1 || app.status === 'completed' || app.status === 'cancelled') return;
    const nextStatus = STATUS_STEPS[idx + 1];
    await api.patch(`/applications/${app.id}/status`, { status: nextStatus });
    refetch();
    if (detailItem?.id === app.id) setDetailItem({ ...detailItem, status: nextStatus });
  };

  const STATUS_FILTERS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'documents_received', label: 'Docs received' },
    { value: 'submitted_to_licensing', label: 'Submitted' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle={`${data?.total ?? 0} total`}
        action={<Btn onClick={() => setShowModal(true)}><Plus size={15} /> New application</Btn>}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                statusFilter === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All types</option>
          <option value="new_registration">New Registration</option>
          <option value="ownership_transfer">Ownership Transfer</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : !data?.applications?.length ? (
        <EmptyState icon={ClipboardList} title="No applications"
          action={<Btn onClick={() => setShowModal(true)}><Plus size={15} />New application</Btn>}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Type', 'Vehicle', 'Customer', 'Status', 'Fee paid', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.applications.map((app) => {
                const customer = app.privateCustomer
                  ? `${app.privateCustomer.first_name} ${app.privateCustomer.last_name}`
                  : app.dealershipCustomer
                    ? `${app.dealershipCustomer.first_name} ${app.dealershipCustomer.last_name}`
                    : '—';
                const vehicle = app.vehicle
                  ? `${app.vehicle.make} ${app.vehicle.model} (${app.vehicle.reg_number || app.vehicle.vin})`
                  : '—';
                const canAdvance = app.status !== 'completed' && app.status !== 'cancelled';
                return (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">#{app.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-700">{TYPE_LABELS[app.app_type]}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{vehicle}</td>
                    <td className="px-4 py-3 text-gray-600">{customer}</td>
                    <td className="px-4 py-3"><AppStatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-gray-500">
                      {app.licensing_fee_paid ? `R ${Number(app.licensing_fee_paid).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {canAdvance && (
                          <Btn size="sm" variant="secondary" onClick={() => advanceStatus(app)}>
                            Advance
                          </Btn>
                        )}
                        <button onClick={() => setDetailItem(app)} className="text-gray-400 hover:text-blue-600">
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Application Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError(''); setForm(EMPTY_FORM); }} title="New Application">
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

        <FormField label="Application type *">
          <Select value={form.app_type} onChange={set('app_type')}>
            <option value="new_registration">New Registration</option>
            <option value="ownership_transfer">Ownership Transfer</option>
          </Select>
        </FormField>

        <FormField label="Vehicle *">
          <Select value={form.vehicle_id} onChange={set('vehicle_id')}>
            <option value="">Select vehicle</option>
            {vehicles?.map(v => (
              <option key={v.id} value={v.id}>{v.make} {v.model} {v.year} — {v.reg_number || v.vin}</option>
            ))}
          </Select>
        </FormField>

        {/* Owner type */}
        <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-lg w-fit">
          {['private', 'dealership'].map((t) => (
            <button key={t} onClick={() => setForm(f => ({ ...f, owner_type: t, private_customer_id: '', dealership_customer_id: '' }))}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors capitalize ${
                form.owner_type === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >{t} customer</button>
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
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </Select>
          </FormField>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
          <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Create application'}</Btn>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailItem} onClose={() => setDetailItem(null)} title={`Application #${detailItem?.id}`}>
        {detailItem && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-400 text-xs">Type</span><div className="font-medium">{TYPE_LABELS[detailItem.app_type]}</div></div>
              <div><span className="text-gray-400 text-xs">Status</span><div><AppStatusBadge status={detailItem.status} /></div></div>
            </div>
            <div><span className="text-gray-400 text-xs">Vehicle</span>
              <div className="font-medium">{detailItem.vehicle ? `${detailItem.vehicle.make} ${detailItem.vehicle.model} ${detailItem.vehicle.year}` : '—'}</div>
              <div className="text-xs text-gray-400 font-mono">{detailItem.vehicle?.vin}</div>
            </div>
            {detailItem.licensing_fee_paid && (
              <div><span className="text-gray-400 text-xs">Licensing fee paid</span>
                <div className="font-medium">R {Number(detailItem.licensing_fee_paid).toFixed(2)}</div>
              </div>
            )}
            {detailItem.licensing_dept_ref && (
              <div><span className="text-gray-400 text-xs">Dept reference</span>
                <div className="font-medium">{detailItem.licensing_dept_ref}</div>
              </div>
            )}
            {detailItem.submitted_at && (
              <div><span className="text-gray-400 text-xs">Submitted</span>
                <div>{new Date(detailItem.submitted_at).toLocaleDateString('en-ZA')}</div>
              </div>
            )}
            {detailItem.completed_at && (
              <div><span className="text-gray-400 text-xs">Completed</span>
                <div>{new Date(detailItem.completed_at).toLocaleDateString('en-ZA')}</div>
              </div>
            )}
            {detailItem.status !== 'completed' && detailItem.status !== 'cancelled' && (
              <div className="pt-2 flex justify-end">
                <Btn onClick={() => advanceStatus(detailItem)}>Advance status</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
