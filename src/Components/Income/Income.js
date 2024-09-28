import React from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import IncomeForm from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import { useGlobalContext } from '../../context/globalContext'; // Import your context

function Income() {
    const { incomes, addIncome, deleteIncome, totalIncomes } = useGlobalContext();

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">Total Income: <span>${totalIncomes().toFixed(2)}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <IncomeForm addIncome={addIncome} />
                    </div>
                    <div className="incomes">
                        {incomes.length > 0 ? (
                            incomes.map((income) => {
                                const { id, title, amount, date, category, description } = income;
                                return (
                                    <IncomeItem
                                        key={id}
                                        id={id}
                                        title={title || 'N/A'}
                                        description={description || 'N/A'}
                                        amount={amount}
                                        date={date || 'N/A'}
                                        category={category || 'N/A'}
                                        type="income"
                                        deleteItem={deleteIncome}
                                        indicatorColor="var(--color-green)"
                                    />
                                );
                            })
                        ) : (
                            <p>No incomes recorded yet.</p>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content {
        display: flex;
        gap: 2rem;
        .incomes {
            flex: 1;
        }
    }
`;

export default Income;
