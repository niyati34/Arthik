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
                <h1>Expenses</h1>
                <h2 className="total-expense">
                    Total Expense: <span>${totalExpenses().toFixed(2)}</span>
                </h2>
                <div className="expense-content">
                    <div className="form-container">
                        <ExpenseForm addExpense={addExpense} />
                    </div>
                    <div className="expenses">
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <IncomeItem
                                    key={expense.id}
                                    id={expense.id}
                                    title={expense.title || 'N/A'}
                                    description={expense.description || 'N/A'}
                                    amount={expense.amount}
                                    date={expense.date || 'N/A'}
                                    category={expense.category || 'N/A'}
                                    type="expense"
                                    deleteItem={deleteExpense}
                                    indicatorColor="var(--color-red)"
                                />
                            ))
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
    padding: 2rem;
     background: #FCF6F9;
    color: #212529;

    h1 {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 1rem;
        color: #343a40;
    }

    .total-expense {
        background: #ffffff;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 2rem;

        span {
            color: #dc3545;
            font-size: 1.7rem;
        }
    }

    .expense-content {
        display: flex;
        flex-direction: row;
        gap: 2rem;

        .form-container {
            flex: 1;
        }

        .expenses {
            flex: 2;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }
`;

export default Expenses;
