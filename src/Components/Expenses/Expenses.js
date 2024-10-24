import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import ExpenseForm from "./ExpenseForm";
import IncomeItem from "../IncomeItem/IncomeItem";
import { useGlobalContext } from "../../context/globalContext";

function Expenses() {
  const { expenses, addExpense, deleteExpense, totalExpenses } =
    useGlobalContext();
  const [filterCategory, setFilterCategory] = React.useState("");
  const [filterDate, setFilterDate] = React.useState("");

  // Filter expenses by category and date
  const filteredExpenses = expenses.filter((exp) => {
    let match = true;
    if (filterCategory && exp.category !== filterCategory) match = false;
    if (filterDate && exp.date !== filterDate) match = false;
    return match;
  });

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(expenses.map((exp) => exp.category)));

  return (
    <ExpenseStyled>
      <InnerLayout>
        <h1>Expenses</h1>
        <h2 className="total-expense">
          Total Expense: <span>${totalExpenses().toFixed(2)}</span>
        </h2>
        <div className="expense-content">
          <div className="form-container">
            <ExpenseForm addExpense={addExpense} />
          </div>
          <div className="filter-bar">
            <label>Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <label>Date:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="expenses-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td>{expense.title}</td>
                      <td>${expense.amount}</td>
                      <td>{expense.category}</td>
                      <td>{expense.date}</td>
                      <td>{expense.description}</td>
                      <td>
                        <button onClick={() => deleteExpense(expense.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No expenses recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </InnerLayout>
    </ExpenseStyled>
  );
}

const ExpenseStyled = styled.div`
  padding: 2rem;
  background: #fcf6f9;
  color: #212529;

  h1 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #343a40;
  }

  .total-expense {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;

    span {
      color: #dc3545;
      font-size: 1.7rem;
    }
  }

  .expense-content {
    display: flex;
    flex-direction: row;
    gap: 2rem;

    .form-container {
      flex: 1;
    }

    .expenses {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

export default Expenses;
