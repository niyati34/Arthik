import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Chart from "../Chart/Chart";
import History from "../../History/History";
import Skeleton, { SkeletonCard, SkeletonList } from "../Skeleton/Skeleton";

function Dashboard() {
  const {
    incomes,
    expenses,
    totalExpenses,
    totalIncomes,
    totalBalance,
  } = useGlobalContext();

  const [timeframe, setTimeframe] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return (
      <DashboardStyled>
        <div className="dashboard-container">
          {/* Loading Header */}
          <div className="header-section">
            <div className="header-content">
              <Skeleton type="title" style={{ width: '60%', marginBottom: '0.5rem' }} />
              <Skeleton type="text" style={{ width: '80%' }} />
            </div>
            <div className="timeframe-selector">
              <Skeleton type="button" style={{ width: '80px', height: '32px' }} />
              <Skeleton type="button" style={{ width: '80px', height: '32px' }} />
              <Skeleton type="button" style={{ width: '80px', height: '32px' }} />
            </div>
          </div>

          {/* Loading Summary Cards */}
          <div className="summary-section">
            <div className="summary-grid">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </div>

          {/* Loading Content */}
          <div className="content-section">
            <div className="content-grid">
              <div className="chart-section">
                <div className="section-header">
                  <Skeleton type="title" style={{ width: '60%' }} />
                  <Skeleton type="text" style={{ width: '40%' }} />
                </div>
                <div className="chart-container">
                  <SkeletonCard />
                </div>
              </div>

              <div className="history-section">
                <div className="section-header">
                  <Skeleton type="title" style={{ width: '50%' }} />
                  <Skeleton type="text" style={{ width: '30%' }} />
                </div>
                <div className="history-container">
                  <SkeletonList count={3} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardStyled>
    );
  }

  return (
    <DashboardStyled>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <h1>Financial Dashboard</h1>
            <p>Monitor your financial health and track progress</p>
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
        <div className="summary-section">
          <div className="summary-grid">
            <div className="summary-card income">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9.5A3.5 3.5 0 0 0 6 8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5A3.5 3.5 0 0 1 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Income</h3>
                <div className="amount">${totalIncomes.toFixed(2)}</div>
                <span className="count">{incomes.length} transactions</span>
              </div>
            </div>

            <div className="summary-card expense">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Total Expenses</h3>
                <div className="amount">${totalExpenses.toFixed(2)}</div>
                <span className="count">{expenses.length} transactions</span>
              </div>
            </div>

            <div className="summary-card balance">
              <div className="card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6A2 2 0 0 1 7 4H9M9 4V2H15V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 15H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 19H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content">
                <h3>Net Balance</h3>
                <div className={`amount ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                  ${totalBalance.toFixed(2)}
                </div>
                <span className={`status ${totalBalance >= 0 ? 'positive' : 'negative'}`}>
                  {totalBalance >= 0 ? 'In Good Standing' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-section">
          <div className="content-grid">
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
      </div>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Header Section */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1.5rem;

    .header-content {
      h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
        line-height: 1.2;
      }

      p {
        color: #64748b;
        font-size: 0.875rem;
        line-height: 1.4;
        margin: 0;
      }
    }
  }

  .timeframe-selector {
    display: flex;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.125rem;
    gap: 0.125rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    button {
      background: transparent;
      border: none;
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #64748b;
      white-space: nowrap;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }

      &.active {
        background: #0f172a;
        color: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    }
  }

  /* Summary Section */
  .summary-section {
    margin-bottom: 1.5rem;

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
  }

  .summary-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }

    .card-icon {
      width: 40px;
      height: 40px;
      background: #f8fafc;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;

      h3 {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
        margin: 0 0 0.375rem 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.125rem;
        line-height: 1;

        &.positive {
          color: #059669;
        }

        &.negative {
          color: #dc2626;
        }
      }

      .count,
      .status {
        font-size: 0.625rem;
        color: #94a3b8;
        font-weight: 500;
      }

      .status.positive {
        color: #059669;
      }

      .status.negative {
        color: #dc2626;
      }
    }
  }

  /* Content Section */
  .content-section {
    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;

      @media (min-width: 1200px) {
        grid-template-columns: 1.2fr 1fr;
      }
    }
  }

  .section-header {
    margin-bottom: 1rem;

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }

    p {
      color: #64748b;
      font-size: 0.75rem;
      margin: 0;
    }
  }

  .chart-container,
  .history-container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
      
      &:hover {
        background: #94a3b8;
      }
    }

    &:hover {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .dashboard-container {
      padding: 0.875rem;
    }

    .header-section {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

      .header-content h1 {
        font-size: 1.5rem;
      }
    }

    .summary-grid {
      grid-template-columns: 1fr;
      gap: 0.875rem;
    }

    .content-grid {
      gap: 1.25rem;
    }

    .chart-container,
    .history-container {
      max-height: 350px;
    }
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 0.75rem;
    }

    .header-section .header-content h1 {
      font-size: 1.375rem;
    }

    .summary-card {
      padding: 1rem;

      .card-icon {
        width: 36px;
        height: 36px;
      }

      .card-content .amount {
        font-size: 1.375rem;
      }
    }

    .chart-container,
    .history-container {
      padding: 1rem;
      max-height: 300px;
    }
  }
`;

export default Dashboard;
