import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

const Navigation = ({ active, setActive }) => {
  const { totalIncomes, totalExpenses, totalBalance } = useGlobalContext();

  // Navigation items with proper structure
  const navItems = [
    { id: 1, name: "Dashboard", icon: "📊", description: "Financial Overview" },
    { id: 2, name: "Income", icon: "💰", description: "Manage Income" },
    { id: 3, name: "Expenses", icon: "💸", description: "Track Expenses" },
    { id: 4, name: "Budget", icon: "📋", description: "Budget Planning" },
    { id: 5, name: "Goals", icon: "🎯", description: "Financial Goals" },
  ];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(itemId);
    }
  }, [setActive]);

  // Focus management for screen readers
  useEffect(() => {
    const activeItem = document.querySelector(`[data-nav-item="${active}"]`);
    if (activeItem) {
      activeItem.setAttribute('aria-current', 'page');
    }
  }, [active]);

  return (
    <NavigationStyled>
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Arthik</h1>
              <p>Financial Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-button ${active === item.id ? "active" : ""}`}
                  onClick={() => setActive(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  data-nav-item={item.id}
                  aria-label={`Navigate to ${item.name}`}
                >
                  <div className="nav-icon">
                    {item.id === 1 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                    {item.id === 2 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 5H9.5A3.5 3.5 0 0 0 6 8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5A3.5 3.5 0 0 1 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {item.id === 3 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {item.id === 4 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {item.id === 5 && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 14L12 10L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="nav-content">
                    <span className="nav-name">{item.name}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                  {active === item.id && <div className="active-indicator" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="nav-footer">
          <div className="user-info">
            <div className="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="user-details">
              <span className="user-name">Welcome Back</span>
              <span className="user-status">Ready to manage finances</span>
            </div>
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

        svg {
          color: white;
        }
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
            background: #10b981;
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
          background: #10b981;
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
