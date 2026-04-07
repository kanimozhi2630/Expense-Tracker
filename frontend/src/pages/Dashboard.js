import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groups } from '../utils/api';
import CreateGroupModal from '../components/CreateGroupModal';
import NotificationBell from '../components/NotificationBell';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [groupList, setGroupList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, monthExpenses: 0 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await groups.getAll();
      setGroupList(data);
      const active = data.filter(g => g.status === 'Active').length;
      const monthExpenses = data.reduce((sum, g) => {
        const date = new Date(g.createdAt);
        return date.getMonth() === new Date().getMonth() ? sum + g.totalSpent : sum;
      }, 0);
      setStats({ total: data.length, active, monthExpenses });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await groups.create(groupData);
      setShowModal(false);
      fetchGroups();
    } catch (err) {
      alert('Failed to create group');
    }
  };

  const handleDeleteGroup = async (groupId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this group? All expenses and chats will be deleted.')) return;
    try {
      await groups.delete(groupId);
      fetchGroups();
    } catch (err) {
      alert('Failed to delete group');
    }
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>Welcome, {user.name} 👋</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <NotificationBell />
          <button className="btn btn-outline" onClick={() => { localStorage.clear(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(15, 118, 110, 0.1)' }}>
            <svg width="24" height="24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="stat-label">Total Groups</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
            <svg width="24" height="24" fill="none" stroke="var(--success)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div>
            <p className="stat-label">Active Groups</p>
            <h2 className="stat-value">{stats.active}</h2>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <svg width="24" height="24" fill="none" stroke="var(--warning)" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <p className="stat-label">This Month</p>
            <h2 className="stat-value">₹{stats.monthExpenses.toFixed(0)}</h2>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create New Group
        </button>
        <button className="btn btn-outline" onClick={() => setShowExistingModal(true)}>Use Existing Group</button>
      </div>

      <div className="groups-section">
        <h2>Your Groups</h2>
        <div className="groups-grid">
          {groupList.map(group => {
            const percentage = (group.totalSpent / group.budget) * 100;
            const progressColor = percentage >= 100 ? 'var(--danger)' : percentage >= 80 ? 'var(--warning)' : 'var(--success)';
            
            return (
              <div key={group._id} className="group-card card" onClick={() => navigate(`/group/${group._id}`)} style={{ position: 'relative' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === group._id ? null : group._id); }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px',
                    zIndex: 10
                  }}
                >
                  ⋮
                </button>
                {showMenu === group._id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '10px',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      zIndex: 20,
                      minWidth: '120px'
                    }}
                  >
                    <button
                      onClick={(e) => handleDeleteGroup(group._id, e)}
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
                      Delete Group
                    </button>
                  </div>
                )}
                <div className="group-header">
                  <h3>{group.name}</h3>
                  <span className={`badge badge-${group.status.toLowerCase()}`}>{group.status}</span>
                </div>
                <div className="group-stats">
                  <div className="group-stat">
                    <span>Budget</span>
                    <strong>₹{group.budget}</strong>
                  </div>
                  <div className="group-stat">
                    <span>Spent</span>
                    <strong>₹{group.totalSpent.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%`, background: progressColor }}></div>
                </div>
                <p className="progress-text">{percentage.toFixed(1)}% of budget used</p>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <CreateGroupModal onClose={() => setShowModal(false)} onCreate={handleCreateGroup} />}
      
      {showExistingModal && (
        <div className="modal-overlay" onClick={() => setShowExistingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Use Existing Group</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Select a group to reuse with new budget</p>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {groupList.map(group => (
                <div key={group._id} 
                  className="card" 
                  style={{ padding: '16px', marginBottom: '12px', cursor: 'pointer' }}
                  onClick={() => {
                    setShowExistingModal(false);
                    setShowModal(true);
                  }}
                >
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{group.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>
                    {group.members.length} members
                  </p>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={() => setShowExistingModal(false)} style={{ marginTop: '16px', width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
