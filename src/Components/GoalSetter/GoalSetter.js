import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function GoalSetter() {
    const [goalTitle, setGoalTitle] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [goalCategory, setGoalCategory] = useState('savings');
    const [goalDeadline, setGoalDeadline] = useState('');
    const [goalsList, setGoalsList] = useState(() => {
        const savedGoals = localStorage.getItem('financialGoals');
        return savedGoals ? JSON.parse(savedGoals) : [];
    });
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('deadline');
    
    // Save goals to localStorage whenever goalsList changes
    useEffect(() => {
        localStorage.setItem('financialGoals', JSON.stringify(goalsList));
    }, [goalsList]);
    
    // Categories for financial goals
    const categories = [
        { value: 'savings', label: 'Savings' },
        { value: 'investment', label: 'Investment' },
        { value: 'debt', label: 'Debt Repayment' },
        { value: 'purchase', label: 'Major Purchase' },
        { value: 'emergency', label: 'Emergency Fund' },
        { value: 'retirement', label: 'Retirement' },
        { value: 'education', label: 'Education' },
        { value: 'other', label: 'Other' }
    ];

    // Filter and sort goals
    const filteredAndSortedGoals = [...goalsList]
        .filter(goal => filterCategory === 'all' || goal.category === filterCategory)
        .sort((a, b) => {
            switch(sortBy) {
                case 'amount-desc':
                    return b.targetAmount - a.targetAmount;
                case 'amount-asc':
                    return a.targetAmount - b.targetAmount;
                case 'progress-desc':
                    return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount);
                case 'progress-asc':
                    return (a.currentAmount / a.targetAmount) - (b.currentAmount / b.targetAmount);
                case 'deadline':
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
                completed: false
            };
            
            setGoalsList([...goalsList, newGoal]);
            setGoalTitle('');
            setGoalAmount('');
            setGoalDeadline('');
        }
    };
    
    const handleUpdateProgress = (id, amount) => {
        setGoalsList(goalsList.map(goal => {
            if (goal.id === id) {
                const newAmount = goal.currentAmount + parseFloat(amount);
                const completed = newAmount >= goal.targetAmount;
                
                return {
                    ...goal,
                    currentAmount: completed ? goal.targetAmount : newAmount,
                    completed
                };
            }
            return goal;
        }));
    };
    
    const handleDeleteGoal = (id) => {
        setGoalsList(goalsList.filter(goal => goal.id !== id));
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
            <div className="header">
                <h1>Financial Goal Setter</h1>
                <p className="subtitle">Track your financial goals and monitor your progress</p>
            </div>
            
            <div className="goal-form-container">
                <h2>Create New Goal</h2>
                <form onSubmit={handleAddGoal} className="goal-form">
                    <div className="form-group">
                        <label htmlFor="goalTitle">Goal Title</label>
                        <input 
                            id="goalTitle"
                            type="text" 
                            value={goalTitle} 
                            onChange={(e) => setGoalTitle(e.target.value)} 
                            placeholder="e.g. Save for vacation" 
                            required
                        />
                    </div>
                    
                    <div className="form-row">
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
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="goalCategory">Category</label>
                            <select 
                                id="goalCategory"
                                value={goalCategory} 
                                onChange={(e) => setGoalCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="submit-btn">Create Goal</button>
                </form>
            </div>
            
            <div className="goals-container">
                <div className="goals-header">
                    <h2>Your Financial Goals</h2>
                    
                    <div className="goals-controls">
                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                </div>
                
                {filteredAndSortedGoals.length > 0 ? (
                    <div className="goals-grid">
                        {filteredAndSortedGoals.map((goal) => {
                            const progressPercentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                            const daysLeft = calculateDaysLeft(goal.deadline);
                            
                            return (
                                <div 
                                    key={goal.id} 
                                    className={`goal-card ${goal.completed ? 'completed' : ''}`}
                                >
                                    <div className="goal-header">
                                        <h3>{goal.title}</h3>
                                        <span className="category-badge">{categories.find(cat => cat.value === goal.category)?.label}</span>
                                    </div>
                                    
                                    <div className="goal-details">
                                        <div className="amount-details">
                                            <div className="detail-row">
                                                <span className="label">Target:</span>
                                                <span className="value">${goal.targetAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Current:</span>
                                                <span className="value">${goal.currentAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Remaining:</span>
                                                <span className="value">${(goal.targetAmount - goal.currentAmount).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="deadline-details">
                                            <div className="detail-row">
                                                <span className="label">Deadline:</span>
                                                <span className="value">{new Date(goal.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Status:</span>
                                                <span className="value status">
                                                    {goal.completed ? 'Completed!' : `${daysLeft} days left`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress" 
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{progressPercentage}% Complete</span>
                                    </div>
                                    
                                    {!goal.completed && (
                                        <div className="update-progress">
                                            <input 
                                                type="number" 
                                                placeholder="Amount" 
                                                min="0.01" 
                                                step="0.01"
                                                className="progress-input"
                                                id={`progress-${goal.id}`}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const input = document.getElementById(`progress-${goal.id}`);
                                                    if (input && input.value) {
                                                        handleUpdateProgress(goal.id, input.value);
                                                        input.value = '';
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
                        <p>{goalsList.length === 0 ? 'No goals set yet. Create your first financial goal above!' : 'No goals match your current filters.'}</p>
                        {goalsList.length > 0 && filterCategory !== 'all' && (
                            <button onClick={() => setFilterCategory('all')} className="reset-button">
                                Show All Goals
                            </button>
                        )}
                    </div>
                )}
            </div>
        </GoalSetterStyled>
    );
}

const GoalSetterStyled = styled.div`
    width: 100%;
    
    .header {
        margin-bottom: 2rem;
        
        h1 {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2b2c28;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            color: #64748b;
            font-size: 1rem;
        }
    }
    
    .goal-form-container {
        background: #fffafb;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        
        h2 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #2b2c28;
        }
    }
    
    .goal-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
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
            
            input, select {
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 0.95rem;
                background-color: #f8fafc;
                transition: all 0.2s ease;
                
                &:focus {
                    outline: none;
                    border-color: #7de2d1;
                    box-shadow: 0 0 0 3px rgba(125, 226, 209, 0.2);
                }
            }
        }
        
        .submit-btn {
            padding: 0.75rem 1.5rem;
            background: #339989;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            align-self: flex-start;
            
            &:hover {
                background: #2a7d6f;
            }
        }
    }
    
    .goals-container {
        margin-top: 2rem;
    }
    
    .goals-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;
        
        h2 {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2b2c28;
        }
        
        .goals-controls {
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
                    border-color: #7de2d1;
                }
            }
        }
    }
    
    .goals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .goal-card {
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        transition: transform 0.2s ease;
        padding: 1.5rem;
        
        &:hover {
            transform: translateY(-5px);
        }
        
        &.completed {
            border-color: #339989;
            box-shadow: 0 4px 20px rgba(51, 153, 137, 0.1);
        }
    }
    
    .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
        
        h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2b2c28;
            margin: 0;
        }
        
        .category-badge {
            font-size: 0.8rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            background-color: rgba(51, 153, 137, 0.1);
            color: #339989;
        }
    }
    
    .goal-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.25rem;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        
        .label {
            color: #64748b;
            font-size: 0.9rem;
        }
        
        .value {
            font-weight: 600;
            color: #2b2c28;
        }
        
        .status {
            color: #339989;
        }
    }
    
    .progress-container {
        margin-bottom: 1.25rem;
    }
    
    .progress-bar {
        height: 8px;
        background-color: #e5e7eb;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        overflow: hidden;
        
        .progress {
            height: 100%;
            background-color: #339989;
            transition: width 0.3s ease;
        }
    }
    
    .progress-text {
        font-size: 0.9rem;
        color: #64748b;
    }
    
    .update-progress {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1rem;
        
        .progress-input {
            flex: 1;
            padding: 0.5rem 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        
        .update-btn {
            padding: 0.5rem 0.75rem;
            background: #339989;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
                background: #2a7d6f;
            }
        }
    }
    
    .delete-btn {
        width: 100%;
        padding: 0.5rem;
        background: transparent;
        color: #ef4444;
        border: 1px solid #ef4444;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            background: rgba(239, 68, 68, 0.1);
        }
    }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        text-align: center;
        
        p {
            margin-bottom: 1rem;
            color: #64748b;
        }
        
        .reset-button {
            background: #339989;
            color: #fffafb;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
                background: #2a7d6f;
            }
        }
    }
`;

export default GoalSetter;
