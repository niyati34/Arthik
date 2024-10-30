import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import ExpenseForm from "./ExpenseForm";
import IncomeItem from "../IncomeItem/IncomeItem";
import { useGlobalContext } from "../../context/globalContext";

function Expenses() {
  const { expenses, addExpense, deleteExpense, totalExpenses } =
    useGlobalContext();
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  useEffect(() => {
    let result = [...expenses];

    if (filter !== "all") {
      result = result.filter((expense) => expense.category === filter);
    }

    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter((expense) => new Date(expense.date) >= fromDate);
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      result = result.filter((expense) => new Date(expense.date) <= toDate);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.title?.toLowerCase().includes(query) ||
          expense.description?.toLowerCase().includes(query) ||
          expense.category?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredExpenses(result);
  }, [expenses, filter, searchQuery, sortBy, dateRange]);

  const categories = [
    "all",
    ...new Set(expenses.map((expense) => expense.category)),
  ];

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
              <div className="summary-icon">💸</div>
              <div className="summary-content">
                <h3>Total Expenses</h3>
                <span className="amount">${totalExpenses.toFixed(2)}</span>
                <span className="count">
                  {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-control">
            <div className="search-icon">🔍</div>
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
          {(dateRange.from || dateRange.to) && (
            <button
              className="clear-dates-btn"
              onClick={() => setDateRange({ from: "", to: "" })}
            >
              Clear Dates
            </button>
          )}
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
                {filteredExpenses.length > 0
                  ? `${filteredExpenses.length} expense${
                      filteredExpenses.length !== 1 ? "s" : ""
                    } found`
                  : "No expenses yet"}
              </p>
            </div>

            {filteredExpenses.length > 0 ? (
              <div className="expense-list">
                {filteredExpenses.map((expense) => {
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
                      indicatorColor="var(--color-red)"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Expenses Found</h3>
                <p>
                  {filter !== "all" || searchQuery || dateRange.from || dateRange.to
                    ? "No expenses match your current filters."
                    : "Start by adding your first expense above."}
                </p>
                {(filter !== "all" || searchQuery || dateRange.from || dateRange.to) && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                      setDateRange({ from: "", to: "" });
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
      </div>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: #fffafb;

  .expense-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header Styles */
  .expense-header {
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

  .expense-summary {
    .summary-card {
      background: #fffafb;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      min-width: 280px;
      box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }

      .summary-icon {
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        background: #fffbeb;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .summary-content {
        h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2b2c28;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amount {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #f59e0b;
          margin-bottom: 0.5rem;
        }

        .count {
          font-size: 0.9rem;
          color: #6e7e85;
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
    margin-bottom: 2rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .search-control {
    position: relative;
    flex: 1;
    min-width: 300px;
    max-width: 500px;

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      color: #9ca3af;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      background: #fffafb;
      color: #2b2c28;
      transition: all 0.2s ease;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      }
    }
  }

  .filter-controls {
    display: flex;
    gap: 1rem;

    select {
      padding: 1rem 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      font-size: 0.95rem;
      background: #fffafb;
      color: #2b2c28;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 140px;

      &:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      }

      option {
        padding: 0.5rem;
      }
    }
  }

  /* Date Range Section */
  .date-range-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .date-inputs {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .date-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #4b5563;
    }

    .date-field {
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.95rem;
      background: #fffafb;
      color: #2b2c28;
      transition: all 0.2s ease;
      min-width: 150px;

      &:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
      }
    }
  }

  .clear-dates-btn {
    background: #f59e0b;
    color: #fffafb;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: #d97706;
      transform: translateY(-1px);
    }
  }

  /* Main Content */
  .expense-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 1200px) {
      grid-template-columns: 400px 1fr;
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

  .form-section {
    .form-container {
      background: #fffafb;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
      height: fit-content;
    }
  }

  .list-section {
    .expense-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  /* Empty State */
  .empty-state {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2b2c28;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6e7e85;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .reset-button {
      background: #f59e0b;
      color: #fffafb;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #d97706;
        transform: translateY(-1px);
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .expense-container {
      padding: 1.5rem;
    }

    .expense-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;

      .header-content h1 {
        font-size: 2rem;
      }
    }

    .controls-section {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

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
      gap: 1rem;

      .date-inputs {
        justify-content: center;
      }
    }
  }

  @media (max-width: 768px) {
    .expense-container {
      padding: 1rem;
    }

    .expense-header .header-content h1 {
      font-size: 1.75rem;
    }

    .summary-card {
      padding: 1.5rem;
      min-width: auto;
    }

    .expense-content {
      gap: 1.5rem;
    }

    .date-inputs {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export default Expenses;
