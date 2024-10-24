import React from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { dateFormat } from "../../utils/dateFormat";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();

  // Line chart data
  const data = {
    labels: incomes.map((inc) => {
      const { date } = inc;
      return dateFormat(date);
    }),
    datasets: [
      {
        label: "Income",
        data: [
          ...incomes.map((income) => {
            const { amount } = income;
            return amount;
          }),
        ],
        backgroundColor: "green",
        tension: 0.2,
      },
      {
        label: "Expenses",
        data: [
          ...expenses.map((expense) => {
            const { amount } = expense;
            return amount;
          }),
        ],
        backgroundColor: "red",
        tension: 0.2,
      },
    ],
  };

  // Pie chart data for expenses by category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#00ffab",
          "#ff6f00",
          "#00bcd4",
          "#e91e63",
          "#8bc34a",
        ],
      },
    ],
  };

  return (
    <ChartStyled>
      <h3>Income & Expenses Over Time</h3>
      <Line data={data} />
      <h3>Expenses by Category</h3>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Pie chart for expenses by category */}
        <Line data={data} />
        {/* Use Pie chart from react-chartjs-2 */}
        {Object.keys(categoryTotals).length > 0 ? (
          <div style={{ marginTop: "2rem" }}>
            {/* Dynamically import Pie to avoid SSR issues */}
            {React.createElement(require("react-chartjs-2").Pie, {
              data: pieData,
            })}
          </div>
        ) : (
          <p>No expense data for categories yet.</p>
        )}
      </div>
    </ChartStyled>
  );
}

const ChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`;

export default Chart;
