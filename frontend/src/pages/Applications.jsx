import React, { useEffect, useState } from 'react';
import { applicationAPI } from '../../api/api';

const ApplicationList = () => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    applicationAPI.getAll().then(res => setApps(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Licensing Applications</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">New Application</button>
      </div>
      
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">App ID</th>
            <th className="p-3 text-left">Vehicle (VIN)</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Fee Paid</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-3">#{app.id}</td>
              <td className="p-3 font-mono text-sm">{app.vin}</td>
              <td className="p-3 capitalize">{app.app_type.replace('_', ' ')}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  app.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status}
                </span>
              </td>
              <td className="p-3">R {app.licensing_fee_paid || '0.00'}</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">View Docs</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;