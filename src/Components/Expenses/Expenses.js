import React from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseForm from './ExpenseForm';
import IncomeItem from '../IncomeItem/IncomeItem';
import { useGlobalContext } from '../../context/globalContext';

function Expenses() {
    const { expenses, addExpense, deleteExpense, totalExpenses } = useGlobalContext();

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1 className="neon-title">Expenses</h1>
                <h2 className="total-expense">
                    Total Expense: <span>${totalExpenses().toFixed(2)}</span>
                </h2>
                <div className="expense-content">
                    <div className="form-container">
                        <ExpenseForm addExpense={addExpense} />
                    </div>
                    <div className="expenses">
                        {expenses.length > 0 ? (
                            expenses.map((expense) => {
                                const { id, title, amount, date, category, description } = expense;
                                return (
                                    <IncomeItem
                                        key={id}
                                        id={id}
                                        title={title || 'N/A'}
                                        description={description || 'N/A'}
                                        amount={amount}
                                        date={date || 'N/A'}
                                        category={category || 'N/A'}
                                        type="expense"
                                        deleteItem={deleteExpense}
                                        indicatorColor="var(--color-red)"
                                    />
                                );
                            })
                        ) : (
                            <p>No expenses recorded yet.</p>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    flex-direction: column; /* Stack the elements vertically */
    padding: 2rem; /* Add padding around the component */
    background: #1a1a1a; /* Dark background */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4); /* Slight shadow for depth */

    
    .total-expense {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
        border: 2px solid #00ffab; /* Neon border */
        box-shadow: 0px 1px 15px rgba(0, 255, 171, 0.5); /* Glow effect */
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        color: #00ffab; /* Neon text color */
        
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }

    .expense-content {
        display: flex;
        gap: 2rem;

        .expenses {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem; /* Space between expense items */
        }
    }
`;

export default Expenses;
