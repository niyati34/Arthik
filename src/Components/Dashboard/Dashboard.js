import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import History from '../../History/History';
import { dollar } from '../../utils/Icons';

function Dashboard() {
  const {
    incomes,
    expenses,
    totalExpenses,
    totalIncomes,
    totalBalance,
    addIncome,
    addExpense,
    transactionHistory,
  } = useGlobalContext();

  const [timeframe, setTimeframe] = useState('all');

  // Filter data based on timeframe
  const filterDataByTimeframe = (data) => {
    if (timeframe === 'all') return data;
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      if (timeframe === '30days') return itemDate >= thirtyDaysAgo;
      if (timeframe === '90days') return itemDate >= ninetyDaysAgo;
      return true;
    });
  };

  const filteredIncomes = filterDataByTimeframe(incomes);
  const filteredExpenses = filterDataByTimeframe(expenses);

  return (
    <DashboardStyled>
      <InnerLayout>
        <div className="dashboard-header">
          <h1>Financial Overview</h1>
          <div className="timeframe-selector">
            <button 
              className={timeframe === 'all' ? 'active' : ''}
              onClick={() => setTimeframe('all')}
            >
              All Time
            </button>
            <button 
              className={timeframe === '90days' ? 'active' : ''}
              onClick={() => setTimeframe('90days')}
            >
              90 Days
            </button>
            <button 
              className={timeframe === '30days' ? 'active' : ''}
              onClick={() => setTimeframe('30days')}
            >
              30 Days
            </button>
          </div>
        </div>
        
        <div className="summary-cards">
          <div className="summary-card income-card">
            <div className="card-content">
              <h2>Total Income</h2>
              <p className="amount">{dollar} {totalIncomes.toFixed(2)}</p>
              <p className="range">Min: ${Math.min(...incomes.map((item) => item.amount)) || 0} | Max: ${Math.max(...incomes.map((item) => item.amount)) || 0}</p>
            </div>
          </div>
          
          <div className="summary-card expense-card">
            <div className="card-content">
              <h2>Total Expenses</h2>
              <p className="amount">{dollar} {totalExpenses.toFixed(2)}</p>
              <p className="range">Min: ${Math.min(...expenses.map((item) => item.amount)) || 0} | Max: ${Math.max(...expenses.map((item) => item.amount)) || 0}</p>
            </div>
          </div>
          
          <div className="summary-card balance-card">
            <div className="card-content">
              <h2>Net Balance</h2>
              <p className="amount">{dollar} {totalBalance.toFixed(2)}</p>
              <p className="range">{totalBalance >= 0 ? '✓ Positive Balance' : '⚠ Negative Balance'}</p>
            </div>
          </div>
        </div>
        
        <div className="stats-con">
          <div className="chart-con">
            <h2>Income vs. Expenses</h2>
            <Chart incomes={filteredIncomes} expenses={filteredExpenses} />
          </div>
          
          <div className="history-con">
            <h2>Recent Transactions</h2>
            <History />
          </div>
        </div>
      </InnerLayout>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  width: 100%;
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    
    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2b2c28;
    }
  }
  
  .timeframe-selector {
    display: flex;
    gap: 0.5rem;
    
    button {
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        border-color: #7de2d1;
      }
      
      &.active {
        background: #339989;
        color: #fffafb;
        border-color: #339989;
      }
    }
  }
  
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .summary-card {
    background: #fffafb;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.08);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #2b2c28;
    }
    
    .amount {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .range {
      font-size: 0.8rem;
      color: #131515;
      opacity: 0.7;
    }
  }
  
  .income-card .amount {
    color: #339989;
  }
  
  .expense-card .amount {
    color: #d97706;
  }
  
  .balance-card .amount {
    color: ${props => props.theme.balance || '#339989'};
  }
  
  .stats-con {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    @media (min-width: 968px) {
      grid-template-columns: 1.5fr 1fr;
    }
    
    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #2b2c28;
    }
  }
  
  .chart-con {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
  }
  
  .history-con {
    background: #fffafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(19, 21, 21, 0.05);
  }
`;

export default Dashboard;
