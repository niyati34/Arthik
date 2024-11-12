import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

const Navigation = ({ active, setActive }) => {
  const { totalIncomes, totalExpenses, totalBalance } = useGlobalContext();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Memoize navigation items to prevent unnecessary re-renders
  const navigationItems = React.useMemo(() => [
    {
      id: 1,
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: "View financial overview and summary"
    },
    {
      id: 2,
      title: "Income",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5H9.5A3.5 3.5 0 0 0 6 8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5A3.5 3.5 0 0 1 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: "Manage income sources and transactions"
    },
    {
      id: 3,
      title: "Expenses",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: "Track and categorize expenses"
    },
    {
      id: 4,
      title: "Budget",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: "Set and monitor spending budgets"
    },
    {
      id: 5,
      title: "Goals",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: "Set and track financial goals"
    }
  ], []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(itemId);
    }
  }, [setActive]);

  // Handle collapse toggle with keyboard
  const handleCollapseKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed]);

  // Focus management for screen readers
  useEffect(() => {
    const activeItem = document.querySelector(`[data-nav-item="${active}"]`);
    if (activeItem) {
      activeItem.setAttribute('aria-current', 'page');
    }
  }, [active]);

  return (
    <NavigationStyled className={isCollapsed ? "collapsed" : ""}>
      <div className="nav-header">
        <div className="logo-section">
          <div className="logo" aria-label="Arthik Financial Management">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="logo-text">Arthik</span>
          </div>
        </div>
        
        <button
          className="collapse-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          onKeyDown={handleCollapseKeyDown}
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!isCollapsed}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <nav className="nav-menu" role="navigation" aria-label="Main navigation">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${active === item.id ? "active" : ""}`}
                onClick={() => setActive(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                data-nav-item={item.id}
                aria-label={`${item.title} - ${item.description}`}
                aria-describedby={`nav-description-${item.id}`}
                role="menuitem"
                tabIndex={0}
              >
                <div className="nav-icon" aria-hidden="true">
                  {item.icon}
                </div>
                <div className="nav-content">
                  <span className="nav-title">{item.title}</span>
                  <span 
                    id={`nav-description-${item.id}`} 
                    className="nav-description"
                    aria-hidden="true"
                  >
                    {item.description}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-footer">
        <div className="user-info">
          <div className="user-avatar" aria-label="User avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="user-details">
            <span className="user-name" aria-label="User name">John Doe</span>
            <span className="user-role" aria-label="User role">Premium User</span>
          </div>
        </div>
        
        <div className="quick-stats" aria-label="Quick financial summary">
          <div className="stat-item">
            <span className="stat-label" aria-label="Total income">Income</span>
            <span className="stat-value" aria-label={`Total income: $${totalIncomes.toFixed(2)}`}>
              ${totalIncomes.toFixed(2)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label" aria-label="Total expenses">Expenses</span>
            <span className="stat-value" aria-label={`Total expenses: $${totalExpenses.toFixed(2)}`}>
              ${totalExpenses.toFixed(2)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label" aria-label="Net balance">Balance</span>
            <span 
              className={`stat-value ${totalBalance >= 0 ? 'positive' : 'negative'}`}
              aria-label={`Net balance: $${totalBalance.toFixed(2)}`}
            >
              ${totalBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </NavigationStyled>
  );
};

const NavigationStyled = styled.nav`
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #f1f5f9;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-y: auto;

  .nav-container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 1.5rem 1rem;
  }

  /* Header Section */
  .nav-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    flex-shrink: 0;

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .logo-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
      }

      .logo-text {
        h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }

        p {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }
      }
    }
  }

  /* Navigation Menu */
  .nav-menu {
    flex: 1;

    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      .nav-button {
        width: 100%;
        background: transparent;
        border: none;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        position: relative;
        text-align: left;
        color: #64748b;

        &:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        &.active {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #e2e8f0;

          .nav-icon {
            background: #0f172a;
            color: white;
          }
        }

        .nav-icon {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;

          .nav-name {
            font-size: 0.875rem;
            font-weight: 600;
            color: inherit;
          }

          .nav-description {
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 500;
          }
        }

        .active-indicator {
          position: absolute;
          right: 0.75rem;
          width: 4px;
          height: 4px;
          background: #0f172a;
          border-radius: 50%;
        }
      }
    }
  }

  /* Footer Section */
  .nav-footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid #f1f5f9;
    flex-shrink: 0;

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .user-avatar {
        width: 32px;
        height: 32px;
        background: #e2e8f0;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
      }

      .user-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;

        .user-name {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0f172a;
        }

        .user-status {
          font-size: 0.625rem;
          color: #64748b;
          font-weight: 500;
        }
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    width: 220px;

    .nav-container {
      padding: 1.25rem 0.75rem;
    }

    .nav-header .logo .logo-text h1 {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    overflow-y: visible;

    .nav-container {
      padding: 1rem;
      flex-direction: row;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-header {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;

      .logo .logo-icon {
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      flex: 1;

      .nav-list {
        flex-direction: row;
        gap: 0.125rem;
      }

      .nav-item .nav-button {
        padding: 0.5rem 0.75rem;
        flex-direction: column;
        gap: 0.375rem;
        text-align: center;

        .nav-content .nav-description {
          display: none;
        }

        &:hover {
          transform: translateY(-1px);
        }
      }
    }

    .nav-footer {
      margin-top: 0;
      padding-top: 0;
      border-top: none;

      .user-info {
        padding: 0.5rem;
        
        .user-details .user-status {
          display: none;
        }
      }
    }
  }
`;

export default Navigation;
