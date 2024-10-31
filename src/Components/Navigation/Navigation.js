import React from "react";
import styled from "styled-components";

const navItems = [
  { id: 1, name: "Dashboard", icon: "📊", description: "Financial Overview" },
  { id: 2, name: "Income", icon: "💰", description: "Manage Income" },
  { id: 3, name: "Expenses", icon: "💸", description: "Track Expenses" },
  { id: 4, name: "Budget", icon: "📋", description: "Budget Planning" },
  { id: 5, name: "Goals", icon: "🎯", description: "Financial Goals" },
];

function Navigation({ active, setActive }) {
  return (
    <NavigationStyled>
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-header">
          <div className="logo">
            <div className="logo-icon">💎</div>
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
                  aria-label={`Navigate to ${item.name}`}
                >
                  <div className="nav-icon">{item.icon}</div>
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
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">Welcome Back</span>
              <span className="user-status">Ready to manage finances</span>
            </div>
          </div>
        </div>
      </div>
    </NavigationStyled>
  );
}

const NavigationStyled = styled.nav`
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(229, 231, 235, 0.5);
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);

  .nav-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem 1.5rem;
  }

  /* Header Section */
  .nav-header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(229, 231, 235, 0.3);

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;

      .logo-icon {
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #339989, #7de2d1);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 20px rgba(51, 153, 137, 0.2);
      }

      .logo-text {
        h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1.2;
        }

        p {
          font-size: 0.875rem;
          color: #6b7280;
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
      gap: 0.5rem;
    }

    .nav-item {
      .nav-button {
        width: 100%;
        background: transparent;
        border: none;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
        text-align: left;
        color: #6b7280;

        &:hover {
          background: rgba(51, 153, 137, 0.05);
          color: #339989;
          transform: translateX(4px);
        }

        &.active {
          background: linear-gradient(135deg, rgba(51, 153, 137, 0.1), rgba(125, 226, 209, 0.1));
          color: #339989;
          border: 1px solid rgba(51, 153, 137, 0.2);
          box-shadow: 0 4px 20px rgba(51, 153, 137, 0.1);

          .nav-icon {
            background: linear-gradient(135deg, #339989, #7de2d1);
            color: white;
            transform: scale(1.1);
          }
        }

        .nav-icon {
          font-size: 1.25rem;
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .nav-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .nav-name {
            font-size: 0.95rem;
            font-weight: 600;
            color: inherit;
          }

          .nav-description {
            font-size: 0.75rem;
            color: #9ca3af;
            font-weight: 500;
          }
        }

        .active-indicator {
          position: absolute;
          right: 1rem;
          width: 6px;
          height: 6px;
          background: #339989;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }
    }
  }

  /* Footer Section */
  .nav-footer {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid rgba(229, 231, 235, 0.3);

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 12px;
      border: 1px solid rgba(229, 231, 235, 0.3);

      .user-avatar {
        font-size: 1.5rem;
        width: 40px;
        height: 40px;
        background: #e5e7eb;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }

        .user-status {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }
      }
    }
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    width: 240px;

    .nav-container {
      padding: 1.5rem 1rem;
    }

    .nav-header .logo .logo-text h1 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);

    .nav-container {
      padding: 1rem;
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }

    .nav-header {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;

      .logo .logo-icon {
        width: 50px;
        height: 50px;
        font-size: 2rem;
      }
    }

    .nav-menu {
      flex: 1;

      .nav-list {
        flex-direction: row;
        gap: 0.25rem;
      }

      .nav-item .nav-button {
        padding: 0.75rem 1rem;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;

        .nav-content {
          .nav-description {
            display: none;
          }
        }

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .nav-footer {
      margin-top: 0;
      padding-top: 0;
      border-top: none;

      .user-info {
        padding: 0.75rem;
        
        .user-details .user-status {
          display: none;
        }
      }
    }
  }
`;

export default Navigation;
