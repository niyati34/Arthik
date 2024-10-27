import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BudgetTracker = () => {
    const { savingsPerBudget, expenses } = useGlobalContext();
    const [sortBy, setSortBy] = useState('name');
    const [filterStatus, setFilterStatus] = useState('all');

    const COLORS = ['#339989', '#d97706', '#ef4444'];

    // Sort and filter budgets
    const sortedAndFilteredBudgets = [...savingsPerBudget]
        .filter(budget => {
            if (filterStatus === 'all') return true;
            return budget.status.toLowerCase().includes(filterStatus.toLowerCase());
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                case 'spent-desc':
                    return b.spent - a.spent;
                case 'spent-asc':
                    return a.spent - b.spent;
                case 'savings-desc':
                    return b.savings - a.savings;
                case 'savings-asc':
                    return a.savings - b.savings;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    const renderPieChart = (budget) => {
        const data = [
            { name: 'Spent', value: budget.spent },
            { name: 'Savings', value: budget.savings > 0 ? budget.savings : 0 },
            { name: 'Over', value: budget.savings < 0 ? Math.abs(budget.savings) : 0 },
        ];

        return (
            <PieChart width={180} height={180}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
        );
    };
    
    // Calculate total budget and total spent
    const totalBudget = savingsPerBudget.reduce((total, budget) => total + budget.amount, 0);
    const totalSpent = savingsPerBudget.reduce((total, budget) => total + budget.spent, 0);

    return (
        <BudgetTrackerStyled>
            <div className="header">
                <h1>Budget Tracker</h1>
                <div className="summary-card">
                    <div className="summary-item">
                        <h3>Total Budget</h3>
                        <p className="amount">${totalBudget.toFixed(2)}</p>
                    </div>
                    <div className="summary-item">
                        <h3>Total Spent</h3>
                        <p className="amount">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="summary-item">
                        <h3>Remaining</h3>
                        <p className="amount" style={{ color: totalBudget - totalSpent >= 0 ? '#339989' : '#ef4444' }}>
                            ${(totalBudget - totalSpent).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="controls">
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
            
            {sortedAndFilteredBudgets.length === 0 ? (
                <div className="empty-state">
                    <p>{savingsPerBudget.length === 0 ? 'No active budgets at the moment.' : 'No budgets match your filters.'}</p>
                    {savingsPerBudget.length > 0 && filterStatus !== 'all' && (
                        <button onClick={() => setFilterStatus('all')} className="reset-button">
                            Show All Budgets
                        </button>
                    )}
                </div>
            ) : (
                <div className="budget-grid">
                    {sortedAndFilteredBudgets.map((budget) => (
                        <div className="budget-card" key={budget.id}>
                            <div className="budget-header">
                                <h3>{budget.name}</h3>
                                <span className={`status-badge ${budget.status.toLowerCase().replace(' ', '-')}`}>
                                    {budget.status}
                                </span>
                            </div>
                            
                            <div className="budget-details">
                                <div className="budget-info">
                                    <div className="info-row">
                                        <span className="label">Budget:</span>
                                        <span className="value">${budget.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Period:</span>
                                        <span className="value">{budget.period}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Spent:</span>
                                        <span className="value">${budget.spent.toFixed(2)}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Remaining:</span>
                                        <span className="value" style={{ color: budget.savings >= 0 ? '#339989' : '#ef4444' }}>
                                            ${budget.savings.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress" 
                                            style={{ 
                                                width: `${Math.min(100, (budget.spent / budget.amount) * 100)}%`,
                                                backgroundColor: budget.spent > budget.amount ? '#ef4444' : '#339989'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="visuals">
                                    {renderPieChart(budget)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </BudgetTrackerStyled>
    );
};

// Status colors are now handled in the styled component

const BudgetTrackerStyled = styled.div`
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
        display: flex;
        gap: 1.5rem;
        background: #fffafb;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.08);
        padding: 1.5rem;
        
        .summary-item {
            min-width: 120px;
            text-align: center;
            
            h3 {
                font-size: 0.9rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #2b2c28;
            }
            
            .amount {
                font-size: 1.5rem;
                font-weight: 700;
                color: #2b2c28;
            }
        }
    }
    
    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        
        .filter-controls {
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
    
    .budget-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .budget-card {
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        transition: transform 0.2s ease;
        
        &:hover {
            transform: translateY(-5px);
        }
    }
    
    .budget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        
        h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2b2c28;
            margin: 0;
        }
        
        .status-badge {
            font-size: 0.8rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
        }
        
        .under-budget {
            background-color: rgba(51, 153, 137, 0.1);
            color: #339989;
        }
        
        .on-budget {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        .over-budget {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
    }
    
    .budget-details {
        display: flex;
        flex-direction: column;
        padding: 1.5rem;
        
        @media (min-width: 640px) {
            flex-direction: row;
        }
    }
    
    .budget-info {
        flex: 1;
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            
            .label {
                color: #64748b;
                font-size: 0.9rem;
            }
            
            .value {
                font-weight: 600;
                color: #2b2c28;
            }
        }
    }
    
    .progress-bar {
        height: 8px;
        background-color: #e5e7eb;
        border-radius: 4px;
        margin-top: 1rem;
        overflow: hidden;
        
        .progress {
            height: 100%;
            transition: width 0.3s ease;
        }
    }
    
    .visuals {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
    }
`;}]}}}

export default BudgetTracker;
