import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { calculateLinearRegression, findAnomalies, getBudgetRecommendations, askAI } from '../utils/statistics';

const AnalysisTab = ({ expenses, members }) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Existing Category and Member Data
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

  // --- DATA SCIENCE CALCULATIONS ---
  const dailyTotals = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + exp.amount;
    return acc;
  }, {});

  const timeSeriesData = Object.entries(dailyTotals)
    .map(([date, amount], index) => ({ day: index, date, amount }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const regression = calculateLinearRegression(timeSeriesData.map(d => ({ x: d.day, y: d.amount })));
  
  const forecastData = [...timeSeriesData];
  if (regression && timeSeriesData.length > 0) {
    const lastDay = timeSeriesData[timeSeriesData.length - 1].day;
    for (let i = 1; i <= 3; i++) {
      forecastData.push({
        day: lastDay + i,
        date: `Next Day ${i}`,
        amount: Math.max(0, regression.predict(lastDay + i)),
        isForecast: true
      });
    }
  }

  const anomalies = findAnomalies(expenses);
  const recommendations = getBudgetRecommendations(expenses);

  const handleAskAI = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const response = askAI(query, expenses, { regression, timeSeriesData });
    setAiResponse(response);
    setQuery('');
  };

  const COLORS = ['#0F766E', '#14B8A6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];
  const highestCategory = categoryData.reduce((max, item) => item.value > max.value ? item : max, { value: 0 });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Expense Analysis</h2>
        <span style={{ fontSize: '12px', background: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
          AI Powered
        </span>
      </div>

      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '40px' }}>
          No expenses to analyze yet.
        </p>
      ) : (
        <>
          {/* Ask AI Section */}
          <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--primary)', background: '#f0fdfa' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🤖</span> Ask AI about your Finances
            </h3>
            <form onSubmit={handleAskAI} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask e.g. 'Predict my future spending' or 'How much spent on Food?'"
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
              />
              <button type="submit" style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Ask
              </button>
            </form>
            {aiResponse && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'white', borderRadius: '6px', borderLeft: '4px solid var(--primary)', animation: 'fadeIn 0.3s' }}>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>{aiResponse}</p>
              </div>
            )}
          </div>

          {/* Top Insights Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid var(--primary)' }}>
              <p style={{ fontSize: '12px', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Highest Spending</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>{highestCategory.name}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>₹{highestCategory.value.toFixed(2)}</p>
            </div>

            {anomalies.length > 0 && (
              <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444' }}>
                <p style={{ fontSize: '12px', color: '#EF4444', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>⚠️ Smart Alert</p>
                <p style={{ fontSize: '14px', fontWeight: '500' }}>{anomalies.length} Unusual transactions detected</p>
                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Review high-value items in {anomalies[0].category}</p>
              </div>
            )}

            <div className="card" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #8B5CF6' }}>
              <p style={{ fontSize: '12px', color: '#8B5CF6', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Budget Tip</p>
              <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{recommendations[0]}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* 1. Category Chart */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 2. Predictive Forecasting Chart */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Spending Forecast</h3>
                <span style={{ fontSize: '10px', color: 'var(--primary)' }}>Linear Regression Model</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--primary)" 
                    strokeWidth={2}
                    dot={(props) => props.payload.isForecast ? <circle cx={props.cx} cy={props.cy} r={4} fill="#8B5CF6" /> : <circle cx={props.cx} cy={props.cy} r={3} fill="var(--primary)" />}
                    strokeDasharray={(props) => props.payload.isForecast ? "5 5" : "0"}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px', textAlign: 'center' }}>
                Dashed line indicates <span style={{ color: '#8B5CF6', fontWeight: '600' }}>predicted</span> spending for next 3 days.
              </p>
            </div>

            {/* 3. Member Contributions */}
            <div className="card">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Member Contributions</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={memberData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 4. Anomaly List */}
            {anomalies.length > 0 && (
              <div className="card">
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Anomalous Transactions</h3>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {anomalies.map((anno, i) => (
                    <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500' }}>{anno.description}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>{anno.category}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#EF4444' }}>₹{anno.amount}</p>
                        <span style={{ fontSize: '10px', padding: '2px 6px', background: '#FEE2E2', color: '#EF4444', borderRadius: '10px' }}>
                          Z-Score: {anno.zScore.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisTab;
