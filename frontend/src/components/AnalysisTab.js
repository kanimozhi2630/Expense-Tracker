import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalysisTab = ({ expenses, members }) => {
  const categoryData = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, []);

  const memberData = members.map(member => {
    const total = expenses
      .filter(exp => exp.paidBy?._id === member._id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { name: member.name, amount: total };
  });

  const COLORS = ['#0F766E', '#14B8A6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

  const highestCategory = categoryData.reduce((max, item) => item.value > max.value ? item : max, { value: 0 });

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Expense Analysis</h2>

      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
          No expenses to analyze yet.
        </p>
      ) : (
        <>
          {highestCategory.value > 0 && (
            <div className="card" style={{ marginBottom: '24px', padding: '16px', background: 'rgba(20, 184, 166, 0.1)' }}>
              <p style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600' }}>
                💡 Highest spending category: {highestCategory.name} (₹{highestCategory.value.toFixed(2)})
              </p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Member Contributions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisTab;
