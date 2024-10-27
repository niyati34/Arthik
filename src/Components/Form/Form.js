import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function Form({ addIncome, isExpense = false }) {
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { title, amount, date, category, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        
        if (!title.trim()) newErrors.title = 'Title is required';
        
        if (!amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(amount) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        
        if (!date) newErrors.date = 'Date is required';
        if (!category) newErrors.category = 'Category is required';
        
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        // Process form data
        try {
            addIncome({
                title,
                amount: parseFloat(amount),
                date,
                category,
                description
            });
            
            // Reset form after successful submission
            setInputState({
                title: '',
                amount: '',
                date: '',
                category: '',
                description: '',
            });
            setErrors({});
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ form: 'Failed to submit. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get category options based on type (income or expense)
    const getCategoryOptions = () => {
        if (isExpense) {
            return [
                { value: 'groceries', label: 'Groceries' },
                { value: 'housing', label: 'Housing' },
                { value: 'transportation', label: 'Transportation' },
                { value: 'utilities', label: 'Utilities' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'dining', label: 'Dining Out' },
                { value: 'education', label: 'Education' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'travel', label: 'Travel' },
                { value: 'subscription', label: 'Subscriptions' },
                { value: 'other', label: 'Other' }
            ];
        } else {
            return [
                { value: 'salary', label: 'Salary' },
                { value: 'freelancing', label: 'Freelancing' },
                { value: 'investments', label: 'Investments' },
                { value: 'stocks', label: 'Stocks' },
                { value: 'crypto', label: 'Cryptocurrency' },
                { value: 'bank', label: 'Bank Transfer' },
                { value: 'gifts', label: 'Gifts' },
                { value: 'refunds', label: 'Refunds' },
                { value: 'rental', label: 'Rental Income' },
                { value: 'other', label: 'Other' }
            ];
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            <h3 className="form-title">{isExpense ? 'Add New Expense' : 'Add New Income'}</h3>
            
            {errors.form && <div className="error-message form-error">{errors.form}</div>}
            
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    placeholder={isExpense ? "e.g. Grocery shopping" : "e.g. Monthly salary"}
                    onChange={handleInput('title')}
                    className={errors.title ? 'error' : ''}
                />
                {errors.title && <div className="error-message">{errors.title}</div>}
            </div>
            
            <div className="form-group">
                <label htmlFor="amount">Amount ($)</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    placeholder="0.00"
                    onChange={handleInput('amount')}
                    className={errors.amount ? 'error' : ''}
                />
                {errors.amount && <div className="error-message">{errors.amount}</div>}
            </div>
            
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <DatePicker
                    id="date"
                    selected={date}
                    onChange={(date) => {
                        setInputState({ ...inputState, date });
                        if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                    }}
                    placeholderText="Select date"
                    dateFormat="MM/dd/yyyy"
                    maxDate={new Date()}
                    className={errors.date ? 'error' : ''}
                />
                {errors.date && <div className="error-message">{errors.date}</div>}
            </div>
            
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select 
                    id="category"
                    value={category} 
                    onChange={handleInput('category')}
                    className={errors.category ? 'error' : ''}
                >
                    <option value="" disabled>Select a category</option>
                    {getCategoryOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
            </div>
            
            <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                    id="description"
                    value={description}
                    placeholder="Add additional details"
                    rows="3"
                    onChange={handleInput('description')}
                />
            </div>
            
            <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Processing...' : isExpense ? 'Add Expense' : 'Add Income'}
            </button>
        </FormStyled>
    );
}

const FormStyled = styled.form`
    width: 100%;
    background: #fffafb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
    
    .form-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2b2c28;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.25rem;
        
        label {
            font-size: 0.9rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 0.5rem;
        }
        
        input, textarea, select {
            font-family: inherit;
            font-size: 0.95rem;
            padding: 0.75rem;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f8fafc;
            color: #2b2c28;
            transition: all 0.2s ease;
            
            &:focus {
                outline: none;
                border-color: #7de2d1;
                box-shadow: 0 0 0 3px rgba(125, 226, 209, 0.2);
            }
            
            &::placeholder {
                color: #94a3b8;
            }
            
            &.error {
                border-color: #ef4444;
                background-color: rgba(239, 68, 68, 0.05);
            }
        }
        
        textarea {
            resize: vertical;
            min-height: 80px;
        }
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .form-error {
        background-color: rgba(239, 68, 68, 0.1);
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .submit-btn {
        width: 100%;
        padding: 0.75rem 1.5rem;
        background: #339989;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 0.5rem;
        
        &:hover {
            background: #2a7d6f;
        }
        
        &:disabled {
            background: #94a3b8;
            cursor: not-allowed;
        }
    }
    
    /* React DatePicker custom styling */
    .react-datepicker-wrapper {
        width: 100%;
    }
    
    .react-datepicker__input-container input {
        width: 100%;
    }
`;

export default Form;
