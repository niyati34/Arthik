import React, { useState } from "react";
import styled from "styled-components";
import Navigation from "./Components/Navigation/Navigation";
import Dashboard from "./Components/Dashboard/Dashboard";
import Income from "./Components/Income/Income";
import Expenses from "./Components/Expenses/Expenses";
import BudgetPage from "./Components/BudgetTracker/BudgetPage";
import GoalSetter from "./Components/GoalSetter/GoalSetter";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import { GlobalStyle } from "./styles/GlobalStyle";

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
    <ErrorBoundary>
      <AppStyled className="App" role="main" aria-label="Main content">
        <GlobalStyle />
        <div className="dashboard-layout">
          <Navigation active={active} setActive={setActive} />
          <main className="main-content">{displayData()}</main>
        </div>
      </AppStyled>
    </ErrorBoundary>
  );
}

// Now AppStyled is much simpler!
const AppStyled = styled.div`
  height: 100vh;
  position: relative;
  z-index: 1;

  .dashboard-layout {
    display: flex;
    height: 100%;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    overflow: auto; /* Changed to auto to allow scrolling if content overflows */
    height: 100%;
    padding: 2rem; /* Add some padding to the main content area */
  }

  @media (max-width: 768px) {
    .dashboard-layout {
      flex-direction: column;
    }
    .main-content {
      padding: 1rem;
    }
  }
`;

export default App;
