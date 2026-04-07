import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { groups, expenses as expensesAPI, chat as chatAPI } from '../utils/api';
import ExpensesTab from '../components/ExpensesTab';
import MembersTab from '../components/MembersTab';
import ChatTab from '../components/ChatTab';
import AnalysisTab from '../components/AnalysisTab';
import SplitTab from '../components/SplitTab';
import '../styles/Group.css';

const Group = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
    fetchChats();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const { data } = await groups.getById(id);
      setGroup(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await expensesAPI.getByGroup(id);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChats = async () => {
    try {
      const { data } = await chatAPI.getByGroup(id);
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!group) return <div className="loading">Loading...</div>;

  const percentage = (group.totalSpent / group.budget) * 100;
  const progressColor = percentage >= 100 ? 'var(--danger)' : percentage >= 80 ? 'var(--warning)' : 'var(--success)';

  const tabs = [
    { id: 'expenses', label: 'Expenses' },
    { id: 'members', label: 'Members' },
    { id: 'chat', label: 'Chat' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'split', label: 'Split' }
  ];

  return (
    <div className="group-page fade-in">
      <div className="group-container">
        <div className="group-top card">
          <h1>{group.name}</h1>
          <div className="group-budget-info">
            <div className="budget-item">
              <span>Budget</span>
              <strong>₹{group.budget}</strong>
            </div>
            <div className="budget-item">
              <span>Total Spent</span>
              <strong style={{ color: progressColor }}>₹{group.totalSpent.toFixed(2)}</strong>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%`, background: progressColor }}></div>
          </div>
          <p className="progress-text">{percentage.toFixed(1)}% of budget used</p>
          {percentage >= 100 && (
            <div className="warning-banner">⚠️ Budget exceeded!</div>
          )}
        </div>

        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'expenses' && <ExpensesTab groupId={id} expenses={expenses} onUpdate={fetchExpenses} groupStatus={group.status} />}
          {activeTab === 'members' && <MembersTab group={group} onUpdate={fetchGroup} />}
          {activeTab === 'chat' && <ChatTab groupId={id} chats={chats} onUpdate={fetchChats} groupStatus={group.status} />}
          {activeTab === 'analysis' && <AnalysisTab expenses={expenses} members={group.members} />}
          {activeTab === 'split' && <SplitTab group={group} expenses={expenses} onUpdate={fetchGroup} />}
        </div>
      </div>
    </div>
  );
};

export default Group;
