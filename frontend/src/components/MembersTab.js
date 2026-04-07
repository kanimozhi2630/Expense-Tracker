import React, { useState } from 'react';
import axios from 'axios';

const MembersTab = ({ group, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
  const isCompleted = group.status === 'Completed';

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Finding user with email:', email);
      const userRes = await axios.get(`http://localhost:5000/api/auth/user-by-email/${email}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      console.log('User found:', userRes.data);
      
      console.log('Adding member to group:', group._id);
      const addRes = await axios.post(`http://localhost:5000/api/groups/${group._id}/members`, 
        { userId: userRes.data._id },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      console.log('Member added successfully:', addRes.data);
      
      setShowModal(false);
      setEmail('');
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('Error adding member:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    const isLeaving = memberId === currentUserId;
    if (!window.confirm(isLeaving ? 'Leave this group?' : 'Remove this member from the group?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${group._id}/members/${memberId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      if (isLeaving) {
        window.location.href = '/dashboard';
      } else {
        onUpdate();
      }
    } catch (err) {
      alert('Failed to ' + (isLeaving ? 'leave group' : 'remove member'));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Members</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          disabled={isCompleted}
          style={{ opacity: isCompleted ? 0.5 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }}
        >
          Add Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {group.members.map(member => (
          <div key={member._id} className="card" style={{ padding: '20px', position: 'relative' }}>
            {!isCompleted && (
              <>
                <button
                  onClick={() => setShowMenu(showMenu === member._id ? null : member._id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  ⋮
                </button>
                {showMenu === member._id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '10px',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      zIndex: 10,
                      minWidth: '120px'
                    }}
                  >
                    <button
                      onClick={() => { handleDeleteMember(member._id); setShowMenu(null); }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px'
                      }}
                    >
                      {member._id === currentUserId ? 'Leave Group' : 'Remove Member'}
                    </button>
                  </div>
                )}
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>{member.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{member.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>Member Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter member's email"
                  required
                />
              </div>
              {error && <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersTab;
