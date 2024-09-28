import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function ExpenseForm({ addExpense }) {
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    });

    const { title, amount, date, category, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && amount && date && category) {
            addExpense({ title, amount, date, category, description });
            setInputState({
                title: '',
                amount: '',
                date: '',
                category: '',
                description: '',
            });
        } else {
            alert("Please fill all fields");
        }
    };

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <input 
                    type="text"
                    value={title}
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={amount}
                    placeholder={'Expense Amount'}
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    placeholderText='Enter A Date'
                    selected={date}
                    onChange={(date) => {
                        setInputState({ ...inputState, date });
                    }}
                />
            </div>
            <div className="selects input-control">
                <select required value={category} onChange={handleInput('category')}>
                    <option value="" disabled>Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>
                    <option value="travelling">Travelling</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    value={description}
                    placeholder='Add A Reference'
                    cols="30"
                    rows="4"
                    onChange={handleInput('description')}
                />
            </div>
            <div className="submit-btn">
                <Button
                    name={'Add Expense'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>
        </ExpenseFormStyled>
    );
}

const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem; /* Slightly increased padding */
    background: #1a1a1a; /* Dark background */
    border-radius: 10px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.4), inset 0px 0px 10px rgba(0, 255, 171, 0.5); /* 3D effect with inner shadow */
    transform: perspective(1000px) translateZ(0); /* Enable 3D perspective */
    transition: transform 0.3s ease; /* Smooth transition for hover */

    &:hover {
        transform: perspective(1000px) translateZ(10px); /* Raise effect on hover */
    }
    
    }
    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #00ffab; /* Neon border */
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: #00ffab; /* Neon text color */
        
        &::placeholder {
            color: rgba(0, 255, 171, 0.6); /* Slightly transparent neon for placeholders */
        }
    }

    .input-control {
        input {
            width: 100%;
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;

        select {
            color: #00ffab; /* Neon text color */
            background: transparent; /* Transparent background */
            border: 2px solid #00ffab; /* Neon border */

            &:focus, &:active {
                color: #fff; /* Change color on focus */
            }
        }
    }

    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-green) !important;
            }
        }
    }
`;

export default ExpenseForm;
