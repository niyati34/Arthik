import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";
import { dollar, calender, comment, trash } from "../utils/Icons";

function History({ limit = 5, showAll = false, allowDelete = false }) {
  const { transactionHistory, deleteIncome, deleteExpense } =
    useGlobalContext();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get all transactions or limited number based on props
  useEffect(() => {
    let history = transactionHistory;

    // Apply search filter
    if (searchQuery) {
      history = history.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== "all") {
      history = history.filter((transaction) => transaction.type === filter);
    }

    // Apply sorting
    history.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        return sortOrder === "asc"
          ? parseFloat(a.amount) - parseFloat(b.amount)
          : parseFloat(b.amount) - parseFloat(a.amount);
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

    // Limit results if not showing all
    if (!showAll && !searchQuery && filter === "all") {
      history = history.slice(0, limit);
    }

    setTransactions(history);
  }, [
    transactionHistory,
    limit,
    showAll,
    searchQuery,
    filter,
    sortBy,
    sortOrder,
  ]);

  const handleDelete = (transaction) => {
    if (transaction.type === "income") {
      deleteIncome(transaction.id);
    } else {
      deleteExpense(transaction.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type) => {
    return type === "income" ? "#339989" : "#ef476f";
  };

  return (
    <HistoryStyled>
      <div className="history-header">
        <h3>Transaction History</h3>
        {showAll && (
          <div className="history-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        )}
        }
      </div>

      {transactions.length > 0 ? (
        <div className="transaction-list">
          {transactions.map((transaction) => {
            const amount = parseFloat(transaction.amount || 0);
            const typeColor = getTypeColor(transaction.type);

            return (
              <div className="transaction-item" key={transaction.id}>
                <div
                  className="transaction-type"
                  style={{ backgroundColor: typeColor }}
                >
                  <span>{transaction.type === "income" ? "+" : "-"}</span>
                </div>

                <div className="transaction-details">
                  <div className="transaction-title">
                    <h4>{transaction.title || "Untitled"}</h4>
                    <span className="transaction-date">
                      {calender}{" "}
                      {formatDate(transaction.date || transaction.createdAt)}
                    </span>
                  </div>

                  {transaction.description && (
                    <p className="transaction-description">
                      {comment} {transaction.description}
                    </p>
                  )}

                  <div className="transaction-category">
                    <span>{transaction.category || "Uncategorized"}</span>
                  </div>
                </div>

                <div
                  className="transaction-amount"
                  style={{ color: typeColor }}
                >
                  {dollar} {isNaN(amount) ? "0.00" : amount.toFixed(2)}
                </div>

                {allowDelete && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(transaction)}
                  >
                    {trash}
                  </button>
                )}
              </div>
            );
          })}

          {!showAll && transactions.length >= limit && (
            <div className="view-all">
              <a href="#">View all transactions</a>
            </div>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <p>No transactions available.</p>
        </div>
      )}
    </HistoryStyled>
  );
}

const HistoryStyled = styled.div`
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  width: 100%;

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
    }

    .history-controls {
      display: flex;
      gap: 0.75rem;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
      }

      .search-container {
        input {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          outline: none;
          width: 150px;

          &:focus {
            border-color: #0f172a;
          }
        }
      }

      .filter-container {
        display: flex;
        gap: 0.375rem;

        select {
          padding: 0.375rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          outline: none;
          background: #ffffff;
          cursor: pointer;

          &:focus {
            border-color: #0f172a;
          }
        }
      }
    }
  }

  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;

    /* Custom scrollbar styling */
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

    .transaction-item {
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 8px;
      padding: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
      border: 1px solid #f1f5f9;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        border-color: #e2e8f0;
      }

      .transaction-type {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.75rem;

        span {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
        }
      }

      .transaction-details {
        flex: 1;

        .transaction-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;

          @media (max-width: 576px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          h4 {
            font-size: 0.875rem;
            font-weight: 500;
            color: #0f172a;
          }

          .transaction-date {
            font-size: 0.75rem;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        }

        .transaction-description {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .transaction-category {
          span {
            font-size: 0.625rem;
            background: #f1f5f9;
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            color: #64748b;
          }
        }
      }

      .transaction-amount {
        font-size: 1rem;
        font-weight: 600;
        margin-left: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 0.375rem;
        color: #64748b;
        transition: color 0.2s ease;

        &:hover {
          color: #dc2626;
        }
      }
    }

    .view-all {
      text-align: center;
      margin-top: 0.75rem;

      a {
        color: #0f172a;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.875rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 1.5rem 0;

    p {
      color: #64748b;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 768px) {
    .transaction-list .transaction-item {
      padding: 0.625rem;

      .transaction-type {
        width: 28px;
        height: 28px;
        margin-right: 0.5rem;
      }

      .transaction-details .transaction-title h4 {
        font-size: 0.8rem;
      }

      .transaction-amount {
        font-size: 0.875rem;
      }
    }
  }
`;

export default History;

