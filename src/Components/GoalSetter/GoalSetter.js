import React, { useState, useEffect } from "react";
import styled from "styled-components";

function GoalSetter() {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalCategory, setGoalCategory] = useState("savings");
  const [goalDeadline, setGoalDeadline] = useState("");
  const [goalsList, setGoalsList] = useState(() => {
    const savedGoals = localStorage.getItem("financialGoals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  useEffect(() => {
    localStorage.setItem("financialGoals", JSON.stringify(goalsList));
  }, [goalsList]);

  const categories = [
    { value: "savings", label: "Savings", icon: "💰" },
    { value: "investment", label: "Investment", icon: "📈" },
    { value: "debt", label: "Debt Repayment", icon: "💳" },
    { value: "purchase", label: "Major Purchase", icon: "🏠" },
    { value: "emergency", label: "Emergency Fund", icon: "🆘" },
    { value: "retirement", label: "Retirement", icon: "🌅" },
    { value: "education", label: "Education", icon: "🎓" },
    { value: "other", label: "Other", icon: "🎯" },
  ];

  const filteredAndSortedGoals = [...goalsList]
    .filter(
      (goal) => filterCategory === "all" || goal.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "amount-desc":
          return b.targetAmount - a.targetAmount;
        case "amount-asc":
          return a.targetAmount - b.targetAmount;
        case "progress-desc":
          return (
            b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
          );
        case "progress-asc":
          return (
            a.currentAmount / a.targetAmount - b.currentAmount / b.targetAmount
          );
        case "deadline":
        default:
          return new Date(a.deadline) - new Date(b.deadline);
      }
    });

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (goalTitle && goalAmount && goalDeadline) {
      const newGoal = {
        id: Date.now().toString(),
        title: goalTitle,
        targetAmount: parseFloat(goalAmount),
        currentAmount: 0,
        category: goalCategory,
        deadline: goalDeadline,
        createdAt: new Date().toISOString(),
        completed: false,
      };

      setGoalsList([...goalsList, newGoal]);
      setGoalTitle("");
      setGoalAmount("");
      setGoalDeadline("");
    }
  };

  const handleUpdateProgress = (id, amount) => {
    setGoalsList(
      goalsList.map((goal) => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + parseFloat(amount);
          const completed = newAmount >= goal.targetAmount;

          return {
            ...goal,
            currentAmount: completed ? goal.targetAmount : newAmount,
            completed,
          };
        }
        return goal;
      })
    );
  };

  const handleDeleteGoal = (id) => {
    setGoalsList(goalsList.filter((goal) => goal.id !== id));
  };

  const calculateDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft;
  };

  return (
    <GoalSetterStyled>
      <div className="goals-container">
        {/* Header Section */}
        <div className="goals-header">
          <div className="header-content">
            <h1>Financial Goal Setter</h1>
            <p>Set, track, and achieve your financial objectives</p>
          </div>
          <div className="goals-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="summary-content">
                <h3>Active Goals</h3>
                <span className="count">{goalsList.length}</span>
                <span className="status">
                  {goalsList.filter(g => !g.completed).length} In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="goals-content">
          <div className="form-section">
            <div className="section-header">
              <h2>Create New Goal</h2>
              <p>Define your financial target and timeline</p>
            </div>
            <div className="form-container">
              <form onSubmit={handleAddGoal} className="goal-form">
                <div className="form-title">Create New Goal</div>
                
                {/* First Row: Title and Amount */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Goal Title</label>
                    <input
                      type="text"
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="e.g. Save for vacation"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Target Amount ($)</label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      placeholder="1000.00"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Second Row: Category and Deadline */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value)}
                      className="form-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Date</label>
                    <input
                      type="date"
                      value={goalDeadline}
                      onChange={(e) => setGoalDeadline(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  Create Goal
                </button>
              </form>
            </div>
          </div>

          <div className="goals-list-section">
            <div className="section-header">
              <h2>Your Financial Goals</h2>
              <p>Track progress and stay motivated</p>
            </div>

            <div className="list-controls">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="deadline">Sort by Deadline</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="progress-desc">Most Progress</option>
                <option value="progress-asc">Least Progress</option>
              </select>
            </div>

            {filteredAndSortedGoals.length > 0 ? (
              <div className="goals-list">
                {filteredAndSortedGoals.map((goal) => {
                  const progressPercentage = Math.min(
                    100,
                    Math.round((goal.currentAmount / goal.targetAmount) * 100)
                  );
                  const daysLeft = calculateDaysLeft(goal.deadline);
                  const categoryInfo = categories.find(cat => cat.value === goal.category);

                  return (
                    <div
                      key={goal.id}
                      className={`goal-card ${goal.completed ? "completed" : ""}`}
                    >
                      <div className="goal-header">
                        <div className="goal-icon">{categoryInfo?.icon}</div>
                        <div className="goal-info">
                          <h3>{goal.title}</h3>
                          <span className="category-badge">
                            {categoryInfo?.label}
                          </span>
                        </div>
                      </div>

                      <div className="goal-amounts">
                        <div className="amount-row">
                          <span className="label">Target:</span>
                          <span className="value">${typeof goal.targetAmount === 'number' && !isNaN(goal.targetAmount) ? goal.targetAmount.toFixed(2) : '0.00'}</span>
                        </div>
                        <div className="amount-row">
                          <span className="label">Current:</span>
                          <span className="value">${typeof goal.currentAmount === 'number' && !isNaN(goal.currentAmount) ? goal.currentAmount.toFixed(2) : '0.00'}</span>
                        </div>
                        <div className="amount-row">
                          <span className="label">Remaining:</span>
                          <span className="value remaining">
                            ${typeof (goal.targetAmount - goal.currentAmount) === 'number' && !isNaN(goal.targetAmount - goal.currentAmount) ? (goal.targetAmount - goal.currentAmount).toFixed(2) : '0.00'}
                          </span>
                        </div>
                      </div>

                      <div className="goal-timeline">
                        <div className="timeline-row">
                          <span className="label">Deadline:</span>
                          <span className="value">
                            {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="timeline-row">
                          <span className="label">Status:</span>
                          <span className={`status ${goal.completed ? 'completed' : 'in-progress'}`}>
                            {goal.completed ? "🎉 Completed!" : `${daysLeft} days left`}
                          </span>
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {progressPercentage}% Complete
                        </span>
                      </div>

                      {!goal.completed && (
                        <div className="update-section">
                          <input
                            type="number"
                            placeholder="Add amount"
                            min="0.01"
                            step="0.01"
                            className="progress-input"
                            id={`progress-${goal.id}`}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(
                                `progress-${goal.id}`
                              );
                              if (input && input.value) {
                                handleUpdateProgress(goal.id, input.value);
                                input.value = "";
                              }
                            }}
                            className="update-btn"
                          >
                            Update Progress
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="delete-btn"
                      >
                        Delete Goal
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>No Goals Found</h3>
                <p>
                  {goalsList.length === 0
                    ? "Start by creating your first financial goal above!"
                    : "No goals match your current filters."}
                </p>
                {goalsList.length > 0 && filterCategory !== "all" && (
                  <button
                    onClick={() => setFilterCategory("all")}
                    className="reset-button"
                  >
                    Show All Goals
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </GoalSetterStyled>
  );
}

const GoalSetterStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: transparent;
  overflow: visible;

  .goals-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  /* Header Styles */
  .goals-header {
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

  .goals-summary {
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

        .count {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 0.125rem;
          line-height: 1;
        }

        .status {
          font-size: 0.5rem;
          color: #10b981;
          font-weight: 500;
          background: #f0fdf4;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }
      }
    }
  }

  /* Main Content */
  .goals-content {
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

  /* Form Section */
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

  .goal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    width: 100%;
    min-height: fit-content;

    .form-title {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;

      label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #64748b;
      }

      .form-input,
      .form-select {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        font-size: 0.8125rem;
        background: #ffffff;
        color: #0f172a;
        box-sizing: border-box;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }

      .form-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.75rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
        cursor: pointer;

        &:hover {
          border-color: #cbd5e1;
          background-color: #f8fafc;
        }

        &:focus {
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

    .submit-btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;

      &:hover {
        background: #059669;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }

  /* Goals List Section */
  .goals-list-section {
    overflow: visible;
    display: flex;
    flex-direction: column;
    height: fit-content;

    .list-controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
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

  .goals-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 500px;
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

  .goal-card {
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

    &.completed {
      border-color: #10b981;
      background: #f0fdf4;
    }
  }

  .goal-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;

    .goal-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .goal-info {
      flex: 1;

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.375rem;
      }

      .category-badge {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        display: inline-block;
      }
    }
  }

  .goal-amounts,
  .goal-timeline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .amount-row,
  .timeline-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.375rem 0;

    .label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .value {
      font-size: 0.75rem;
      font-weight: 600;
      color: #0f172a;

      &.remaining {
        color: #10b981;
      }
    }

    .status {
      font-size: 0.75rem;
      font-weight: 500;

      &.completed {
        color: #10b981;
      }

      &.in-progress {
        color: #10b981;
      }
    }
  }

  .progress-section {
    margin-bottom: 1rem;

    .progress-bar {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #059669);
        transition: width 0.3s ease;
        border-radius: 4px;
      }
    }

    .progress-text {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }
  }

  .update-section {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;

    .progress-input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.8125rem;
      background: #ffffff;
      color: #0f172a;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        border-color: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    .update-btn {
      background: #10b981;
      color: #ffffff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: #059669;
      }
    }
  }

  .delete-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
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

  /* Responsive Design */
  @media (max-width: 1024px) {
    .goals-container {
      padding: 0.625rem;
    }

    .goals-header {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;

      .header-content h1 {
        font-size: 1.125rem;
      }
    }

    .goals-content {
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .goals-container {
      padding: 0.5rem;
    }

    .goals-header .header-content h1 {
      font-size: 1rem;
    }

    .summary-card {
      padding: 0.5rem;
      min-width: auto;
    }

    .goal-form .form-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .goal-amounts,
    .goal-timeline {
      grid-template-columns: 1fr;
    }

    .list-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;

      select {
        min-width: auto;
        width: 100%;
      }
    }

    .goals-list {
      max-height: 400px;
    }
  }
`;

export default GoalSetter;

