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
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Financial Dashboard</h1>
            <p>Monitor your financial health and track your progress</p>
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

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card income">
            <div className="card-header">
              <div className="card-icon">💰</div>
              <div className="card-title">
                <h3>Total Income</h3>
                <span className="card-subtitle">This period</span>
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

          <div className="summary-card expense">
            <div className="card-header">
              <div className="card-icon">💸</div>
              <div className="card-title">
                <h3>Total Expenses</h3>
                <span className="card-subtitle">This period</span>
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

          <div className="summary-card balance">
            <div className="card-header">
              <div className="card-icon">⚖️</div>
              <div className="card-title">
                <h3>Net Balance</h3>
                <span className="card-subtitle">Current status</span>
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
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          <div className="chart-section">
            <div className="section-header">
              <h2>Financial Overview</h2>
              <p>Income vs. Expenses visualization</p>
            </div>
            <div className="chart-container">
              <Chart incomes={filteredIncomes} expenses={filteredExpenses} />
            </div>
          </div>

          <div className="history-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <p>Latest transactions</p>
            </div>
            <div className="history-container">
              <History />
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
  background: #fffafb;
  
  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header Styles */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    gap: 2rem;

    .header-content {
      flex: 1;

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2b2c28;
        margin-bottom: 0.5rem;
        line-height: 1.2;
      }

      p {
        color: #6e7e85;
        font-size: 1.1rem;
        line-height: 1.6;
        max-width: 500px;
      }
    }
  }

  .timeframe-selector {
    display: flex;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.5rem;
    gap: 0.25rem;

    button {
      background: transparent;
      border: 1px solid transparent;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #6e7e85;
      white-space: nowrap;

      &:hover {
        background: rgba(51, 153, 137, 0.1);
        color: #339989;
      }

      &.active {
        background: #339989;
        color: #fffafb;
        border-color: #339989;
        box-shadow: 0 2px 8px rgba(51, 153, 137, 0.2);
      }
    }
  }

  /* Summary Cards */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .summary-card {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #339989, #7de2d1);
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(19, 21, 21, 0.08);
      border-color: #7de2d1;
    }

    &.income::before {
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    &.expense::before {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    &.balance::before {
      background: linear-gradient(90deg, #8b5cf6, #a78bfa);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .card-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      background: #f8fafc;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-title {
      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2b2c28;
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .card-subtitle {
        font-size: 0.85rem;
        color: #9ca3af;
        font-weight: 500;
      }
    }
  }

  .card-amount {
    margin-bottom: 1rem;

    .currency {
      font-size: 1.5rem;
      font-weight: 600;
      color: #6e7e85;
      margin-right: 0.25rem;
    }

    .amount {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2b2c28;
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
      font-size: 0.85rem;
      font-weight: 500;
      color: #6e7e85;
    }

    .status.positive {
      color: #10b981;
    }

    .status.negative {
      color: #ef4444;
    }
  }

  /* Main Content */
  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 1200px) {
      grid-template-columns: 1.5fr 1fr;
    }
  }

  .section-header {
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2b2c28;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6e7e85;
      font-size: 0.95rem;
    }
  }

  .chart-container,
  .history-container {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .dashboard-container {
      padding: 1.5rem;
    }

    .dashboard-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;

      .header-content h1 {
        font-size: 2rem;
      }
    }

    .summary-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }

    .dashboard-header .header-content h1 {
      font-size: 1.75rem;
    }

    .summary-card {
      padding: 1.5rem;
    }

    .card-amount .amount {
      font-size: 2rem;
    }

    .timeframe-selector {
      justify-content: center;
      
      button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }
    }
  }
`;

export default Dashboard;
