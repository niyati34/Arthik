import React from "react";
import styled from "styled-components";

const navItems = [
  { id: 1, name: "Dashboard", icon: "📊" },
  { id: 2, name: "Income", icon: "💰" },
  { id: 3, name: "Expenses", icon: "💸" },
  { id: 4, name: "Budget", icon: "📋" },
  { id: 5, name: "Goals", icon: "🎯" },
];

function Navigation({ active, setActive }) {
  return (
    <NavigationStyled>
      <div className="nav-header">
        <h2>Arthik</h2>
        <p>Financial Dashboard</p>
      </div>
      
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </li>
        ))}
      </ul>
      
      <div className="nav-footer">
        <div className="user-info">
          <div className="avatar">👤</div>
          <div className="user-details">
            <p className="username">Welcome Back!</p>
            <p className="user-role">Financial Manager</p>
          </div>
        </div>
      </div>
    </NavigationStyled>
  );
}

const NavigationStyled = styled.nav`
  width: 280px;
  height: 100%;
  background: linear-gradient(180deg, #2b2c28 0%, #131515 100%);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  color: #fffafb;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .nav-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #7de2d1;
      margin-bottom: 0.5rem;
    }

    p {
      color: #bbbac6;
      font-size: 0.9rem;
    }
  }

  .nav-menu {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover {
      background: rgba(125, 226, 209, 0.1);
      border-color: rgba(125, 226, 209, 0.3);
      transform: translateX(5px);
    }

    &.active {
      background: linear-gradient(135deg, #339989 0%, #7de2d1 100%);
      border-color: #7de2d1;
      box-shadow: 0 4px 20px rgba(51, 153, 137, 0.3);
      transform: translateX(5px);
    }

    .nav-icon {
      font-size: 1.5rem;
      width: 24px;
      text-align: center;
    }

    .nav-text {
      font-weight: 500;
      font-size: 1rem;
    }
  }

  .nav-footer {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);

      .avatar {
        font-size: 2rem;
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #339989 0%, #7de2d1 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-details {
        flex: 1;

        .username {
          font-weight: 600;
          color: #fffafb;
          margin-bottom: 0.25rem;
        }

        .user-role {
          font-size: 0.8rem;
          color: #bbbac6;
        }
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-radius: 0;
    
    .nav-menu {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 1rem;
      
      .nav-item {
        min-width: 120px;
        flex-direction: column;
        text-align: center;
        padding: 1rem 0.5rem;
        
        &:hover {
          transform: translateY(-3px);
        }
        
        &.active {
          transform: translateY(-3px);
        }
      }
    }
  }
`;

export default Navigation;
