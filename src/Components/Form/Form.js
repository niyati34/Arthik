import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormValidation, COMMON_VALIDATIONS } from "../../utils/useFormValidation";

const Form = ({ addIncome, addExpense, type = "income" }) => {
  const initialValues = {
    title: "",
    amount: "",
    date: new Date(),
    category: "",
    description: "",
  };

  const validationSchema = {
    title: COMMON_VALIDATIONS.title,
    amount: COMMON_VALIDATIONS.amount,
    date: ['required'],
    category: ['required'],
    description: COMMON_VALIDATIONS.description,
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation(initialValues, validationSchema);

  const onSubmit = async (formValues) => {
    try {
      if (type === "income") {
        await addIncome(formValues);
      } else {
        await addExpense(formValues);
      }
      resetForm();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const handleDateChange = (date) => {
    setFieldValue("date", date);
  };

  const categories = type === "income" 
    ? ["Salary", "Freelance", "Investment", "Business", "Other"]
    : ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"];

  return (
    <FormStyled onSubmit={handleFormSubmit}>
      <div className="form-title">
        Add New {type === "income" ? "Income" : "Expense"}
      </div>
      
      {/* First Row: Title and Amount */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder={`${type === "income" ? "Income" : "Expense"} title`}
            value={values.title}
            onChange={handleInputChange}
            onBlur={() => handleBlur("title")}
            className={touched.title && errors.title ? "error" : ""}
          />
          {touched.title && errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={values.amount}
            onChange={handleInputChange}
            onBlur={() => handleBlur("amount")}
            className={touched.amount && errors.amount ? "error" : ""}
          />
          {touched.amount && errors.amount && (
            <span className="error-message">{errors.amount}</span>
          )}
        </div>
      </div>

      {/* Second Row: Date and Category */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <DatePicker
            id="date"
            selected={values.date}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Date"
            onBlur={() => handleBlur("date")}
            className={touched.date && errors.date ? "error" : ""}
          />
          {touched.date && errors.date && (
            <span className="error-message">{errors.date}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={handleInputChange}
            onBlur={() => handleBlur("category")}
            className={touched.category && errors.category ? "error" : ""}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <span className="error-message">{errors.category}</span>
          )}
        </div>
      </div>

      {/* Third Row: Description (full width) */}
      <div className="form-group full-width">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          name="description"
          placeholder={`Add details about this ${type === "income" ? "income" : "expense"}...`}
          value={values.description}
          onChange={handleInputChange}
          onBlur={() => handleBlur("description")}
          className={touched.description && errors.description ? "error" : ""}
          rows="3"
        />
        {touched.description && errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="loading-spinner">Adding...</span>
        ) : (
          `Add ${type === "income" ? "Income" : "Expense"}`
        )}
      </button>
    </FormStyled>
  );
};

const FormStyled = styled.form`
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
    textarea,
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

      &.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);

        &:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
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

    .error-message {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
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

    &:hover:not(:disabled) {
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

  .loading-spinner {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
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

export default Form;
