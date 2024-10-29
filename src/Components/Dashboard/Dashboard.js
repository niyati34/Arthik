import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import History from "../../History/History";
import { dollar } from "../../utils/Icons";

function Dashboard() {
  const {
    incomes,
    expenses,
    totalExpenses,
    totalIncomes,
    totalBalance,
    transactionHistory,
  } = useGlobalContext();

  const [timeframe, setTimeframe] = useState("all");

  // Filter data based on timeframe
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
      <InnerLayout>
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Financial Overview</h1>
            <p>Track your income, expenses, and financial goals</p>
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

        <div className="summary-cards">
          <div className="summary-card income-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Income</h3>
              <p className="amount">
                {dollar} {totalIncomes.toFixed(2)}
              </p>
              <p className="subtitle">
                {incomes.length > 0 ? `${incomes.length} transactions` : "No income yet"}
              </p>
            </div>
          </div>

          <div className="summary-card expense-card">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="amount">
                {dollar} {totalExpenses.toFixed(2)}
              </p>
              <p className="subtitle">
                {expenses.length > 0 ? `${expenses.length} transactions` : "No expenses yet"}
              </p>
            </div>
          </div>

          <div className="summary-card balance-card">
            <div className="card-icon">⚖️</div>
            <div className="card-content">
              <h3>Net Balance</h3>
              <p className={`amount ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                {dollar} {totalBalance.toFixed(2)}
              </p>
              <p className="subtitle">
                {totalBalance >= 0 ? "✓ Positive Balance" : "⚠ Negative Balance"}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="chart-section">
            <div className="section-header">
              <h2>Income vs. Expenses</h2>
              <p>Visual representation of your financial flow</p>
            </div>
            <div className="chart-container">
              <Chart incomes={filteredIncomes} expenses={filteredExpenses} />
            </div>
          </div>

          <div className="history-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <p>Latest financial activities</p>
            </div>
            <div className="history-container">
              <History />
            </div>
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  width: 100%;
  padding: 2rem;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    gap: 2rem;

    .header-content {
      flex: 1;
      min-width: 300px;

      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2b2c28;
        margin-bottom: 0.5rem;
        background: linear-gradient(135deg, #2b2c28 0%, #339989 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        color: #6e7e85;
        font-size: 1.1rem;
        line-height: 1.6;
      }
    }
  }

  .timeframe-selector {
    display: flex;
    gap: 0.5rem;
    background: #f8fafc;
    padding: 0.5rem;
    border-radius: 12px;
    border: 1px solid #e5e7eb;

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

      &:hover {
        background: rgba(51, 153, 137, 0.1);
        color: #339989;
      }

      &.active {
        background: #339989;
        color: #fffafb;
        border-color: #339989;
        box-shadow: 0 2px 8px rgba(51, 153, 137, 0.3);
      }
    }
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
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
      height: 4px;
      background: linear-gradient(90deg, #339989, #7de2d1);
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(19, 21, 21, 0.12);
      border-color: #7de2d1;
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .card-content {
      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2b2c28;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .amount {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: #2b2c28;

        &.positive {
          color: #339989;
        }

        &.negative {
          color: #dc2626;
        }
      }

      .subtitle {
        font-size: 0.9rem;
        color: #6e7e85;
        font-weight: 500;
      }
    }
  }

  .income-card::before {
    background: linear-gradient(90deg, #339989, #7de2d1);
  }

  .expense-card::before {
    background: linear-gradient(90deg, #d97706, #fbbf24);
  }

  .balance-card::before {
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @media (min-width: 1200px) {
      grid-template-columns: 1.5fr 1fr;
    }
  }

  .section-header {
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #2b2c28;
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
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .dashboard-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;

      .header-content h1 {
        font-size: 2rem;
      }
    }

    .summary-cards {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .timeframe-selector {
      justify-content: center;
    }
  }
`;

export default Dashboard;
