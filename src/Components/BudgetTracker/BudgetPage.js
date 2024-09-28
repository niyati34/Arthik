import React from 'react';
import styled from 'styled-components';
import BudgetForm from './BudgetForm';
import BudgetTracker from './BudgetTracker';

const BudgetPage = () => {
    return (
        <BudgetPageStyled>
            <h1>Budget Management</h1>
            <BudgetForm />
            <BudgetTracker />
        </BudgetPageStyled>
    );
};

const BudgetPageStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem; /* Add padding for spacing */
    background: #1a1a1a; /* Dark background */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.5); /* Shadow for depth */

    h1 {
        color: #00ffab; /* Neon color */
        text-shadow: 0 0 1px #00ffab, 0 0 10px #00ffab; /* Neon glow */
        margin-bottom: 1rem; /* Space below the title */
    }
`;

export default BudgetPage;
