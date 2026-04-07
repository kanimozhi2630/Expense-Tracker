import React, { useState } from 'react';

const CreateGroupModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({ name: '', budget: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>Create New Group</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Group Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Weekend Trip"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Budget (₹)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g., 10000"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create</button>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
