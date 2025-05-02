import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

const BudgetForm = () => {
    const { addBudget } = useGlobalContext();
    const [formState, setFormState] = useState({
        category: '',
        amount: '',
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date(),
    });

    const { category, amount, period, startDate, endDate } = formState;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (name, date) => {
        setFormState(prevState => ({
            ...prevState,
            [name]: date
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category.trim() === '' || amount.trim() === '') {
            alert("Please fill in all required fields.");
            return;
        }

        if (endDate < startDate) {
            alert("End date cannot be before start date.");
            return;
        }

        addBudget({
            name: category,
            amount: parseFloat(amount),
            period,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        setFormState({
            category: '',
            amount: '',
            period: 'monthly',
            startDate: new Date(),
            endDate: new Date(),
        });
    };

    return (
        <BudgetFormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <label>Category</label>
                <input 
                    type="text" 
                    name="category"
                    placeholder="Category" 
                    value={category} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <div className="input-control">
                <label>Amount</label>
                <input 
                    type="number" 
                    name="amount"
                    placeholder="Budget Amount" 
                    value={amount} 
                    onChange={handleInputChange} 
                    required 
                />
            </div>
            <div className="input-control">
                <label>Period</label>
                <select name="period" value={period} onChange={handleInputChange}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div className="input-control">
                <label>Start Date</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div className="input-control">
                <label>End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div className="submit-btn">
                <Button
                    name={'Set Budget'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'black'}
                />
            </div>
        </BudgetFormStyled>
    );
};

const BudgetFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
     background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4);

    input, select, textarea {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: 2px solid #fff;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        background: #f8f9fa;
        color: rgba(34, 34, 96, 0.9);
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        label {
            margin-bottom: 0.5rem;
            color: #black;
        }
    }

    .submit-btn {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
`;

export default BudgetForm;
