import React from 'react';
import styled from 'styled-components';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';
import { useGlobalContext } from '../../context/globalContext';

function Dashboard() {
    const { incomes, expenses, totalExpenses, totalIncomes, totalBalance, addIncome, addExpense } = useGlobalContext();

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <Chart incomes={incomes} expenses={expenses} />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>{dollar} {totalIncomes().toFixed(2)}</p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>{dollar} {totalExpenses().toFixed(2)}</p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>{dollar} {totalBalance().toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span> Max</h2>
                        <div className="salary-item">
                            <p>${Math.min(...incomes.map(item => item.amount)) || 0}</p>
                            <p>${Math.max(...incomes.map(item => item.amount)) || 0}</p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p>${Math.min(...expenses.map(item => item.amount)) || 0}</p>
                            <p>${Math.max(...expenses.map(item => item.amount)) || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="form-con">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const incomeAmount = parseFloat(e.target.elements.income.value);
                        if (!isNaN(incomeAmount) && incomeAmount > 0) {
                            addIncome({ amount: incomeAmount });
                            e.target.reset();
                        }
                    }}>
                        <input 
                            type="number" 
                            name="income"
                            placeholder="Add Income" 
                            required 
                            min="0.01" 
                            step="0.01" 
                        />
                        <button type="submit">Add Income</button>
                    </form>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const expenseAmount = parseFloat(e.target.elements.expense.value);
                        if (!isNaN(expenseAmount) && expenseAmount > 0) {
                            addExpense({ amount: expenseAmount });
                            e.target.reset();
                        }
                    }}>
                        <input 
                            type="number" 
                            name="expense"
                            placeholder="Add Expense" 
                            required 
                            min="0.01" 
                            step="0.01" 
                        />
                        <button type="submit">Add Expense</button>
                    </form>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}
const DashboardStyled = styled.div`
    padding: 2rem;
    min-height: 100vh;
    color: var(--color-dark);
    background-color: #f5f5f5;

    h1 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 2rem;
        color: var(--color-dark);
    }

    .stats-con {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;

        .chart-con {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            .amount-con {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;

                .income, .expense, .balance {
                    background-color: #fafafa;
                    padding: 1rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;

                    h2 {
                        font-size: 1.1rem;
                        color: var(--color-dark);
                    }

                    p {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: var(--color-green);
                    }
                }

                .expense p {
                    color: var(--color-red);
                }

                .balance {
                    grid-column: span 2;
                    p {
                        color: var(--color-primary);
                        font-size: 1.8rem;
                    }
                }
            }
        }

        .history-con {
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 15px;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            h2.salary-title {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--color-dark);

                span {
                    color: var(--color-accent);
                }
            }

            .salary-item {
                display: flex;
                justify-content: space-between;
                background-color: #fafafa;
                padding: 0.8rem 1rem;
                border: 1px solid #e0e0e0;
                border-radius: 8px;

                p {
                    font-weight: 600;
                    color: var(--color-dark);
                }
            }
        }
    }

    .form-con {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        form {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;

            input {
                flex: 1;
                padding: 0.8rem 1rem;
                font-size: 1rem;
                border-radius: 5px;
                border: 1px solid #ccc;
                background: #fff;
                color: var(--color-dark);
            }

            button {
                padding: 0.8rem 1.2rem;
                background-color: var(--color-accent);
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;

                &:hover {
                    background-color: var(--color-green);
                }
            }
        }
    }
`;


export default Dashboard;
