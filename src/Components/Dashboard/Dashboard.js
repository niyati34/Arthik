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
                {/* Removed misplaced form and duplicate JSX */}
    min-height: 100vh;
    color: var(--color-dark);
    background-color: #f5f5f5;

        // ...existing styled-components and valid JS code only...
`;


export default Dashboard;
