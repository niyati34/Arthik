import React, { useState, useEffect } from "react";
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
  BarElement,
} from "chart.js";

import { Line, Pie, Bar } from "react-chartjs-2";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { dateFormat } from "../../utils/dateFormat";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Chart() {
  const { incomes, expenses } = useGlobalContext();
  const [timeRange, setTimeRange] = useState("all");
  const [chartType, setChartType] = useState("line");
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Filter data based on time range
  useEffect(() => {
    const now = new Date();
    let startDate = new Date(0); // Default to all time

    if (timeRange === "week") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
      );
    } else if (timeRange === "month") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
    } else if (timeRange === "year") {
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );
    }

    setFilteredIncomes(
      incomes.filter((inc) => new Date(inc.date) >= startDate)
    );
    setFilteredExpenses(
      expenses.filter((exp) => new Date(exp.date) >= startDate)
    );
  }, [timeRange, incomes, expenses]);

  // Get all unique dates from both incomes and expenses
  const allDates = [...filteredIncomes, ...filteredExpenses]
    .map((item) => new Date(item.date))
    .sort((a, b) => a - b);

  // Remove duplicate dates
  const uniqueDates = allDates.filter(
    (date, index, self) =>
      index === self.findIndex((d) => dateFormat(d) === dateFormat(date))
  );

  // Create labels from unique dates
  const labels = uniqueDates.map((date) => dateFormat(date));

  // Prepare data for each date
  const incomeData = labels.map((label) => {
    const matchingIncomes = filteredIncomes.filter(
      (inc) => dateFormat(inc.date) === label
    );
    return matchingIncomes.reduce(
      (total, inc) => total + parseFloat(inc.amount),
      0
    );
  });

  const expenseData = labels.map((label) => {
    const matchingExpenses = filteredExpenses.filter(
      (exp) => dateFormat(exp.date) === label
    );
    return matchingExpenses.reduce(
      (total, exp) => total + parseFloat(exp.amount),
      0
    );
  });

  // Line/Bar chart data
  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(51, 153, 137, 0.5)",
        borderColor: "#339989",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "#339989",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "rgba(239, 71, 111, 0.5)",
        borderColor: "#ef476f",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "#ef476f",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Pie chart data for expenses by category
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  const pieData = {
    labels: Object.keys(sortedCategories).map(
      (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(sortedCategories),
        backgroundColor: [
          "#ef476f", // Red
          "#ffd166", // Yellow
          "#06d6a0", // Green
          "#118ab2", // Blue
          "#073b4c", // Dark Blue
          "#7209b7", // Purple
          "#f72585", // Pink
          "#4cc9f0", // Light Blue
          "#fb8500", // Orange
          "#219ebc", // Teal
          "#8ecae6", // Sky Blue
          "#023047", // Navy
        ],
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: '"Poppins", sans-serif',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        bodyFont: {
          family: '"Poppins", sans-serif',
        },
        borderColor: "#e1e1e1",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${typeof context.raw === 'number' && !isNaN(context.raw) ? context.raw.toFixed(2) : '0.00'}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            family: '"Poppins", sans-serif',
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        bodyFont: {
          family: '"Poppins", sans-serif',
        },
        borderColor: "#e1e1e1",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce(
              (sum, val) => sum + val,
              0
            );
                    const percentage = typeof context.raw === 'number' && typeof total === 'number' && !isNaN(context.raw) && !isNaN(total) ? ((context.raw / total) * 100).toFixed(1) : '0.0';
        return `${context.label}: $${typeof context.raw === 'number' && !isNaN(context.raw) ? context.raw.toFixed(2) : '0.00'} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartStyled>
      <div className="chart-header">
        <h3>Financial Overview</h3>
        <div className="chart-controls">
          <div className="time-filter">
            <button
              className={timeRange === "week" ? "active" : ""}
              onClick={() => setTimeRange("week")}
            >
              Week
            </button>
            <button
              className={timeRange === "month" ? "active" : ""}
              onClick={() => setTimeRange("month")}
            >
              Month
            </button>
            <button
              className={timeRange === "year" ? "active" : ""}
              onClick={() => setTimeRange("year")}
            >
              Year
            </button>
            <button
              className={timeRange === "all" ? "active" : ""}
              onClick={() => setTimeRange("all")}
            >
              All Time
            </button>
          </div>
          <div className="chart-type">
            <button
              className={chartType === "line" ? "active" : ""}
              onClick={() => setChartType("line")}
            >
              Line
            </button>
            <button
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h4>Income & Expenses Over Time</h4>
        <div className="time-chart">
          {chartType === "line" ? (
            <Line data={data} options={options} />
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </div>

      <div className="chart-container">
        <h4>Expenses by Category</h4>
        <div className="category-chart">
          {Object.keys(categoryTotals).length > 0 ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <div className="no-data">
              <p>No expense data for categories yet.</p>
              <small>Add some expenses to see your spending breakdown</small>
            </div>
          )}
        </div>
      </div>

      {filteredIncomes.length === 0 && filteredExpenses.length === 0 && (
        <div className="no-data-message">
          <p>No financial data available for the selected time period.</p>
          <small>
            Try selecting a different time range or add some transactions
          </small>
        </div>
      )}
    </ChartStyled>
  );
}

const ChartStyled = styled.div`
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .chart-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0.5rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0;
    }

    .chart-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: space-between;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
      }

      .time-filter,
      .chart-type {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;

        button {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 0.375rem 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #f1f5f9;
          }

          &.active {
            background: #0f172a;
            color: white;
            border-color: #0f172a;
          }
        }
      }
    }
  }

  .chart-container {
    background: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    overflow: visible;

    h4 {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      margin: 0 0 0.75rem 0;
    }

    .time-chart {
      height: 200px;
      position: relative;
      overflow: visible;
    }

    .category-chart {
      height: 200px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: #94a3b8;

      p {
        margin: 0 0 0.25rem 0;
        font-weight: 500;
        font-size: 0.875rem;
      }

      small {
        font-size: 0.75rem;
      }
    }
  }

  .no-data-message {
    background: #f8fafc;
    border-radius: 6px;
    padding: 1rem;
    text-align: center;
    color: #64748b;
    margin-top: auto;

    p {
      margin: 0 0 0.25rem 0;
      font-weight: 500;
      font-size: 0.875rem;
    }

    small {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 768px) {
    padding: 0;
    gap: 0.75rem;

    .chart-container {
      padding: 0;

      .time-chart,
      .category-chart {
        height: 180px;
      }
    }
  }
`;

export default Chart;
