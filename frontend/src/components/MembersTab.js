import React, { useState, useEffect, useCallback } from 'react';

const fetchNotifications = useCallback(async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/notifications', {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);

    if (data.length > 0 && data[0]._id !== lastNotificationId && !data[0].read) {
      setToastNotification(data[0]);
      setLastNotificationId(data[0]._id);
    }
  } catch (err) {
    console.error('Failed to fetch notifications');
  }
}, [lastNotificationId]);

useEffect(() => {
  fetchNotifications();
  const interval = setInterval(fetchNotifications, 5000);
  return () => clearInterval(interval);
}, [fetchNotifications]);