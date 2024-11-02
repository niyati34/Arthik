import React, { useState, useEffect } from "react";
import styled from "styled-components";
import IncomeForm from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";
import { useGlobalContext } from "../../context/globalContext";

function Income() {
  const { incomes, addIncome, deleteIncome, totalIncomes } = useGlobalContext();
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    let result = [...incomes];

    if (filter !== "all") {
      result = result.filter((income) => income.category === filter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (income) =>
          income.title?.toLowerCase().includes(query) ||
          income.description?.toLowerCase().includes(query) ||
          income.category?.toLowerCase().includes(query)
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

    setFilteredIncomes(result);
  }, [incomes, filter, searchQuery, sortBy]);

  const categories = [
    "all",
    ...new Set(incomes.map((income) => income.category)),
  ];

  return (
    <IncomeStyled>
      <div className="income-container">
        {/* Compact Header */}
        <div className="income-header">
          <div className="header-content">
            <h1>Income Management</h1>
            <p>Track and manage your income sources</p>
          </div>
          <div className="income-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9.5A3.5 3.5 0 0 0 6 8.5A3.5 3.5 0 0 0 9.5 12H14.5A3.5 3.5 0 0 1 18 15.5A3.5 3.5 0 0 1 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="summary-content">
                <h3>Total Income</h3>
                <span className="amount">${totalIncomes.toFixed(2)}</span>
                <span className="count">{incomes.length} sources</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Controls */}
        <div className="controls-section">
          <div className="search-control">
            <input
              type="text"
              placeholder="Search income..."
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

        {/* Main Content Grid */}
        <div className="income-content">
          <div className="form-section">
            <div className="section-header">
              <h2>Add New Income</h2>
            </div>
            <div className="form-container">
              <IncomeForm addIncome={addIncome} />
            </div>
          </div>

          <div className="list-section">
            <div className="section-header">
              <h2>Income History</h2>
              <p>{filteredIncomes.length} source{filteredIncomes.length !== 1 ? 's' : ''} found</p>
            </div>

            {filteredIncomes.length > 0 ? (
              <div className="income-list">
                {filteredIncomes.map((income) => {
                  const { id, title, amount, date, category, description } = income;
                  return (
                    <IncomeItem
                      key={id}
                      id={id}
                      title={title || "N/A"}
                      description={description || "N/A"}
                      amount={amount}
                      date={date || "N/A"}
                      category={category || "N/A"}
                      type="income"
                      deleteItem={deleteIncome}
                      indicatorColor="var(--color-green)"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No Income Sources Found</h3>
                <p>
                  {filter !== "all"
                    ? "No income sources match your current filters."
                    : "Start by adding your first income source above."}
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="reset-button"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: hidden;

  .income-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* Compact Header */
  .income-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1.5rem;

    .header-content {
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
        line-height: 1.2;
      }

      p {
        color: #64748b;
        font-size: 0.875rem;
        margin: 0;
      }
    }
  }

  .income-summary {
    .summary-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      min-width: 200px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 0.75rem;

      .summary-icon {
        width: 32px;
        height: 32px;
        background: #f0fdf4;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #10b981;
      }

      .summary-content {
        h3 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 0.25rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .amount {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 0.125rem;
          line-height: 1;
        }

        .count {
          font-size: 0.625rem;
          color: #94a3b8;
          font-weight: 500;
        }
      }
    }
  }

  /* Compact Controls */
  .controls-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .search-control {
    flex: 1;
    min-width: 200px;
    max-width: 300px;

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.875rem;
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
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.75rem;
      background: #ffffff;
      color: #0f172a;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 120px;

      &:focus {
        outline: none;
        border-color: #10b981;
      }
    }
  }

  /* Main Content Grid */
  .income-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    flex: 1;
    overflow: hidden;
    align-items: start;

    @media (min-width: 1200px) {
      grid-template-columns: 500px 1fr;
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

  .form-section {
    margin-bottom: 1rem;
    
    .form-container {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      height: fit-content;
      min-width: 0;
      overflow: visible;
    }
  }

  .list-section {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .income-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      flex: 1;
      padding-right: 0.5rem;

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
    padding: 2rem 1.5rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

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

  /* Responsive Design */
  @media (max-width: 1024px) {
    .income-container {
      padding: 0.875rem;
    }

    .income-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;

      .header-content h1 {
        font-size: 1.375rem;
      }
    }

    .controls-section {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;

      .search-control {
        min-width: auto;
        max-width: none;
      }

      .filter-controls {
        justify-content: center;
      }
    }
  }

  @media (max-width: 768px) {
    .income-container {
      padding: 0.75rem;
    }

    .income-header .header-content h1 {
      font-size: 1.25rem;
    }

    .summary-card {
      padding: 0.875rem;
      min-width: auto;
    }

    .income-content {
      gap: 1rem;
    }
  }
`;

export default Income;
