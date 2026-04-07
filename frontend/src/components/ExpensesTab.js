import React, { useState } from 'react';
import { expenses as expensesAPI } from '../utils/api';

const ExpensesTab = ({ groupId, expenses, onUpdate, groupStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await expensesAPI.create({ ...formData, group: groupId });
      setShowModal(false);
      setFormData({ description: '', amount: '', category: 'Food' });
      await onUpdate();
      
      // Check budget after update
      const { data: updatedGroup } = await require('../utils/api').groups.getById(groupId);
      if (updatedGroup.totalSpent > updatedGroup.budget) {
        alert(`⚠️ Budget Exceeded!\n\nBudget: ₹${updatedGroup.budget}\nTotal Spent: ₹${updatedGroup.totalSpent.toFixed(2)}\n\nPlease inform all group members!`);
      }
    } catch (err) {
      alert('Failed to add expense');
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expensesAPI.delete(expenseId);
      onUpdate();
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  const categories = ['Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping', 'Other'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Expenses</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          disabled={groupStatus === 'Completed'}
          style={{ opacity: groupStatus === 'Completed' ? 0.5 : 1, cursor: groupStatus === 'Completed' ? 'not-allowed' : 'pointer' }}
        >
          Add Expense
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {expenses.map(expense => (
          <div key={expense._id} className="card" style={{ padding: '16px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{expense.description}</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="badge badge-category">{expense.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    Paid by {expense.paidBy?.name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>₹{expense.amount}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowMenu(showMenu === expense._id ? null : expense._id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  ⋮
                </button>
                {showMenu === expense._id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      zIndex: 10,
                      minWidth: '120px'
                    }}
                  >
                    <button
                      onClick={() => { handleDelete(expense._id); setShowMenu(null); }}
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
                      Delete Expense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
            No expenses yet. Add your first expense!
          </p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '600' }}>Add Expense</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Dinner at restaurant"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Amount (₹)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 500"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Category</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesTab;
