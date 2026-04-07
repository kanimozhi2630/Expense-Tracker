import React, { useState } from 'react';
import { groups } from '../utils/api';

const SplitTab = ({ group, expenses, onUpdate }) => {
  const [showResult, setShowResult] = useState(false);
  const [splitData, setSplitData] = useState(null);
  const isCompleted = group.status === 'Completed';

  const calculateSplit = () => {
    const memberCount = group.members.length;
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate splits for each expense
    const expenseSplits = expenses.map(expense => {
      const sharePerPerson = expense.amount / memberCount;
      const payer = expense.paidBy?.name || 'Unknown';
      const payerId = expense.paidBy?._id;
      
      const owes = group.members
        .filter(member => member._id !== payerId)
        .map(member => ({
          name: member.name,
          amount: sharePerPerson
        }));
      
      return {
        description: expense.description,
        amount: expense.amount,
        payer: payer,
        sharePerPerson: sharePerPerson,
        owes: owes
      };
    });

    // Calculate net balance for each member
    const memberBalances = {};
    group.members.forEach(member => {
      memberBalances[member.name] = {};
    });

    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / memberCount;
      const payer = expense.paidBy?.name;
      
      group.members.forEach(member => {
        if (member._id !== expense.paidBy?._id) {
          if (!memberBalances[member.name][payer]) {
            memberBalances[member.name][payer] = 0;
          }
          memberBalances[member.name][payer] += sharePerPerson;
        }
      });
    });

    // Convert to settlements array
    const settlements = [];
    Object.entries(memberBalances).forEach(([debtor, creditors]) => {
      Object.entries(creditors).forEach(([creditor, amount]) => {
        if (amount > 0.01) {
          settlements.push({ from: debtor, to: creditor, amount });
        }
      });
    });

    setSplitData({ totalExpense, expenseSplits, settlements });
    setShowResult(true);
  };

  const handleComplete = async () => {
    if (window.confirm('Mark this group as completed? This action cannot be undone.')) {
      try {
        await groups.update(group._id, { status: 'Completed' });
        onUpdate();
        alert('Group marked as completed!');
      } catch (err) {
        alert('Failed to update group');
      }
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Split Expenses</h2>

      {!showResult ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-light)', marginBottom: '24px' }}>
            Calculate how much each member owes or is owed
          </p>
          <button 
            className="btn btn-primary" 
            onClick={calculateSplit}
            disabled={isCompleted}
            style={{ opacity: isCompleted ? 0.5 : 1, cursor: isCompleted ? 'not-allowed' : 'pointer' }}
          >
            Split Now
          </button>
        </div>
      ) : (
        <div className="fade-in">
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Expense Breakdown</h3>
            {splitData.expenseSplits.map((split, idx) => (
              <div key={idx} style={{
                padding: '16px',
                background: 'var(--background)',
                borderRadius: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong>{split.description}</strong>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>₹{split.amount.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>
                  Paid by <strong>{split.payer}</strong> • Each person's share: ₹{split.sharePerPerson.toFixed(2)}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {split.owes.map((owe, i) => (
                    <div key={i}>• {owe.name} owes ₹{owe.amount.toFixed(2)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Total Expense</p>
              <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>
                ₹{splitData.totalExpense.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Settlements</h3>
            {splitData.settlements.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px' }}>
                All settled! Everyone has paid their share.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {splitData.settlements.map((settlement, idx) => (
                  <div key={idx} style={{
                    padding: '16px',
                    background: 'var(--background)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      <strong>{settlement.from}</strong> owes <strong>{settlement.to}</strong>
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary)' }}>
                      ₹{settlement.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {group.status === 'Active' && (
            <button
              className="btn btn-primary"
              onClick={handleComplete}
              style={{ marginTop: '24px', width: '100%' }}
              disabled={isCompleted}
            >
              Mark Group as Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SplitTab;
