import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

// Create the Global Context
const GlobalContext = createContext();

// Function to generate a unique ID without using external libraries
const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Global Provider Component
export const GlobalProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedIncomes = localStorage.getItem("incomes");
    const savedExpenses = localStorage.getItem("expenses");
    const savedBudgets = localStorage.getItem("budgets");

    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
  }, []);

  // Save data to localStorage whenever incomes, expenses, or budgets change
  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [incomes, expenses, budgets]);

  // Add Income
  const addIncome = (income) => {
    const newIncome = {
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      ...income,
    };
    setIncomes((prevIncomes) => [...prevIncomes, newIncome]);
  };

  // Delete Income
  const deleteIncome = (id) => {
    setIncomes((prevIncomes) =>
      prevIncomes.filter((income) => income.id !== id)
    );
  };

  // Add Expense
  const addExpense = (expense) => {
    const newExpense = {
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      ...expense,
    };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  // Delete Expense
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  // Add Budget
  const addBudget = (budget) => {
    const newBudget = {
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      ...budget,
    };
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };

  // Delete Budget
  const deleteBudget = (id) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.id !== id)
    );
  };

  // Calculate Total Expenses
  // Memoized selectors for performance
  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
  }, [expenses]);

  const totalIncomes = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  }, [incomes]);

  const totalBalance = useMemo(() => {
    return totalIncomes - totalExpenses;
  }, [totalIncomes, totalExpenses]);

  // Generate Transaction History (Latest 3 Transactions)
  const transactionHistory = useMemo(() => {
    const history = [
      ...incomes.map((i) => ({ ...i, type: "income" })),
      ...expenses.map((e) => ({ ...e, type: "expense" })),
    ];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  }, [incomes, expenses]);

  // Generate Active Budgets Based on Current Date
  const activeBudgets = useMemo(() => {
    const currentDate = new Date();
    return budgets.filter((budget) => {
      const start = new Date(budget.startDate);
      const end = new Date(budget.endDate);
      return currentDate >= start && currentDate <= end;
    });
  }, [budgets]);

  // Calculate Spending per Budget
  const spendingPerBudget = useMemo(() => {
    return activeBudgets.map((budget) => {
      console.log("Checking expenses for budget:", budget.name);

      // Normalize both expense category and budget name to lowercase
      const filteredExpenses = expenses.filter((expense) => {
        console.log("Expense category:", expense.category);
        return expense.category.toLowerCase() === budget.name.toLowerCase();
      });

      console.log("Filtered Expenses for", budget.name, ":", filteredExpenses);

      const totalSpent = filteredExpenses.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );
      console.log("Total Spent for", budget.name, ":", totalSpent);

      return {
        ...budget,
        spent: totalSpent,
        status:
          totalSpent < budget.amount
            ? "Under Budget"
            : totalSpent === budget.amount
            ? "On Budget"
            : "Over Budget",
      };
    });
  }, [activeBudgets, expenses]);

  // Calculate Savings per Budget
  const savingsPerBudget = useMemo(() => {
    return spendingPerBudget.map((budget) => {
      const totalIncomeForBudgetPeriod = incomes.reduce((acc, income) => {
        const incomeDate = new Date(income.createdAt); // Use the income date
        const budgetStart = new Date(budget.startDate);
        const budgetEnd = new Date(budget.endDate);
        if (incomeDate >= budgetStart && incomeDate <= budgetEnd) {
          return acc + parseFloat(income.amount || 0);
        }
        return acc;
      }, 0);

      const savings = totalIncomeForBudgetPeriod - budget.spent;

      return {
        ...budget,
        savings,
      };
    });
  }, [spendingPerBudget, incomes]);
  return (
    <GlobalContext.Provider
      value={{
        incomes,
        expenses,
        budgets,
        addIncome,
        deleteIncome,
        addExpense,
        deleteExpense,
        addBudget,
        deleteBudget,
        totalExpenses,
        totalIncomes,
        totalBalance,
        transactionHistory,
        activeBudgets,
        spendingPerBudget,
        savingsPerBudget,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to Use Global Context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
