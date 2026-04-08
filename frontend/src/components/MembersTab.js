import React from 'react';

const MembersTab = ({ group }) => {
  const members = group?.members || [];

  return (
    <div className="members-tab card">
      <h2>Group Members</h2>
      <p style={{ marginBottom: '16px' }}>
        {members.length} member{members.length !== 1 ? 's' : ''}
      </p>
      {members.length === 0 ? (
        <p>No members have been added to this group yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {members.map((member) => (
            <li key={member._id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <strong>{member.name || 'Unnamed member'}</strong>
              <div style={{ fontSize: '14px', color: '#666' }}>{member.email || 'No email provided'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MembersTab;
