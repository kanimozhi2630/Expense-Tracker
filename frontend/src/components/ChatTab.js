import React, { useState } from 'react';
import { chat as chatAPI } from '../utils/api';

const ChatTab = ({ groupId, chats, onUpdate, groupStatus }) => {
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCompleted = groupStatus === 'Completed';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await chatAPI.send({ group: groupId, message });
      setMessage('');
      onUpdate();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const handleDelete = async (chatId, deleteType) => {
    const message = deleteType === 'forMe' ? 'Delete this message for you?' : 'Delete this message for everyone?';
    if (!window.confirm(message)) return;
    try {
      await chatAPI.delete(chatId, deleteType);
      onUpdate();
      setShowMenu(null);
    } catch (err) {
      alert('Failed to delete message');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Group Chat</h2>
      
      <div style={{
        background: 'var(--card)',
        borderRadius: '16px',
        padding: '24px',
        minHeight: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {chats.map(chat => {
          const isOwn = chat.sender._id === currentUser.id;
          return (
            <div key={chat._id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isOwn ? 'var(--primary)' : '#E2E8F0',
                color: isOwn ? 'white' : 'var(--text)',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowMenu(showMenu === chat._id ? null : chat._id)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'transparent',
                    color: isOwn ? 'white' : 'var(--text)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    lineHeight: '1'
                  }}
                >
                  ⋮
                </button>
                {showMenu === chat._id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '25px',
                      right: '4px',
                      background: 'white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      zIndex: 10,
                      minWidth: '140px'
                    }}
                  >
                    <button
                      onClick={() => handleDelete(chat._id, 'forMe')}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '13px'
                      }}
                    >
                      Delete for me
                    </button>
                    {isOwn && (
                      <button
                        onClick={() => handleDelete(chat._id, 'forEveryone')}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '13px'
                        }}
                      >
                        Delete for everyone
                      </button>
                    )}
                  </div>
                )}
                {!isOwn && (
                  <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px', opacity: 0.8 }}>
                    {chat.sender.name}
                  </p>
                )}
                <p style={{ fontSize: '14px' }}>{chat.message}</p>
                <p style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
                  {new Date(chat.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        {chats.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', margin: 'auto' }}>
            No messages yet. Start the conversation!
          </p>
        )}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="input"
          placeholder={isCompleted ? "Group is completed" : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1 }}
          disabled={isCompleted}
        />
        <button type="submit" className="btn btn-primary" disabled={isCompleted} style={{ opacity: isCompleted ? 0.5 : 1 }}>Send</button>
      </form>
    </div>
  );
};

export default ChatTab;
