import React, { useState } from 'react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    customer_type: 'private', // or 'dealership'
    customer_id: '',
    app_type: 'new_registration',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to structure payload: 
    // if private, set private_customer_id
    // if dealership, set dealership_customer_id
    console.log("Submitting:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Create New Application</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Application Type</label>
        <select 
          className="w-full border p-2 rounded"
          onChange={(e) => setFormData({...formData, app_type: e.target.value})}
        >
          <option value="new_registration">New Registration</option>
          <option value="ownership_transfer">Ownership Transfer</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Customer Type</label>
        <div className="flex gap-4">
          <label>
            <input type="radio" name="ctype" checked={formData.customer_type === 'private'} 
                   onChange={() => setFormData({...formData, customer_type: 'private'})} /> Private
          </label>
          <label>
            <input type="radio" name="ctype" checked={formData.customer_type === 'dealership'} 
                   onChange={() => setFormData({...formData, customer_type: 'dealership'})} /> Dealership
          </label>
        </div>
      </div>

      {/* Inputs for Vehicle ID and Customer selection would go here */}

      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Submit Application
      </button>
    </form>
  );
};