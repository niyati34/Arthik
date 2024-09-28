import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import BudgetPage from './Components/BudgetTracker/BudgetPage';
import GoalSetter from './Components/GoalSetter/GoalSetter';

function App() {
  const [active, setActive] = useState(1);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  const addIncome = (income) => {
    setIncomeData((prev) => [...prev, income]);
  };

  const addExpense = (expense) => {
    setExpenseData((prev) => [...prev, expense]);
  };

  const displayData = () => {
    switch (active) {
      case 1:
      case 2:
        return <Dashboard incomeData={incomeData} expenseData={expenseData} />;
      case 3:
        return <Income incomeData={incomeData} addIncome={addIncome} />;
      case 4:
        return <Expenses expenseData={expenseData} addExpense={addExpense} />;
      case 5:
        return <BudgetPage />;
      case 6:
        return <GoalSetter />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
