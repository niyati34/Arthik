import React from 'react';
import styled from 'styled-components';
import BudgetForm from './BudgetForm';
import BudgetTracker from './BudgetTracker';

const BudgetPage = () => {
    return (
        <BudgetPageStyled>
            <div className="budget-header">
                <h1>Budget Management</h1>
                <p>Set and track your spending limits across different categories</p>
            </div>
            <div className="budget-content">
                <div className="form-section">
                    <h2>Create New Budget</h2>
                    <BudgetForm />
                </div>
                <div className="tracker-section">
                    <h2>Budget Overview</h2>
                    <BudgetTracker />
                </div>
            </div>
        </BudgetPageStyled>
    );
};

const BudgetPageStyled = styled.div`
    width: 100%;
    padding: 2rem;

    .budget-header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2b2c28;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #2b2c28 0%, #339989 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        p {
            color: #6e7e85;
            font-size: 1.1rem;
            line-height: 1.6;
        }
    }

    .budget-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;

        @media (min-width: 1200px) {
            grid-template-columns: 400px 1fr;
        }
    }

    .form-section,
    .tracker-section {
        h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #2b2c28;
        }
    }

    .form-section {
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
        height: fit-content;
    }

    .tracker-section {
        background: #fffafb;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .budget-header h1 {
            font-size: 2rem;
        }

        .budget-content {
            gap: 2rem;
        }
    }
`;

export default BudgetPage;
