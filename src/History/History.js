// src/components/History/History.js
import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/globalContext';
import { dollar, calender, comment } from '../utils/Icons'; // Import necessary icons

function History() {
    const { transactionHistory } = useGlobalContext();
    const transactions = transactionHistory; // Access as a value

    console.log('Transaction History in History Component:', transactions); // Debugging log

    return (
        <HistoryStyled>
            <h2>Transaction History</h2>
            <ul>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => {
                        const amount = parseFloat(transaction.amount || 0);
                        return (
                            <li key={transaction.id}>
                                <span>{transaction.type === 'income' ? 'Income' : 'Expense'}</span>
                                <span>{transaction.title || 'N/A'}</span>
                                <span>
                                    {dollar} {isNaN(amount) ? 'Invalid Amount' : `$${amount.toFixed(2)}`}
                                </span>
                                <span>
                                    {calender} {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                                </span>
                                <span>
                                    {comment} {transaction.description || 'N/A'}
                                </span>
                            </li>
                        );
                    })
                ) : (
                    <p>No transactions available.</p>
                )}
            </ul>
        </HistoryStyled>
    );
}

const HistoryStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    color: #222260;

    h2 {
        margin-bottom: 1rem;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #ccc;

        span {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        p {
            text-align: center;
            padding: 1rem 0;
            color: rgba(34, 34, 96, 0.6);
        }
    }

    p {
        text-align: center;
        padding: 1rem 0;
        color: rgba(34, 34, 96, 0.6);
    }
`;

export default History;
