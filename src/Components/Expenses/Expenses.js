import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ExpenseForm from "./ExpenseForm";
import IncomeItem from "../IncomeItem/IncomeItem";
import AnalyticsDashboard from "../Analytics/AnalyticsDashboard";
import ExportModal from "../Export/ExportModal";
import { useGlobalContext } from "../../context/globalContext";
import { useDataFiltering } from "../../utils/useDataFiltering";
import { useExpenseAnalytics } from "../../utils/useExpenseAnalytics";
import { useNotifications } from "../../utils/useNotifications";

function Expenses() {
  const { expenses, addExpense, deleteExpense, totalExpenses } =
    useGlobalContext();
  
  // Use the custom filtering hook
  const {
    filteredData: filteredExpenses,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    categories,
    resetFilters
  } = useDataFiltering(expenses);

  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [viewMode, setViewMode] = useState("expenses"); // "expenses" or "analytics"
  const [showExportModal, setShowExportModal] = useState(false);

  // Get analytics data
  const analytics = useExpenseAnalytics(expenses);
  
  // Initialize notifications
  const { createSpendingReminder } = useNotifications();

  // Send spending reminders for new expenses
  useEffect(() => {
    if (expenses.length > 0) {
      const latestExpense = expenses[0]; // Assuming expenses are sorted by date desc
      const dailyAverage = analytics.averageExpense || 0;
      
      // Only send reminder for expenses added in the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (new Date(latestExpense.date) > fiveMinutesAgo) {
        createSpendingReminder(latestExpense, dailyAverage);
      }
    }
  }, [expenses, analytics.averageExpense, createSpendingReminder]);

  // Apply date range filtering
  const finalFilteredExpenses = React.useMemo(() => {
    let result = [...filteredExpenses];

    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter((expense) => new Date(expense.date) >= fromDate);
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      result = result.filter((expense) => new Date(expense.date) <= toDate);
    }

    return result;
  }, [filteredExpenses, dateRange]);

  const clearDateRange = () => {
    setDateRange({ from: "", to: "" });
  };

  return (
    <ExpenseStyled>
      <div className="expense-container">
        {/* Header Section */}
        <div className="expense-header">
          <div className="header-content">
            <h1>Expense Management</h1>
            <p>Track and categorize all your expenses</p>
          </div>
          <div className="expense-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="summary-content">
                <h3>Total Expenses</h3>
                <span className="amount">${typeof totalExpenses === 'number' && !isNaN(totalExpenses) ? totalExpenses.toFixed(2) : '0.00'}</span>
                <span className="count">
                  {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="view-toggle-section">
          <div className="view-toggle">
            <button
              className={`toggle-button ${viewMode === "expenses" ? "active" : ""}`}
              onClick={() => setViewMode("expenses")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 11H1l8-8v6h8l-8 8v-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Expenses
            </button>
            <button
              className={`toggle-button ${viewMode === "analytics" ? "active" : ""}`}
              onClick={() => setViewMode("analytics")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Analytics
            </button>
          </div>
        </div>

        {/* Analytics View */}
        {viewMode === "analytics" && (
          <AnalyticsDashboard expenses={expenses} />
        )}

        {/* Expenses View */}
        {viewMode === "expenses" && (
          <>
            {/* Controls Section */}
            <div className="controls-section">
              <div className="search-control">
                <div className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="filter-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="amount-desc">Highest Amount</option>
                  <option value="amount-asc">Lowest Amount</option>
                </select>
              </div>
            </div>

        {/* Date Range Filter */}
        <div className="date-range-section">
          <div className="date-inputs">
            <div className="date-input">
              <label>From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="date-field"
              />
            </div>
            <div className="date-input">
              <label>To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
                className="date-field"
              />
            </div>
          </div>
          <div className="date-actions">
            {(dateRange.from || dateRange.to) && (
              <button
                className="clear-dates-btn"
                onClick={clearDateRange}
              >
                Clear Dates
              </button>
            )}
            <button
              className="export-button"
              onClick={() => setShowExportModal(true)}
              title="Export data"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="expense-content">
          <div className="form-section">
            <div className="section-header">
              <h2>Add New Expense</h2>
              <p>Record a new expense</p>
            </div>
            <div className="form-container">
              <ExpenseForm addExpense={addExpense} />
            </div>
          </div>

          <div className="list-section">
            <div className="section-header">
              <h2>Expense History</h2>
              <p>
                {finalFilteredExpenses.length > 0
                  ? `${finalFilteredExpenses.length} expense${
                      finalFilteredExpenses.length !== 1 ? "s" : ""
                    } found`
                  : "No expenses yet"}
              </p>
            </div>

            {finalFilteredExpenses.length > 0 ? (
              <div className="expense-list">
                {finalFilteredExpenses.map((expense) => {
                  const { id, title, amount, date, category, description } =
                    expense;
                  return (
                    <IncomeItem
                      key={id}
                      id={id}
                      title={title || "N/A"}
                      description={description || "N/A"}
                      amount={amount}
                      date={date || "N/A"}
                      category={category || "N/A"}
                      type="expense"
                      deleteItem={deleteExpense}
                      indicatorColor="#ef4444"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No Expenses Found</h3>
                <p>
                  {(filter !== "all" || searchQuery || dateRange.from || dateRange.to)
                    ? "No expenses match your current filters."
                    : "Start by adding your first expense above."}
                </p>
                {(filter !== "all" || searchQuery || dateRange.from || dateRange.to) && (
                  <button
                    onClick={() => {
                      resetFilters();
                      clearDateRange();
                    }}
                    className="reset-button"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        expenses={expenses}
        analytics={analytics}
      />
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: transparent;
  overflow: visible;

  .expense-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  /* View Toggle Styles */
  .view-toggle-section {
    margin-bottom: 1rem;

    .view-toggle {
      display: flex;
      background: #f1f5f9;
      border-radius: 8px;
      padding: 0.25rem;
      gap: 0.25rem;

      .toggle-button {
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        &.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  /* Header Styles */
  .expense-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 0.75rem;

    .header-content {
      h1 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
        line-height: 1.2;
      }

      p {
        color: #64748b;
        font-size: 0.75rem;
        margin: 0;
      }
    }
  }

  .expense-summary {
    .summary-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.625rem;
      min-width: 160px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 0.625rem;

      .summary-icon {
        width: 24px;
        height: 24px;
        background: #f0fdf4;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #10b981;
        font-size: 0.875rem;
      }

      .summary-content {
        h3 {
          font-size: 0.625rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 0.125rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amount {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 0.125rem;
          line-height: 1;
        }

        .count {
          font-size: 0.5rem;
          color: #94a3b8;
          font-weight: 500;
        }
      }
    }
  }

  /* Controls Section */
  .controls-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.625rem;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  .search-control {
    position: relative;
    flex: 1;
    min-width: 180px;
    max-width: 280px;

    .search-icon {
      position: absolute;
      left: 0.625rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: #94a3b8;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.625rem 0.5rem 2.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.75rem;
      background: #ffffff;
      color: #0f172a;
      transition: all 0.2s ease;

      &::placeholder {
        color: #94a3b8;
      }

      &:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
      }
    }
  }

  .filter-controls {
    display: flex;
    gap: 0.5rem;

    select {
      padding: 0.5rem 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.75rem;
      background: #ffffff;
      color: #0f172a;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 110px;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.625rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.25rem;

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
  }

  /* Date Range Section */
  .date-range-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.625rem;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  .date-inputs {
    display: flex;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  .date-input {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    label {
      font-size: 0.625rem;
      font-weight: 500;
      color: #64748b;
    }

    .date-field {
      padding: 0.375rem 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.75rem;
      background: #ffffff;
      color: #0f172a;
      transition: all 0.2s ease;
      min-width: 110px;

      &:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
      }
    }
  }

  .date-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .clear-dates-btn {
    background: #10b981;
    color: #ffffff;
    border: none;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: #059669;
    }
  }

  .export-button {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: #3b82f6;
    color: #ffffff;
    border: none;
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  /* Main Content */
  .expense-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    flex: 1;
    overflow: visible;
    align-items: start;

    @media (min-width: 1200px) {
      grid-template-columns: 700px 1fr;
    }
  }

  .section-header {
    margin-bottom: 0.625rem;

    h2 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }

    p {
      color: #64748b;
      font-size: 0.625rem;
      margin: 0;
    }
  }

  .form-section {
    margin-bottom: 0.625rem;
    height: fit-content;
    
    .form-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      height: fit-content;
      min-width: 0;
      overflow: visible;
      margin-bottom: 0.625rem;
    }
  }

  .list-section {
    overflow: visible;
    display: flex;
    flex-direction: column;
    height: fit-content;

    .expense-list {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      overflow-y: auto;
      flex: 1;
      padding-right: 0.5rem;
      max-height: 500px;

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
  }

  /* Empty State */
  .empty-state {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.5rem 1.25rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    .empty-icon {
      font-size: 1.5rem;
      margin-bottom: 0.625rem;
      opacity: 0.5;
    }

    h3 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.375rem;
    }

    p {
      color: #64748b;
      margin-bottom: 0.75rem;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .reset-button {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 0.375rem 0.875rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #059669;
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .expense-container {
      padding: 0.625rem;
    }

    .expense-header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;

      .header-content h1 {
        font-size: 1.125rem;
      }
    }

    .controls-section {
      flex-direction: column;
      align-items: stretch;
      gap: 0.625rem;

      .search-control {
        min-width: auto;
        max-width: none;
      }

      .filter-controls {
        justify-content: center;
      }
    }

    .date-range-section {
      flex-direction: column;
      align-items: stretch;
      gap: 0.625rem;

      .date-inputs {
        justify-content: center;
      }
    }
  }

  @media (max-width: 768px) {
    .expense-container {
      padding: 0.5rem;
    }

    .expense-header .header-content h1 {
      font-size: 1rem;
    }

    .summary-card {
      padding: 0.5rem;
      min-width: auto;
    }

    .expense-content {
      gap: 0.875rem;
    }

    .date-inputs {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export default Expenses;
