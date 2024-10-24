import { dashboard, expenses, transactions, trend } from "../utils/Icons";

const menuItems = [
  {
    id: 1,
    title: "Dashboard",
    icon: dashboard,
    link: "/dashboard",
  },
  {
    id: 2,
    title: "View Transactions",
    icon: transactions,
    link: "/dashboard",
  },
  {
    id: 3,
    title: "Incomes",
    icon: trend,
    link: "/dashboard",
  },
  {
    id: 4,
    title: "Expenses",
    icon: expenses,
    link: "/dashboard",
  },
  {
    id: 5,
    title: "Budget Tracker/Planner",
    icon: trend, // Use appropriate icon
    link: "/budget-page",
  },
  {
    id: 6,
    title: "Goal Setter",
    icon: trend, // Use appropriate icon
    link: "/goal-setter",
  },
];

export default menuItems;
