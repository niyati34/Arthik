// src/components/IncomeItem/IncomeItem.js
import React, { useMemo, useCallback } from "react";
import styled from "styled-components";
import { dateFormat } from "../../utils/dateFormat";
import {
  bitcoin,
  book,
  calender,
  card,
  circle,
  clothing,
  comment,
  dollar,
  food,
  freelance,
  medical,
  money,
  piggy,
  stocks,
  takeaway,
  trash,
  tv,
  users,
  yt,
} from "../../utils/Icons";
import Button from "../Button/Button";
import PropTypes from "prop-types"; // For type checking

/**
 * IncomeItem Component
 * 
 * @description
 * A reusable component for displaying individual income or expense items in a list.
 * Supports both income and expense types with appropriate icons, formatting, and actions.
 * 
 * @component
 * @example
 * ```jsx
 * <IncomeItem
 *   id="income-1"
 *   title="Monthly Salary"
 *   amount={5000}
 *   date="2024-01-15"
 *   category="Salary"
 *   description="Monthly salary from employer"
 *   type="income"
 *   deleteItem={handleDelete}
 *   indicatorColor="#10b981"
 * />
 * ```
 * 
 * @example
 * ```jsx
 * <IncomeItem
 *   id="expense-1"
 *   title="Grocery Shopping"
 *   amount={150.50}
 *   date="2024-01-16"
 *   category="Food"
 *   description="Weekly grocery shopping"
 *   type="expense"
 *   deleteItem={handleDelete}
 *   indicatorColor="#ef4444"
 * />
 * ```
 */
const IncomeItem = React.memo(function IncomeItem({
  id,
  title,
  amount,
  date,
  category,
  description,
  deleteItem,
  indicatorColor,
  type,
  showDelete = true, // Default to true
}) {
  /**
   * Memoized category icon for income items.
   * Prevents unnecessary recalculations when component re-renders.
   * 
   * @type {JSX.Element}
   */
  const categoryIcon = useMemo(() => {
    switch (category) {
      case "salary":
        return money;
      case "freelancing":
        return freelance;
      case "investments":
        return stocks;
      case "stocks":
        return users;
      case "bitcoin":
        return bitcoin;
      case "bank":
        return card;
      case "youtube":
        return yt;
      case "other":
        return piggy;
      default:
        return "";
    }
  }, [category]);

  /**
   * Memoized category icon for expense items.
   * Prevents unnecessary recalculations when component re-renders.
   * 
   * @type {JSX.Element}
   */
  const expenseCatIcon = useMemo(() => {
    switch (category) {
      case "education":
        return book;
      case "groceries":
        return food;
      case "health":
        return medical;
      case "subscriptions":
        return tv;
      case "takeaways":
        return takeaway;
      case "clothing":
        return clothing;
      case "travelling":
        return freelance;
      case "other":
        return circle;
      default:
        return "";
    }
  }, [category]);

  /**
   * Memoized formatted date string.
   * Prevents unnecessary date formatting on every render.
   * 
   * @type {string}
   */
  const formattedDate = useMemo(() => dateFormat(date), [date]);

  /**
   * Memoized delete handler function.
   * Prevents unnecessary re-renders of child components.
   * 
   * @type {Function}
   */
  const handleDelete = useCallback(() => {
    deleteItem(id);
  }, [deleteItem, id]);

  /**
   * Memoized current icon based on item type.
   * Determines whether to show income or expense icon.
   * 
   * @type {JSX.Element}
   */
  const currentIcon = useMemo(() => {
    return type === "expense" ? expenseCatIcon : categoryIcon;
  }, [type, expenseCatIcon, categoryIcon]);

  return (
    <IncomeItemStyled indicatorColor={indicatorColor}>
      <div className="icon">
        {currentIcon}
      </div>
      <div className="content">
        <h5>{title}</h5>
        <div className="inner-content">
          <div className="text">
            <p>
              {dollar} {amount}
            </p>
            <p>
              {calender} {formattedDate}
            </p>
            <p>
              {comment}
              {description}
            </p>
          </div>
          {showDelete && (
            <div className="btn-con">
              <Button
                icon={trash}
                bPad={"1rem"}
                bRad={"50%"}
                bg={"var(--primary-color)"}
                color={"#000000"}
                iColor={"#fff"}
                hColor={"var(--color-green)"}
                onClick={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
    </IncomeItemStyled>
  );
});

// Type Checking with PropTypes
IncomeItem.propTypes = {
  /** Unique identifier for the item */
  id: PropTypes.string.isRequired,
  /** Title or name of the income/expense */
  title: PropTypes.string.isRequired,
  /** Amount of money (can be string or number) */
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Date of the transaction (string or Date object) */
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  /** Category classification of the item */
  category: PropTypes.string.isRequired,
  /** Optional description or notes */
  description: PropTypes.string,
  /** Function to handle item deletion */
  deleteItem: PropTypes.func.isRequired,
  /** Color for visual indicators */
  indicatorColor: PropTypes.string.isRequired,
  /** Type of financial item: 'income' or 'expense' */
  type: PropTypes.oneOf(["income", "expense"]).isRequired,
  /** Whether to show the delete button */
  showDelete: PropTypes.bool, // Optional prop
};

// Located in src/Components/IncomeItem/IncomeItem.js
// ... (Your component's React code remains the same)

const IncomeItemStyled = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.07);
  }

  .icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f0fdf4; /* Light green background for income */
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #bbf7d0;

    i {
      font-size: 2rem;
      color: var(--color-green); /* Or your primary green color */
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    h5 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.2;
      margin: 0;
    }

    .inner-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: #64748b;
      font-size: 0.875rem;

      p {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.9;
      }
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    gap: 1rem;

    .amount {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--color-green); /* Green for income */
    }

    .btn-con {
      .delete-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 0.25rem;
        font-size: 1.25rem;
        transition: color 0.2s ease;

        &:hover {
          color: #ef4444; /* Red on hover for delete */
        }
      }
    }
  }
`;

export default IncomeItem;
