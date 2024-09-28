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
                <select name="period" value={period} onChange={handleInputChange} className="dropdown">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>
            <div className="input-control">
                <label>Start Date</label>
                <DatePicker
                    selected={new Date(startDate)}
                    onChange={(date) => handleDateChange('startDate', date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div className="input-control">
                <label>End Date</label>
                <DatePicker
                    selected={new Date(endDate)}
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
                    color={'#fff'}
                />
            </div>
        </BudgetFormStyled>
    );
};

const BudgetFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem; /* Slightly increased padding */
    background: #1a1a1a; /* Dark background */
    border-radius: 10px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4), inset 0px 0px 10px rgba(0, 255, 171, 0.5); /* 3D effect with inner shadow */
    transform: perspective(1000px) translateZ(0); /* Enable 3D perspective */
    transition: transform 0.3s ease; /* Smooth transition for hover */

    &:hover {
        transform: perspective(1000px) translateZ(10px); /* Raise effect on hover */
    }

    .input-control {
        display: flex;
        flex-direction: column;

        label {
            margin-bottom: 0.5rem;
            font-weight: bold;
            color: #00ffab; /* Neon color */
            text-shadow: 0 0 1px #00ffab, 0 0 5px #00ffab; /* Reduced glow */
        }

        input, select {
            padding: 0.5rem 1rem;
            border: 1px solid #00ffab; /* Neon border */
            border-radius: 5px;
            font-size: 1rem;
            background: transparent; /* Transparent background */
            color: #fff; /* Text color */
            outline: none;
            transition: border 0.3s ease;

            &:focus {
                border-color: #00ffab; /* Neon glow on focus */
                box-shadow: 0 0 3px #00ffab, 0 0 5px #00ffab; /* Reduced glow on focus */
            }
        }

        select {
            cursor: pointer;
            color: #fff; /* Text color */
            background: transparent; /* Transparent background */
            border: 1px solid #00ffab; /* Neon border */
            appearance: none; /* Remove default dropdown arrow */
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="%2300ffab"><polygon points="4 6 8 10 12 6" /></svg>'); /* Custom arrow */
            background-repeat: no-repeat;
            background-position: right 10px center; /* Position the arrow */
            background-size: 12px; /* Size of the arrow */
            padding-right: 2rem; /* Space for the arrow */
        }
    }

    .submit-btn {
        display: flex;
        justify-content: flex-end;
    }
`;

export default BudgetForm;
