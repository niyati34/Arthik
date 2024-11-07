import React from 'react';
import styled from 'styled-components';
import BudgetForm from './BudgetForm';
import BudgetTracker from './BudgetTracker';

const BudgetPage = () => {
    return (
        <BudgetPageStyled>
            <div className="budget-container">
                {/* Header Section */}
                <div className="budget-header">
                    <div className="header-content">
                        <h1>Budget Management</h1>
                        <p>Set spending limits and track your financial goals</p>
                    </div>
                    <div className="budget-summary">
                        <div className="summary-card">
                            <div className="summary-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="summary-content">
                                <h3>Active Budgets</h3>
                                <span className="count">3 Categories</span>
                                <span className="status">On Track</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="budget-content">
                    <div className="form-section">
                        <div className="section-header">
                            <h2>Create New Budget</h2>
                            <p>Set spending limits for different categories</p>
                        </div>
                        <div className="form-container">
                            <BudgetForm />
                        </div>
                    </div>

                    <div className="tracker-section">
                        <div className="section-header">
                            <h2>Budget Overview</h2>
                            <p>Monitor your spending against budgets</p>
                        </div>
                        <div className="tracker-container">
                            <BudgetTracker />
                        </div>
                    </div>
                </div>
            </div>
        </BudgetPageStyled>
    );
};

const BudgetPageStyled = styled.div`
    width: 100%;
    min-height: 100%;
    background: transparent;
    overflow: visible;

    .budget-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0.75rem;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        overflow: visible;
    }

    /* Header Styles */
    .budget-header {
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

    .budget-summary {
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
                background: #f0f9ff;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0ea5e9;
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
                    color: #0ea5e9;
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
    .budget-content {
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

    .tracker-section {
        overflow: visible;
        display: flex;
        flex-direction: column;
        height: fit-content;

        .tracker-container {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            height: fit-content;
            min-width: 0;
            overflow: visible;
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
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .budget-container {
            padding: 0.625rem;
        }

        .budget-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;

            .header-content h1 {
                font-size: 1.125rem;
            }
        }

        .budget-content {
            gap: 1rem;
        }
    }

    @media (max-width: 768px) {
        .budget-container {
            padding: 0.5rem;
        }

        .budget-header .header-content h1 {
            font-size: 1rem;
        }

        .summary-card {
            padding: 0.5rem;
            min-width: auto;
        }

        .budget-content {
            gap: 0.875rem;
        }
    }
`;

export default BudgetPage;
