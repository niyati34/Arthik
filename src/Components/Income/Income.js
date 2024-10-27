import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import IncomeForm from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import { useGlobalContext } from '../../context/globalContext'; // Import your context

function Income() {
    const { incomes, addIncome, deleteIncome, totalIncomes } = useGlobalContext();
    const [filteredIncomes, setFilteredIncomes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    // Apply filters, search, and sorting
    useEffect(() => {
        let result = [...incomes];
        
        // Apply category filter
        if (filter !== 'all') {
            result = result.filter(income => income.category === filter);
        }
        
        // Apply search query
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(income => 
                income.title?.toLowerCase().includes(query) || 
                income.description?.toLowerCase().includes(query) ||
                income.category?.toLowerCase().includes(query)
            );
        }
        
        // Apply sorting
        result.sort((a, b) => {
            switch(sortBy) {
                case 'amount-asc':
                    return a.amount - b.amount;
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
        
        setFilteredIncomes(result);
    }, [incomes, filter, searchQuery, sortBy]);

    // Get unique categories for filter dropdown
    const categories = ['all', ...new Set(incomes.map(income => income.category))];

    return (
        <IncomeStyled>
            <InnerLayout>
                <div className="header">
                    <h1>Income Manager</h1>
                    <div className="summary-card">
                        <h2>Total Income</h2>
                        <p className="amount">${totalIncomes().toFixed(2)}</p>
                        <p className="count">{incomes.length} income source{incomes.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                
                <div className="controls">
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search incomes..." 
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
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
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
                
                <div className="income-content">
                    <div className="form-container">
                        <h3>Add New Income</h3>
                        <IncomeForm addIncome={addIncome} />
                    </div>
                    
                    <div className="incomes">
                        <h3>Income History {filteredIncomes.length > 0 && `(${filteredIncomes.length})`}</h3>
                        
                        {filteredIncomes.length > 0 ? (
                            <div className="income-list">
                                {filteredIncomes.map((income) => {
                                    const { id, title, amount, date, category, description } = income;
                                    return (
                                        <IncomeItem
                                            key={id}
                                            id={id}
                                            title={title || 'N/A'}
                                            description={description || 'N/A'}
                                            amount={amount}
                                            date={date || 'N/A'}
                                            category={category || 'N/A'}
                                            type="income"
                                            deleteItem={deleteIncome}
                                            indicatorColor="var(--color-green)"
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No matching incomes found.</p>
                                {filter !== 'all' && (
                                    <button onClick={() => setFilter('all')} className="reset-button">
                                        Reset Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
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
            color: #339989;
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
        margin-bottom: 2rem;
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
                    border-color: #7de2d1;
                    box-shadow: 0 0 0 2px rgba(125, 226, 209, 0.2);
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
                    border-color: #7de2d1;
                }
            }
        }
    }
    
    .income-content {
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
    
    .incomes {
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        
        .income-list {
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
`;}]}}}

export default Income;
