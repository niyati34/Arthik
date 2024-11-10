// src/components/IncomeItem/IncomeItem.js
import React from "react";
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

function IncomeItem({
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
  const categoryIcon = () => {
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
  };

  const expenseCatIcon = () => {
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
  };

  return (
    <IncomeItemStyled indicatorColor={indicatorColor}>
      <div className="icon">
        {type === "expense" ? expenseCatIcon() : categoryIcon()}
      </div>
      <div className="content">
        <h5>{title}</h5>
        <div className="inner-content">
          <div className="text">
            <p>
              {dollar} {amount}
            </p>
            <p>
              {calender} {dateFormat(date)}
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
                onClick={() => deleteItem(id)}
              />
            </div>
          )}
        </div>
      </div>
    </IncomeItemStyled>
  );
}

// Type Checking with PropTypes
IncomeItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string,
  deleteItem: PropTypes.func.isRequired,
  indicatorColor: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["income", "expense"]).isRequired,
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
