import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const BudgetTracker = () => {
    const { savingsPerBudget } = useGlobalContext();

    const COLORS = ['#39ff14', '#ff073a', '#ffd700'];

    const renderPieChart = (budget) => {
        const data = [
            { name: 'Spent', value: budget.spent },
            { name: 'Savings', value: budget.savings > 0 ? budget.savings : 0 },
            { name: 'Over', value: budget.savings < 0 ? Math.abs(budget.savings) : 0 },
        ];

        return (
            <PieChart width={150} height={150}>
                <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        );
    };

    return (
        <BudgetTrackerStyled>
            <h2>Your Active Budgets</h2>
            {savingsPerBudget.length === 0 ? (
                <p>No active budgets at the moment.</p>
            ) : (
                <ul>
                    {savingsPerBudget.map((budget) => (
                        <li key={budget.id}>
                            <div className="budget-info">
                                <h3>{budget.name}</h3>
                                <p>Budget: ${budget.amount} ({budget.period})</p>
                                <p>Spent: ${budget.spent}</p>
                                <p>Savings: ${budget.savings}</p>
                                <p className="status">Status: <span style={{ color: getStatusColor(budget.status) }}>{budget.status}</span></p>
                            </div>
                            <div className="visuals">
                                {renderPieChart(budget)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </BudgetTrackerStyled>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Under Budget':
            return '#39ff14';
        case 'On Budget':
            return '#00bfff';
        case 'Over Budget':
            return '#ff073a';
        default:
            return '#f9f9f9';
    }
};

const BudgetTrackerStyled = styled.div`
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);

    h2 {
        margin-bottom: 20px;
        text-align: center;
        color: #39ff14;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 20px;
        padding: 20px;
        border: 2px solid #444;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: box-shadow 0.3s;

        &:hover {
            box-shadow: 0 4px 15px rgba(57, 255, 20, 0.7);
        }
    }

    .budget-info {
        flex: 2;
        margin-right: 20px;
        color: #fff;

        p {
            margin: 5px 0;
            color: #bbb;
        }
    }

    .visuals {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export default BudgetTracker;
