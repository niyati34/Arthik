import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

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
      <div className="input-control">
        <label>Title</label>
        <input
          type="text"
          value={title}
          placeholder="Expense Title"
          onChange={handleInput("title")}
        />
      </div>
      <div className="input-control">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          placeholder="Expense Amount"
          onChange={handleInput("amount")}
        />
      </div>
      <div className="input-control">
        <label>Date</label>
        <DatePicker
          selected={date}
          onChange={(date) => setInputState({ ...inputState, date })}
          placeholderText="Select Date"
          className="date-picker"
        />
      </div>
      <div className="input-control">
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
      <div className="input-control">
        <label>Description</label>
        <textarea
          value={description}
          placeholder="Add a Reference"
          onChange={handleInput("description")}
          rows="4"
        />
      </div>
      <div className="submit-btn">
        <Button
          name="Add Expense"
          icon={plus}
          bPad=".8rem 1.6rem"
          bRad="30px"
          bg="var(--color-accent)"
          color="black"
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  background: #FCF6F9f;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;

  .input-control {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;

    input,
    textarea,
    select,
    .react-datepicker-wrapper,
    .react-datepicker__input-container input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 5px;
      border: 1px solid #ced4da;
      font-size: 1rem;
      background: #f8f9fa;
      color: #212529;
      box-sizing: border-box;
    }

    textarea {
      resize: vertical;
    }

    select {
      appearance: none;
      background-color: #f8f9fa;
    }

    input::placeholder,
    textarea::placeholder {
      color: #6c757d;
    }
  }

  .submit-btn {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
`;

export default ExpenseForm;
