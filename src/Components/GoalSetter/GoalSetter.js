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
              <div className="summary-icon">🎯</div>
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

        {/* Form Section */}
        <div className="form-section">
          <div className="section-header">
            <h2>Create New Goal</h2>
            <p>Define your financial target and timeline</p>
          </div>
          <div className="form-container">
            <form onSubmit={handleAddGoal} className="goal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goalTitle">Goal Title</label>
                  <input
                    id="goalTitle"
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. Save for vacation"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="goalAmount">Target Amount ($)</label>
                  <input
                    id="goalAmount"
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="goalCategory">Category</label>
                  <select
                    id="goalCategory"
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
                  <label htmlFor="goalDeadline">Target Date</label>
                  <input
                    id="goalDeadline"
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

        {/* Goals List Section */}
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
            <div className="goals-grid">
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
                        <span className="value">${goal.targetAmount.toFixed(2)}</span>
                      </div>
                      <div className="amount-row">
                        <span className="label">Current:</span>
                        <span className="value">${goal.currentAmount.toFixed(2)}</span>
                      </div>
                      <div className="amount-row">
                        <span className="label">Remaining:</span>
                        <span className="value remaining">
                          ${(goal.targetAmount - goal.currentAmount).toFixed(2)}
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
              <div className="empty-icon">🎯</div>
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
    </GoalSetterStyled>
  );
}

const GoalSetterStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: #fffafb;

  .goals-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Header Styles */
  .goals-header {
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

  .goals-summary {
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
        background: linear-gradient(90deg, #ec4899, #f472b6);
      }

      .summary-icon {
        font-size: 2.5rem;
        width: 60px;
        height: 60px;
        background: #fdf2f8;
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

        .count {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #ec4899;
          margin-bottom: 0.5rem;
        }

        .status {
          font-size: 0.9rem;
          color: #10b981;
          font-weight: 500;
          background: #f0fdf4;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          display: inline-block;
        }
      }
    }
  }

  /* Form Section */
  .form-section {
    margin-bottom: 3rem;

    .form-container {
      background: #fffafb;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
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

  .goal-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #4b5563;
      }

      .form-input,
      .form-select {
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.95rem;
        background: #fffafb;
        color: #2b2c28;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .submit-btn {
      background: #ec4899;
      color: #fffafb;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      align-self: flex-start;

      &:hover {
        background: #db2777;
        transform: translateY(-1px);
      }
    }
  }

  /* Goals List Section */
  .goals-list-section {
    .list-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;

      select {
        padding: 0.75rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.95rem;
        background: #fffafb;
        color: #2b2c28;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 160px;

        &:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }
      }
    }
  }

  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .goal-card {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(19, 21, 21, 0.08);
      border-color: #ec4899;
    }

    &.completed {
      border-color: #10b981;
      background: #f0fdf4;
    }
  }

  .goal-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .goal-icon {
      font-size: 2rem;
      width: 50px;
      height: 50px;
      background: #f3f4f6;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .goal-info {
      flex: 1;

      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2b2c28;
        margin-bottom: 0.5rem;
      }

      .category-badge {
        font-size: 0.8rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 6px;
        background: rgba(236, 72, 153, 0.1);
        color: #ec4899;
        display: inline-block;
      }
    }
  }

  .goal-amounts,
  .goal-timeline {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .amount-row,
  .timeline-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 0.85rem;
      color: #6e7e85;
      font-weight: 500;
    }

    .value {
      font-weight: 600;
      color: #2b2c28;

      &.remaining {
        color: #ec4899;
      }
    }

    .status {
      font-size: 0.85rem;
      font-weight: 500;

      &.completed {
        color: #10b981;
      }

      &.in-progress {
        color: #f59e0b;
      }
    }
  }

  .progress-section {
    margin-bottom: 1.5rem;

    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ec4899, #f472b6);
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: 0.85rem;
      color: #6e7e85;
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
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 0.9rem;
      background: #fffafb;

      &:focus {
        outline: none;
        border-color: #ec4899;
      }
    }

    .update-btn {
      background: #ec4899;
      color: #fffafb;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: #db2777;
      }
    }
  }

  .delete-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: #ef4444;
    border: 1px solid #ef4444;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
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
      background: #ec4899;
      color: #fffafb;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #db2777;
        transform: translateY(-1px);
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .goals-container {
      padding: 1.5rem;
    }

    .goals-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1.5rem;

      .header-content h1 {
        font-size: 2rem;
      }
    }

    .goals-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .goals-container {
      padding: 1rem;
    }

    .goals-header .header-content h1 {
      font-size: 1.75rem;
    }

    .summary-card {
      padding: 1.5rem;
      min-width: auto;
    }

    .goal-form .form-row {
      grid-template-columns: 1fr;
    }

    .goal-amounts,
    .goal-timeline {
      grid-template-columns: 1fr;
    }

    .list-controls {
      flex-direction: column;
      align-items: stretch;

      select {
        min-width: auto;
      }
    }
  }
`;

export default GoalSetter;
