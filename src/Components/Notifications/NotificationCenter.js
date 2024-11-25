import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * Notification Center Component
 * Displays real-time notifications with different severities and actions
 */
const NotificationCenter = ({ 
  notifications = [], 
  onMarkAsRead, 
  onRemove, 
  onMarkAllAsRead, 
  onClearAll,
  onAction 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleActionClick = (notification, action) => {
    if (onAction) {
      onAction(notification, action);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        );
      case 'success':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <NotificationContainer>
      {/* Notification Bell */}
      <NotificationBell onClick={() => setIsOpen(!isOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {unreadCount > 0 && (
          <NotificationBadge>
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </NotificationBell>

      {/* Notification Panel */}
      {isOpen && (
        <NotificationPanel>
          <PanelHeader>
            <h3>Notifications</h3>
            <div className="header-actions">
              {unreadCount > 0 && (
                <button onClick={onMarkAllAsRead} className="mark-all-read">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={onClearAll} className="clear-all">
                  Clear all
                </button>
              )}
            </div>
          </PanelHeader>

          <NotificationList>
            {notifications.length === 0 ? (
              <EmptyState>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p>No notifications</p>
                <span>You're all caught up!</span>
              </EmptyState>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  severity={notification.severity}
                  read={notification.read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <NotificationIcon severity={notification.severity}>
                    {getSeverityIcon(notification.severity)}
                  </NotificationIcon>
                  
                  <NotificationContent>
                    <NotificationTitle>{notification.title}</NotificationTitle>
                    <NotificationMessage>{notification.message}</NotificationMessage>
                    <NotificationMeta>
                      <span className="time">{formatTime(notification.timestamp)}</span>
                      {notification.category && (
                        <span className="category">{notification.category}</span>
                      )}
                    </NotificationMeta>
                  </NotificationContent>

                  <NotificationActions>
                    <button
                      className="close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notification.id);
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </NotificationActions>

                  {notification.actions && notification.actions.length > 0 && (
                    <NotificationActionButtons>
                      {notification.actions.map((action, index) => (
                        <button
                          key={index}
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(notification, action);
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </NotificationActionButtons>
                  )}
                </NotificationItem>
              ))
            )}
          </NotificationList>
        </NotificationPanel>
      )}
    </NotificationContainer>
  );
};

// Styled Components
const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const NotificationBell = styled.button`
  position: relative;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
  transform: translate(25%, -25%);
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1001;
  overflow: hidden;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    width: 300px;
    right: 0;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;

  h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;

    button {
      background: none;
      border: none;
      font-size: 0.75rem;
      color: #64748b;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      &.mark-all-read {
        color: #3b82f6;
      }

      &.clear-all {
        color: #ef4444;
      }
    }
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #64748b;

  svg {
    margin-bottom: 0.75rem;
    opacity: 0.5;
  }

  p {
    margin: 0 0 0.25rem 0;
    font-weight: 500;
    color: #374151;
  }

  span {
    font-size: 0.75rem;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }

  ${props => !props.read && `
    background: #f0f9ff;
    border-left: 3px solid #3b82f6;
  `}

  ${props => props.severity === 'critical' && `
    border-left-color: #ef4444;
    background: ${props.read ? '#fef2f2' : '#fef2f2'};
  `}

  ${props => props.severity === 'warning' && `
    border-left-color: #f59e0b;
    background: ${props.read ? '#fffbeb' : '#fffbeb'};
  `}

  ${props => props.severity === 'success' && `
    border-left-color: #10b981;
    background: ${props.read ? '#f0fdf4' : '#f0fdf4'};
  `}
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;

  ${props => props.severity === 'critical' && `
    background: #ef4444;
  `}

  ${props => props.severity === 'warning' && `
    background: #f59e0b;
  `}

  ${props => props.severity === 'success' && `
    background: #10b981;
  `}

  ${props => !props.severity && `
    background: #6b7280;
  `}
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
`;

const NotificationMessage = styled.p`
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.625rem;
  color: #94a3b8;

  .category {
    background: #e2e8f0;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-weight: 500;
  }
`;

const NotificationActions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #e2e8f0;
      color: #64748b;
    }
  }
`;

const NotificationActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;

  .action-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #2563eb;
    }
  }
`;

export default NotificationCenter;
