import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import { dollar, calender, comment, trash } from '../utils/Icons';

function History({ limit = 5, showAll = false, allowDelete = false }) {
    const { transactionHistory, deleteIncome, deleteExpense } = useGlobalContext();
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Get all transactions or limited number based on props
    useEffect(() => {
        let history = transactionHistory();
        
        // Apply search filter
        if (searchQuery) {
            history = history.filter(transaction => 
                transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply type filter
        if (filter !== 'all') {
            history = history.filter(transaction => transaction.type === filter);
        }
        
        // Apply sorting
        history.sort((a, b) => {
            if (sortBy === 'date') {
                const dateA = new Date(a.date || a.createdAt);
                const dateB = new Date(b.date || b.createdAt);
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (sortBy === 'amount') {
                return sortOrder === 'asc' 
                    ? parseFloat(a.amount) - parseFloat(b.amount) 
                    : parseFloat(b.amount) - parseFloat(a.amount);
            } else if (sortBy === 'title') {
                return sortOrder === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            }
            return 0;
        });
        
        // Limit results if not showing all
        if (!showAll && !searchQuery && filter === 'all') {
            history = history.slice(0, limit);
        }
        
        setTransactions(history);
    }, [transactionHistory, limit, showAll, searchQuery, filter, sortBy, sortOrder]);

    const handleDelete = (transaction) => {
        if (transaction.type === 'income') {
            deleteIncome(transaction.id);
        } else {
            deleteExpense(transaction.id);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTypeColor = (type) => {
        return type === 'income' ? '#339989' : '#ef476f';
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
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
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
                                <div className="transaction-type" style={{ backgroundColor: typeColor }}>
                                    <span>{transaction.type === 'income' ? '+' : '-'}</span>
                                </div>
                                
                                <div className="transaction-details">
                                    <div className="transaction-title">
                                        <h4>{transaction.title || 'Untitled'}</h4>
                                        <span className="transaction-date">
                                            {calender} {formatDate(transaction.date || transaction.createdAt)}
                                        </span>
                                    </div>
                                    
                                    {transaction.description && (
                                        <p className="transaction-description">
                                            {comment} {transaction.description}
                                        </p>
                                    )}
                                    
                                    <div className="transaction-category">
                                        <span>{transaction.category || 'Uncategorized'}</span>
                                    </div>
                                </div>
                                
                                <div className="transaction-amount" style={{ color: typeColor }}>
                                    {dollar} {isNaN(amount) ? '0.00' : amount.toFixed(2)}
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
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    width: 100%;
    
    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        
        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .history-controls {
            display: flex;
            gap: 1rem;
            
            @media (max-width: 768px) {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .search-container {
                input {
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    border: 2px solid #FFFFFF;
                    font-size: 0.9rem;
                    outline: none;
                    width: 200px;
                    
                    &:focus {
                        border-color: var(--primary-color);
                    }
                }
            }
            
            .filter-container {
                display: flex;
                gap: 0.5rem;
                
                select {
                    padding: 0.5rem;
                    border-radius: 10px;
                    border: 2px solid #FFFFFF;
                    font-size: 0.9rem;
                    outline: none;
                    background: #FFFFFF;
                    cursor: pointer;
                    
                    &:focus {
                        border-color: var(--primary-color);
                    }
                }
            }
        }
    }
    
    .transaction-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        
        .transaction-item {
            display: flex;
            align-items: center;
            background: #FFFFFF;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.08);
            }
            
            .transaction-type {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
                
                span {
                    color: #FFFFFF;
                    font-size: 1.2rem;
                    font-weight: 600;
                }
            }
            
            .transaction-details {
                flex: 1;
                
                .transaction-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.3rem;
                    
                    @media (max-width: 576px) {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.3rem;
                    }
                    
                    h4 {
                        font-size: 1.1rem;
                        font-weight: 500;
                        color: #222;
                    }
                    
                    .transaction-date {
                        font-size: 0.85rem;
                        color: #777;
                        display: flex;
                        align-items: center;
                        gap: 0.3rem;
                    }
                }
                
                .transaction-description {
                    font-size: 0.9rem;
                    color: #555;
                    margin: 0.3rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                
                .transaction-category {
                    span {
                        font-size: 0.8rem;
                        background: #F0F0F0;
                        padding: 0.2rem 0.5rem;
                        border-radius: 5px;
                        color: #555;
                    }
                }
            }
            
            .transaction-amount {
                font-size: 1.2rem;
                font-weight: 600;
                margin-left: 1rem;
                display: flex;
                align-items: center;
                gap: 0.3rem;
            }
            
            .delete-btn {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: 0.5rem;
                color: #777;
                transition: color 0.3s ease;
                
                &:hover {
                    color: #ef476f;
                }
            }
        }
        
        .view-all {
            text-align: center;
            margin-top: 1rem;
            
            a {
                color: var(--primary-color);
                text-decoration: none;
                font-weight: 500;
                
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 2rem 0;
        
        p {
            color: #777;
            font-size: 1rem;
        }
    }
    color: #222260;

    h2 {
        margin-bottom: 1rem;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #ccc;

        span {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        p {
            text-align: center;
            padding: 1rem 0;
            color: rgba(34, 34, 96, 0.6);
        }
    }

    p {
        text-align: center;
        padding: 1rem 0;
        color: rgba(34, 34, 96, 0.6);
    }
`;

export default History;
