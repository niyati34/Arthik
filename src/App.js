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

  const components = {
    1: <Dashboard />,
    2: <Income />,
    3: <Expenses />,
    4: <BudgetPage />,
    5: <GoalSetter />,
  };
  const displayData = () => components[active] || <Dashboard />;

  return (
    <AppStyled className="App" role="main" aria-label="Main content">
      <div className="dashboard-layout">
        <Navigation active={active} setActive={setActive} />
        <main className="main-content">{displayData()}</main>
      </div>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 10% 90%,
        rgba(51, 153, 137, 0.03) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 90% 10%,
        rgba(125, 226, 209, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  .dashboard-layout {
    display: flex;
    height: 100vh;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    background: transparent;
    overflow: hidden;
    height: 100vh;
  }

  @media (max-width: 768px) {
    .dashboard-layout {
      flex-direction: column;
    }
  }
`;

export default App;
