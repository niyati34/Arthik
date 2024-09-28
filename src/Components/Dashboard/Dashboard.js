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
    background-color: #0d0d0d;
    min-height: 100vh;
    color: white;
    padding: 2rem;
    
    h1 {
        text-align: center;
        color: #00ffab;
        font-size: 3rem;
        text-shadow: 0px 0px 15px #00ffab;
    }

    .stats-con {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        
        .chart-con {
            grid-column: 1 / 2;
            height: 300px;
            background: linear-gradient(135deg, #282828, #111);
            padding: 1rem;
            border-radius: 20px;
            box-shadow: 0px 10px 30px rgba(0, 255, 171, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            
            .amount-con {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-top: 1.5rem;

                .income, .expense, .balance {
                    background: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0px 0px 15px rgba(0, 255, 171, 0.3);
                    transition: all 0.4s ease-in-out;
                    
                    p {
                        font-size: 2.2rem;
                        font-weight: bold;
                        color: #00ffab;
                        text-shadow: 0px 0px 10px #00ffab;
                    }

                    &:hover {
                        transform: translateY(-5px);
                        box-shadow: 0px 0px 25px rgba(0, 255, 171, 0.7);
                    }
                }

                .balance {
                    grid-column: span 3;
                    p {
                        color: #ff6f00;
                        font-size: 3rem;
                        text-shadow: 0px 0px 15px #ff6f00;
                    }
                }
            }
        }

        .history-con {
            grid-column: 2 / 3;
            background: linear-gradient(135deg, #282828, #111);
            padding: 1rem;
            border-radius: 20px;
            box-shadow: 0px 10px 30px rgba(0, 255, 171, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);

            h2 {
                color: #00ffab;
                text-shadow: 0px 0px 10px #00ffab;
            }

            .salary-item {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 1rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0px 0px 15px rgba(0, 255, 171, 0.3);
                display: flex;
                justify-content: space-between;

                p {
                    font-weight: 600;
                    font-size: 1.4rem;
                    color: #ff6f00;
                }
            }
        }
    }

    .form-con {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0px 4px 15px rgba(255, 102, 0, 0.5);
        
        input {
            padding: 0.7rem;
            font-size: 1rem;
            border-radius: 5px;
            border: none;
            margin-bottom: 0.5rem;
            background: #111;
            color: white;
            box-shadow: 0px 0px 10px rgba(255, 102, 0, 0.5);
        }

        button {
            padding: 0.7rem;
            font-size: 1rem;
            border: none;
            background-color: #00ffab;
            color: white;
            cursor: pointer;
            border-radius: 5px;
            transition: all 0.3s ease;

            &:hover {
                background-color: #ff6f00;
                box-shadow: 0px 0px 20px rgba(255, 102, 0, 0.8);
            }
        }
    }
`;

export default Dashboard;
