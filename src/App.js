import React, { useState } from "react";
import styled from "styled-components";
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

  return (
    <AppStyled className="App" role="main" aria-label="Main content">
      <div className="dashboard-layout">
        <Navigation active={active} setActive={setActive} />
        <main className="main-content">
          {displayData()}
        </main>
      </div>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 90%, rgba(51, 153, 137, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 90% 10%, rgba(125, 226, 209, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  .dashboard-layout {
    display: flex;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .main-content {
    flex: 1;
    background: transparent;
    overflow-x: hidden;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(203, 213, 225, 0.5);
      border-radius: 3px;
      
      &:hover {
        background: rgba(148, 163, 184, 0.7);
      }
    }
  }

  @media (max-width: 768px) {
    .dashboard-layout {
      flex-direction: column;
    }
  }
`;

export default App;
