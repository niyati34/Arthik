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

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...expenses];

    // Apply category filter
    if (filter !== "all") {
      result = result.filter((expense) => expense.category === filter);
    }

    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter((expense) => new Date(expense.date) >= fromDate);
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      result = result.filter((expense) => new Date(expense.date) <= toDate);
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.title?.toLowerCase().includes(query) ||
          expense.description?.toLowerCase().includes(query) ||
          expense.category?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
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

  // Get unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  return (
    <ExpenseStyled>
      <InnerLayout>
        <div className="header">
          <h1>Expense Manager</h1>
          <div className="summary-card">
            <h2>Total Expenses</h2>
            <p className="amount">${totalExpenses.toFixed(2)}</p>
            <p className="count">
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-sort">
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

        <div className="date-range">
          <div className="date-input">
            <label>From:</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
            />
          </div>
          <div className="date-input">
            <label>To:</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
            />
          </div>
          {(dateRange.from || dateRange.to) && (
            <button
              className="clear-dates"
              onClick={() => setDateRange({ from: "", to: "" })}
            >
              Clear Dates
            </button>
          )}
        </div>

        <div className="expense-content">
          <div className="form-container">
            <h3>Add New Expense</h3>
            <ExpenseForm addExpense={addExpense} />
          </div>

          <div className="expenses">
            <h3>
              Expense History{" "}
              {filteredExpenses.length > 0 && `(${filteredExpenses.length})`}
            </h3>

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
                <p>No matching expenses found.</p>
                {(filter !== "all" ||
                  searchQuery ||
                  dateRange.from ||
                  dateRange.to) && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                      setDateRange({ from: "", to: "" });
                    }}
                    className="reset-button"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1.5rem;

    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2b2c28;
    }
  }

  .summary-card {
    background: #fffafb;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.08);
    padding: 1.5rem 2rem;
    min-width: 200px;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #2b2c28;
    }

    .amount {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: #d97706;
    }

    .count {
      font-size: 0.8rem;
      color: #131515;
      opacity: 0.7;
    }
  }

  .controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;

    .search-container {
      flex: 1;
      min-width: 200px;
      max-width: 400px;

      input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
        }
      }
    }

    .filter-sort {
      display: flex;
      gap: 0.75rem;

      select {
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        background-color: #f8fafc;
        cursor: pointer;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #f59e0b;
        }
      }
    }
  }

  .date-range {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    align-items: center;

    .date-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      label {
        font-size: 0.9rem;
        color: #4b5563;
      }

      input {
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #f59e0b;
        }
      }
    }

    .clear-dates {
      background: #f59e0b;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #d97706;
      }
    }
  }

  .expense-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 968px) {
      grid-template-columns: 350px 1fr;
    }

    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #2b2c28;
    }
  }

  .form-container {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
  }

  .expenses {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);

    .expense-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;

    p {
      margin-bottom: 1rem;
      color: #64748b;
    }

    .reset-button {
      background: #f59e0b;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #d97706;
      }
    }
  }
`;

export default Expenses;
