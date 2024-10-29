import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { MainLayout } from "./styles/Layouts";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import BudgetPage from "./Components/BudgetTracker/BudgetPage";
import GoalSetter from "./Components/GoalSetter/GoalSetter";

function App() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Income />;
      case 3:
        return <Expenses />;
      case 4:
        return <BudgetPage />;
      case 5:
        return <GoalSetter />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => <Orb />, []);

  return (
    <AppStyled className="App" role="main" aria-label="Main content">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main className="main-content">{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(51, 153, 137, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(125, 226, 209, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(43, 44, 40, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .main-content {
    flex: 1;
    background: rgba(255, 250, 251, 0.95);
    border: 1px solid #e5e7eb;
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 1rem;
    box-shadow: 0 8px 32px rgba(19, 21, 21, 0.08);
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
      
      &:hover {
        background: #94a3b8;
      }
    }
  }

  @media (max-width: 768px) {
    .main-content {
      margin: 0.5rem;
      border-radius: 16px;
    }
  }
`;

export default App;
