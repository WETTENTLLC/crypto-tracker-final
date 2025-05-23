'use client';
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export default function MCPNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem('mcpNotifications');
    
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        
        // Convert timestamp strings back to Date objects
        const processedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        
        setNotifications(processedNotifications);
        updateUnreadCount(processedNotifications);
      } catch (err) {
        console.error('Error parsing stored notifications:', err);
      }
    }
    
    // Add a demo notification if none exist
    setTimeout(() => {
      if (notifications.length === 0) {
        addDemoNotification();
      }
    }, 3000);
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    updateUnreadCount(notifications);
    
    // Save notifications to localStorage whenever they change
    localStorage.setItem(
      'mcpNotifications',
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Add a demo notification to demonstrate functionality
  const addDemoNotification = () => {
    const demoNotification: Notification = {
      id: `demo_${Date.now()}`,
      type: 'info',
      title: 'MCP Integration Active',
      message: 'Your cryptocurrency tracker is now using real-time data with Model Context Protocol.',
      timestamp: new Date(),
      read: false,
      link: '/dashboard'
    };
    
    setNotifications(prev => [demoNotification, ...prev]);
  };

  // Count unread notifications
  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Format notification timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Get icon for notification type
  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
            <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center dark:bg-yellow-900">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900">
            <svg className="w-4 h-4 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none dark:text-gray-300 dark:hover:text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 z-20 w-80 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    {getNotificationIcon(notification.type)}
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.link && (
                          <a
                            href={notification.link}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
