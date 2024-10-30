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
        {/* Header Section */}
        <div className="income-header">
          <div className="header-content">
            <h1>Income Management</h1>
            <p>Track and manage all your income sources</p>
          </div>
          <div className="income-summary">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>Total Income</h3>
                <span className="amount">${totalIncomes.toFixed(2)}</span>
                <span className="count">
                  {incomes.length} source{incomes.length !== 1 ? "s" : ""}
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
              placeholder="Search income sources..."
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

        {/* Main Content */}
        <div className="income-content">
          <div className="form-section">
            <div className="section-header">
              <h2>Add New Income</h2>
              <p>Record a new income source</p>
            </div>
            <div className="form-container">
              <IncomeForm addIncome={addIncome} />
            </div>
          </div>

          <div className="list-section">
            <div className="section-header">
              <h2>Income History</h2>
              <p>
                {filteredIncomes.length > 0
                  ? `${filteredIncomes.length} income source${
                      filteredIncomes.length !== 1 ? "s" : ""
                    } found`
                  : "No income sources yet"}
              </p>
            </div>

            {filteredIncomes.length > 0 ? (
              <div className="income-list">
                {filteredIncomes.map((income) => {
                  const { id, title, amount, date, category, description } =
                    income;
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
                <div className="empty-icon">📊</div>
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
  min-height: 100%;
  background: #fffafb;

  .income-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header Styles */
  .income-header {
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

  .income-summary {
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
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .summary-icon {
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        background: #f0fdf4;
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
          color: #10b981;
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
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
      }

      option {
        padding: 0.5rem;
      }
    }
  }

  /* Main Content */
  .income-content {
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
    .income-list {
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
      background: #10b981;
      color: #fffafb;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #059669;
        transform: translateY(-1px);
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .income-container {
      padding: 1.5rem;
    }

    .income-header {
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
  }

  @media (max-width: 768px) {
    .income-container {
      padding: 1rem;
    }

    .income-header .header-content h1 {
      font-size: 1.75rem;
    }

    .summary-card {
      padding: 1.5rem;
      min-width: auto;
    }

    .income-content {
      gap: 1.5rem;
    }
  }
`;

export default Income;
