import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Toast = ({ notification, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        borderRadius: '12px',
        padding: '16px',
        minWidth: '300px',
        maxWidth: '400px',
        cursor: 'pointer',
        zIndex: 10000,
        animation: 'slideIn 0.3s ease-out',
        borderLeft: '4px solid var(--primary)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: 'var(--primary)' }}>
            {notification.type === 'group_created' ? '🎉 New Group' : `💬 ${notification.groupName || 'New Message'}`}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text)', wordBreak: 'break-word' }}>
            {notification.message}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'var(--text-light)',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notifications', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);

      // Show toast for new notification
      if (data.length > 0 && data[0]._id !== lastNotificationId && !data[0].read) {
        setToastNotification(data[0]);
        setLastNotificationId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.groupId) {
      navigate(`/group/${notification.groupId}`);
    }
    setShowDropdown(false);
  };

  const handleToastClick = () => {
    if (toastNotification) {
      handleNotificationClick(toastNotification);
      setToastNotification(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {toastNotification && (
        <Toast
          notification={toastNotification}
          onClose={() => setToastNotification(null)}
          onClick={handleToastClick}
        />
      )}

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '8px'
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'var(--danger)',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #F1F5F9',
                    cursor: 'pointer',
                    background: notification.read ? 'white' : '#F0FDFA',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'white' : '#F0FDFA'}
                >
                  <p style={{ fontSize: '14px', marginBottom: '4px', fontWeight: notification.read ? 'normal' : '600' }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
