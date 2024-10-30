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
                            <div className="summary-icon">📋</div>
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
    background: #fffafb;

    .budget-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
    }

    /* Header Styles */
    .budget-header {
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

    .budget-summary {
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
                background: linear-gradient(90deg, #8b5cf6, #a78bfa);
            }

            .summary-icon {
                font-size: 2.5rem;
                width: 60px;
                height: 60px;
                background: #f3f4f6;
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
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #8b5cf6;
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

    /* Main Content */
    .budget-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;

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

    .tracker-section {
        .tracker-container {
            background: #fffafb;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(19, 21, 21, 0.03);
        }
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .budget-container {
            padding: 1.5rem;
        }

        .budget-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;

            .header-content h1 {
                font-size: 2rem;
            }
        }

        .budget-content {
            gap: 2rem;
        }
    }

    @media (max-width: 768px) {
        .budget-container {
            padding: 1rem;
        }

        .budget-header .header-content h1 {
            font-size: 1.75rem;
        }

        .summary-card {
            padding: 1.5rem;
            min-width: auto;
        }
    }
`;

export default BudgetPage;
