import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ExpenseForm({ addExpense }) {
  const [inputState, setInputState] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const categories = [
    "Education",
    "Groceries",
    "Health",
    "Subscriptions",
    "Takeaways",
    "Clothing",
    "Travelling",
    "Bills",
    "Transport",
    "Entertainment",
    "Other",
  ];

  const { title, amount, date, category, description } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      alert("Amount must be a positive number");
      return;
    }
    addExpense({ title, amount, date, category, description });
    setInputState({
      title: "",
      amount: "",
      date: "",
      category: "",
      description: "",
    });
  };

  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      <div className="form-title">Add New Expense</div>
      
      {/* First Row: Title and Amount */}
      <div className="form-row">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            placeholder="Expense Title"
            onChange={handleInput("title")}
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            placeholder="Amount"
            onChange={handleInput("amount")}
          />
        </div>
      </div>

      {/* Second Row: Date and Category */}
      <div className="form-row">
        <div className="form-group">
          <label>Date</label>
          <DatePicker
            selected={date}
            onChange={(date) => setInputState({ ...inputState, date })}
            placeholderText="Select Date"
            className="date-picker"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select required value={category} onChange={handleInput("category")}>
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Third Row: Description (full width) */}
      <div className="form-group full-width">
        <label>Description</label>
        <textarea
          value={description}
          placeholder="Add a reference (optional)"
          onChange={handleInput("description")}
          rows="3"
        />
      </div>

      <button type="submit" className="submit-btn">
        Add Expense
      </button>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
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
    textarea,
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

    textarea {
      resize: vertical;
      min-height: 60px;
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

export default ExpenseForm;
