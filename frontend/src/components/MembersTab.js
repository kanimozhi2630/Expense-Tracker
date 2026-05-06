import React, { useState } from 'react';
import { auth, groups } from '../utils/api';

const MembersTab = ({ group, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const members = group?.members || [];

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError('');
    try {
      // 1. Find user by email
      const { data: user } = await auth.getByEmail(email);
      
      // 2. Add user to group
      await groups.addMember(group._id, user._id);
      
      setEmail('');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="members-tab card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Group Members</h2>
        <span style={{ fontSize: '14px', color: '#666' }}>
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      <form onSubmit={handleAddMember} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <input
          type="email"
          placeholder="Enter user email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 15px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            outline: 'none'
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </form>

      {error && <p style={{ color: 'var(--danger)', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {members.length === 0 ? (
        <p>No members have been added to this group yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {members.map((member) => (
            <li key={member._id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {member.name ? member.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block' }}>{member.name || 'Unnamed member'}</strong>
                <div style={{ fontSize: '13px', color: '#666' }}>{member.email || 'No email provided'}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MembersTab;
