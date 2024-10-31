import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Chart from "../Chart/Chart";
import History from "../../History/History";

function Dashboard() {
  const {
    incomes,
    expenses,
    totalExpenses,
    totalIncomes,
    totalBalance,
  } = useGlobalContext();

  const [timeframe, setTimeframe] = useState("all");

  const filterDataByTimeframe = (data) => {
    if (timeframe === "all") return data;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

    return data.filter((item) => {
      const itemDate = new Date(item.date);
      if (timeframe === "30days") return itemDate >= thirtyDaysAgo;
      if (timeframe === "90days") return itemDate >= ninetyDaysAgo;
      return true;
    });
  };

  const filteredIncomes = filterDataByTimeframe(incomes);
  const filteredExpenses = filterDataByTimeframe(expenses);

  return (
    <DashboardStyled>
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="welcome-message">
              <h1>Welcome back! 👋</h1>
              <p>Here's your financial overview for today</p>
            </div>
            <div className="timeframe-selector">
              <button
                className={timeframe === "all" ? "active" : ""}
                onClick={() => setTimeframe("all")}
              >
                All Time
              </button>
              <button
                className={timeframe === "90days" ? "active" : ""}
                onClick={() => setTimeframe("90days")}
              >
                90 Days
              </button>
              <button
                className={timeframe === "30days" ? "active" : ""}
                onClick={() => setTimeframe("30days")}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="summary-section">
          <div className="summary-grid">
            <div className="summary-card income">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">💰</div>
                  <div className="card-info">
                    <h3>Total Income</h3>
                    <span className="period">This period</span>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="currency">$</span>
                  <span className="amount">{totalIncomes.toFixed(2)}</span>
                </div>
                <div className="card-footer">
                  <span className="transaction-count">
                    {incomes.length} transaction{incomes.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="card-decoration"></div>
            </div>

            <div className="summary-card expense">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">💸</div>
                  <div className="card-info">
                    <h3>Total Expenses</h3>
                    <span className="period">This period</span>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="currency">$</span>
                  <span className="amount">{totalExpenses.toFixed(2)}</span>
                </div>
                <div className="card-footer">
                  <span className="transaction-count">
                    {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="card-decoration"></div>
            </div>

            <div className="summary-card balance">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">⚖️</div>
                  <div className="card-info">
                    <h3>Net Balance</h3>
                    <span className="period">Current status</span>
                  </div>
                </div>
                <div className={`card-amount ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                  <span className="currency">$</span>
                  <span className="amount">{totalBalance.toFixed(2)}</span>
                </div>
                <div className="card-footer">
                  <span className={`status ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                    {totalBalance >= 0 ? '✓ In Good Standing' : '⚠ Needs Attention'}
                  </span>
                </div>
              </div>
              <div className="card-decoration"></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-section">
          <div className="content-grid">
            <div className="chart-section">
              <div className="section-header">
                <div className="header-content">
                  <h2>Financial Overview</h2>
                  <p>Visual representation of your income vs. expenses</p>
                </div>
                <div className="header-decoration"></div>
              </div>
              <div className="chart-container">
                <Chart incomes={filteredIncomes} expenses={filteredExpenses} />
              </div>
            </div>

            <div className="history-section">
              <div className="section-header">
                <div className="header-content">
                  <h2>Recent Activity</h2>
                  <p>Latest financial transactions</p>
                </div>
                <div className="header-decoration"></div>
              </div>
              <div className="history-container">
                <History />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: transparent;

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Hero Section */
  .hero-section {
    margin-bottom: 3rem;

    .hero-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;

      .welcome-message {
        h1 {
          font-size: 2.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
          line-height: 1.1;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        p {
          color: #6b7280;
          font-size: 1.125rem;
          line-height: 1.6;
          font-weight: 500;
        }
      }
    }
  }

  .timeframe-selector {
    display: flex;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(229, 231, 235, 0.5);
    border-radius: 16px;
    padding: 0.5rem;
    gap: 0.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    button {
      background: transparent;
      border: 1px solid transparent;
      padding: 0.875rem 1.75rem;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      color: #6b7280;
      white-space: nowrap;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #339989, #7de2d1);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }

      &:hover {
        color: #339989;
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(51, 153, 137, 0.15);
      }

      &.active {
        color: white;
        border-color: transparent;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(51, 153, 137, 0.25);

        &::before {
          opacity: 1;
        }
      }
    }
  }

  /* Summary Section */
  .summary-section {
    margin-bottom: 3rem;

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }
  }

  .summary-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(229, 231, 235, 0.3);
    border-radius: 24px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border-color: rgba(51, 153, 137, 0.2);
    }

    .card-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #339989, #7de2d1);
      opacity: 0.8;
    }

    &.income .card-decoration {
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    &.expense .card-decoration {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    &.balance .card-decoration {
      background: linear-gradient(90deg, #8b5cf6, #a78bfa);
    }
  }

  .card-content {
    position: relative;
    z-index: 1;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 2rem;

    .card-icon {
      font-size: 2.75rem;
      width: 70px;
      height: 70px;
      background: rgba(249, 250, 251, 0.8);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .card-info {
      h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.375rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .period {
        font-size: 0.875rem;
        color: #9ca3af;
        font-weight: 500;
      }
    }
  }

  .card-amount {
    margin-bottom: 1.5rem;

    .currency {
      font-size: 1.75rem;
      font-weight: 600;
      color: #9ca3af;
      margin-right: 0.375rem;
    }

    .amount {
      font-size: 3rem;
      font-weight: 700;
      color: #1f2937;
      line-height: 1;
    }

    &.positive .amount {
      color: #10b981;
    }

    &.negative .amount {
      color: #ef4444;
    }
  }

  .card-footer {
    .transaction-count,
    .status {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }

    .status.positive {
      color: #10b981;
    }

    .status.negative {
      color: #ef4444;
    }
  }

  /* Content Section */
  .content-section {
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;

      @media (min-width: 1200px) {
        grid-template-columns: 1.5fr 1fr;
      }
    }
  }

  .section-header {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    .header-content {
      flex: 1;

      h2 {
        font-size: 1.75rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      p {
        color: #6b7280;
        font-size: 1rem;
        font-weight: 500;
      }
    }

    .header-decoration {
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #339989, #7de2d1);
      border-radius: 2px;
    }
  }

  .chart-container,
  .history-container {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(229, 231, 235, 0.3);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      border-color: rgba(51, 153, 137, 0.1);
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .dashboard-container {
      padding: 1.5rem;
    }

    .hero-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;

      .welcome-message h1 {
        font-size: 2.25rem;
      }
    }

    .summary-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .content-grid {
      gap: 2rem;
    }
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }

    .hero-content .welcome-message h1 {
      font-size: 2rem;
    }

    .summary-card {
      padding: 2rem;
    }

    .card-amount .amount {
      font-size: 2.5rem;
    }

    .timeframe-selector {
      justify-content: center;
      
      button {
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
      }
    }

    .chart-container,
    .history-container {
      padding: 2rem;
    }
  }
`;

export default Dashboard;
