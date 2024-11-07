import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";

const BudgetTracker = () => {
  const { savingsPerBudget, expenses } = useGlobalContext();
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sort and filter budgets
  const sortedAndFilteredBudgets = [...savingsPerBudget]
    .filter((budget) => {
      if (filterStatus === "all") return true;
      return budget.status.toLowerCase().includes(filterStatus.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "spent-desc":
          return b.spent - a.spent;
        case "spent-asc":
          return a.spent - b.spent;
        case "savings-desc":
          return b.savings - a.savings;
        case "savings-asc":
          return a.savings - b.savings;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Calculate total budget and total spent
  const totalBudget = savingsPerBudget.reduce(
    (total, budget) => total + budget.amount,
    0
  );
  const totalSpent = savingsPerBudget.reduce(
    (total, budget) => total + budget.spent,
    0
  );

  return (
    <BudgetTrackerStyled>
      {/* Compact Summary */}
      <div className="summary-section">
        <div className="summary-grid">
          <div className="summary-item">
            <h3>Total Budget</h3>
            <span className="amount">${totalBudget.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <h3>Total Spent</h3>
            <span className="amount">${totalSpent.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <h3>Remaining</h3>
            <span className={`amount ${totalBudget - totalSpent >= 0 ? 'positive' : 'negative'}`}>
              ${(totalBudget - totalSpent).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Compact Controls */}
      <div className="controls-section">
        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="under">Under Budget</option>
            <option value="on">On Budget</option>
            <option value="over">Over Budget</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="amount-desc">Highest Budget</option>
            <option value="amount-asc">Lowest Budget</option>
            <option value="spent-desc">Most Spent</option>
            <option value="spent-asc">Least Spent</option>
            <option value="savings-desc">Most Savings</option>
            <option value="savings-asc">Least Savings</option>
          </select>
        </div>
      </div>

      {/* Budget List */}
      {sortedAndFilteredBudgets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>No Budgets Found</h3>
          <p>
            {savingsPerBudget.length === 0
              ? "No active budgets at the moment."
              : "No budgets match your filters."}
          </p>
          {savingsPerBudget.length > 0 && filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="reset-button"
            >
              Show All Budgets
            </button>
          )}
        </div>
      ) : (
        <div className="budget-list">
          {sortedAndFilteredBudgets.map((budget) => (
            <div className="budget-card" key={budget.id}>
              <div className="budget-header">
                <h3>{budget.name}</h3>
                <span className={`status-badge ${budget.status.toLowerCase().replace(" ", "-")}`}>
                  {budget.status}
                </span>
              </div>

              <div className="budget-content">
                <div className="budget-stats">
                  <div className="stat-row">
                    <span className="label">Budget:</span>
                    <span className="value">${budget.amount.toFixed(2)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">Spent:</span>
                    <span className="value">${budget.spent.toFixed(2)}</span>
                  </div>
                  <div className="stat-row">
                    <span className="label">Remaining:</span>
                    <span className={`value ${budget.savings >= 0 ? 'positive' : 'negative'}`}>
                      ${budget.savings.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="budget-progress">
                  <div className="progress-info">
                    <span className="progress-text">
                      {Math.min(100, (budget.spent / budget.amount) * 100).toFixed(1)}% used
                    </span>
                    <span className="period-text">{budget.period}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, (budget.spent / budget.amount) * 100)}%`,
                        backgroundColor: budget.spent > budget.amount ? "#ef4444" : "#10b981",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BudgetTrackerStyled>
  );
};

const BudgetTrackerStyled = styled.div`
  width: 100%;
  background: transparent;

  /* Summary Section */
  .summary-section {
    margin-bottom: 1rem;

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }
  }

  .summary-item {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    h3 {
      font-size: 0.625rem;
      font-weight: 600;
      color: #64748b;
      margin: 0 0 0.375rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .amount {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;

      &.positive {
        color: #10b981;
      }

      &.negative {
        color: #ef4444;
      }
    }
  }

  /* Controls Section */
  .controls-section {
    margin-bottom: 1rem;

    .filter-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }

  .filter-select,
  .sort-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.75rem;
    background: #ffffff;
    color: #0f172a;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;

    &:hover {
      border-color: #cbd5e1;
      background-color: #f8fafc;
    }

    &:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
      background-color: #ffffff;
    }

    option {
      padding: 0.5rem;
      background: #ffffff;
      color: #0f172a;
      
      &:hover {
        background: #f1f5f9;
      }

      &:checked {
        background: #10b981;
        color: #ffffff;
      }
    }
  }

  /* Empty State */
  .empty-state {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .empty-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;
      color: #94a3b8;
      opacity: 0.5;
    }

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }

    p {
      color: #64748b;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .reset-button {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #059669;
      }
    }
  }

  /* Budget List */
  .budget-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
      
      &:hover {
        background: #94a3b8;
      }
    }
  }

  .budget-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
  }

  .budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.under-budget {
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.on-budget {
        background-color: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      &.over-budget {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    }
  }

  .budget-content {
    .budget-stats {
      margin-bottom: 1rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      padding: 0.375rem 0;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }

      .value {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0f172a;

        &.positive {
          color: #10b981;
        }

        &.negative {
          color: #ef4444;
        }
      }
    }
  }

  .budget-progress {
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      .progress-text {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 500;
      }

      .period-text {
        font-size: 0.75rem;
        color: #94a3b8;
        text-transform: capitalize;
        font-weight: 500;
      }
    }

    .progress-bar {
      height: 8px;
      background-color: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: 4px;
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .summary-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .filter-controls {
      flex-direction: column;
      gap: 0.5rem;

      select {
        min-width: auto;
        width: 100%;
      }
    }

    .budget-list {
      max-height: 350px;
    }
  }
`;

export default BudgetTracker;

