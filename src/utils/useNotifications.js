import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing real-time notifications
 * Handles budget alerts, spending reminders, and system notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);

  /**
   * Add a new notification
   * @param {Object} notification - Notification object
   */
  const addNotification = useCallback((notification) => {
    if (!isEnabled) return;

    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 10 seconds for non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }
  }, [isEnabled]);

  /**
   * Remove a notification by ID
   * @param {string|number} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  /**
   * Mark notification as read
   * @param {string|number} id - Notification ID
   */
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Get unread notifications count
   */
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  /**
   * Check if browser supports notifications
   */
  const checkNotificationSupport = useCallback(() => {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async () => {
    if (!checkNotificationSupport()) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setIsEnabled(permission === 'granted');
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [checkNotificationSupport]);

  /**
   * Send browser notification
   * @param {Object} options - Notification options
   */
  const sendBrowserNotification = useCallback((options) => {
    if (!isEnabled || !checkNotificationSupport()) return;

    try {
      const notification = new Notification(options.title, {
        body: options.message,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'expense-tracker',
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick();
        }
      };

      return notification;
    } catch (error) {
      console.error('Error sending browser notification:', error);
      return null;
    }
  }, [isEnabled, checkNotificationSupport]);

  /**
   * Create budget alert notification
   * @param {Object} budget - Budget object
   * @param {number} currentSpending - Current spending amount
   * @param {number} threshold - Alert threshold percentage
   */
  const createBudgetAlert = useCallback((budget, currentSpending, threshold = 80) => {
    const percentage = (currentSpending / budget.amount) * 100;
    
    if (percentage >= threshold) {
      const notification = {
        type: 'budget_alert',
        title: 'Budget Alert',
        message: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget ($${budget.amount})`,
        severity: percentage >= 100 ? 'critical' : 'warning',
        category: budget.category,
        data: { budget, currentSpending, percentage },
        persistent: percentage >= 100,
        actions: [
          {
            label: 'View Details',
            action: 'view_budget'
          }
        ]
      };

      addNotification(notification);
      
      // Send browser notification for critical alerts
      if (percentage >= 100) {
        sendBrowserNotification({
          title: 'Budget Exceeded!',
          message: `You've exceeded your ${budget.category} budget by $${(currentSpending - budget.amount).toFixed(2)}`,
          requireInteraction: true
        });
      }
    }
  }, [addNotification, sendBrowserNotification]);

  /**
   * Create spending reminder notification
   * @param {Object} expense - Expense object
   * @param {number} dailyAverage - Daily spending average
   */
  const createSpendingReminder = useCallback((expense, dailyAverage) => {
    const notification = {
      type: 'spending_reminder',
      title: 'Spending Reminder',
      message: `You spent $${expense.amount} on ${expense.category}. Your daily average is $${dailyAverage.toFixed(2)}`,
      severity: 'info',
      category: expense.category,
      data: { expense, dailyAverage },
      persistent: false
    };

    addNotification(notification);
  }, [addNotification]);

  /**
   * Create achievement notification
   * @param {string} achievement - Achievement type
   * @param {Object} data - Achievement data
   */
  const createAchievementNotification = useCallback((achievement, data) => {
    const achievements = {
      budget_saved: {
        title: 'Budget Goal Achieved!',
        message: `Great job! You saved $${data.savedAmount} this month.`,
        severity: 'success'
      },
      streak_maintained: {
        title: 'Consistency Streak!',
        message: `You've tracked expenses for ${data.days} consecutive days.`,
        severity: 'success'
      },
      spending_reduced: {
        title: 'Spending Reduced!',
        message: `Your spending decreased by ${data.percentage}% compared to last month.`,
        severity: 'success'
      }
    };

    const achievementData = achievements[achievement];
    if (achievementData) {
      const notification = {
        type: 'achievement',
        title: achievementData.title,
        message: achievementData.message,
        severity: achievementData.severity,
        data,
        persistent: true,
        actions: [
          {
            label: 'View Achievement',
            action: 'view_achievement'
          }
        ]
      };

      addNotification(notification);
      
      // Send browser notification for achievements
      sendBrowserNotification({
        title: achievementData.title,
        message: achievementData.message,
        icon: '/favicon.ico'
      });
    }
  }, [addNotification, sendBrowserNotification]);

  // Initialize notification permission on mount
  useEffect(() => {
    if (checkNotificationSupport()) {
      setIsEnabled(Notification.permission === 'granted');
    }
  }, [checkNotificationSupport]);

  return {
    notifications,
    isEnabled,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    getUnreadCount,
    checkNotificationSupport,
    requestPermission,
    sendBrowserNotification,
    createBudgetAlert,
    createSpendingReminder,
    createAchievementNotification
  };
};
