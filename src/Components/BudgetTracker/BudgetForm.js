import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';

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
            <div className="form-title">Create New Budget</div>
            
            {/* First Row: Category and Amount */}
            <div className="form-row">
                <div className="form-group">
                    <label>Category</label>
                    <input 
                        type="text" 
                        name="category"
                        placeholder="Budget Category" 
                        value={category} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div className="form-group">
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
            </div>

            {/* Second Row: Period and Start Date */}
            <div className="form-row">
                <div className="form-group">
                    <label>Period</label>
                    <select name="period" value={period} onChange={handleInputChange}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => handleDateChange('startDate', date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Start Date"
                    />
                </div>
            </div>

            {/* Third Row: End Date (full width) */}
            <div className="form-group full-width">
                <label>End Date</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select End Date"
                />
            </div>

            <button type="submit" className="submit-btn">
                Set Budget
            </button>
        </BudgetFormStyled>
    );
};

const BudgetFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    width: 100%;
    min-height: fit-content;

    .form-title {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;

        &.full-width {
            grid-column: 1 / -1;
        }

        label {
            font-size: 0.75rem;
            font-weight: 500;
            color: #64748b;
        }

        input,
        select,
        .react-datepicker-wrapper,
        .react-datepicker__input-container input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            font-size: 0.8125rem;
            background: #ffffff;
            color: #0f172a;
            box-sizing: border-box;
            transition: all 0.2s ease;

            &:focus {
                outline: none;
                border-color: #10b981;
                box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
            }

            &::placeholder {
                color: #94a3b8;
            }
        }

        select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 0.75rem center;
            background-repeat: no-repeat;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
            cursor: pointer;

            &:hover {
                border-color: #cbd5e1;
                background-color: #f8fafc;
            }

            &:focus {
                background-color: #ffffff;
            }

            option {
                padding: 0.5rem;
                background: #ffffff;
                color: #0f172a;
                
                &:hover {
                    background: #f1f5f9;
                }

                &:checked {
                    background: #10b981;
                    color: #ffffff;
                }
            }
        }
    }

    .submit-btn {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background: #10b981;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 0.5rem;

        &:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        &:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }

    /* React DatePicker custom styling */
    .react-datepicker-wrapper {
        width: 100%;
    }

    .react-datepicker__input-container input {
        width: 100%;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .form-group.full-width {
            grid-column: 1;
        }
    }
`;

export default BudgetForm;
