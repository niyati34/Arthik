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
    padding: 2rem;
     background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.5);

    h1 {
        color: #00ffab;
        text-shadow: 0 0 1px  #222260, 0 0 10px # #222260;
        margin-bottom: 1rem;
    }
`;

export default BudgetPage;
