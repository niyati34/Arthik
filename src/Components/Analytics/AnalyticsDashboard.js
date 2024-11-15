import React, { useState } from 'react';
import styled from 'styled-components';
import { useExpenseAnalytics } from '../../utils/useExpenseAnalytics';

/**
 * Analytics Dashboard Component
 * Displays advanced expense insights, trends, and data visualizations
 */
const AnalyticsDashboard = ({ expenses }) => {
  const analytics = useExpenseAnalytics(expenses);
  const [activeTab, setActiveTab] = useState('overview');

  const {
    totalExpenses,
    averageExpense,
    categoryBreakdown,
    monthlyTrends,
    yearlyTrends,
    topCategories,
    recentTrends,
    insights,
    spendingPatterns
  } = analytics;

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'down':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'top_category':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'spending_increase':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'spending_decrease':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <span className="amount">${totalExpenses.toFixed(2)}</span>
            <span className="count">{expenses.length} transactions</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Average Expense</h3>
            <span className="amount">${averageExpense.toFixed(2)}</span>
            <span className="count">per transaction</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Recent Trend</h3>
            <span className={`amount ${recentTrends.trendDirection}`}>
              {getTrendIcon(recentTrends.trendDirection)}
              {Math.abs(recentTrends.trendPercentage).toFixed(1)}%
            </span>
            <span className="count">
              {recentTrends.trendDirection === 'up' ? 'Increase' : 
               recentTrends.trendDirection === 'down' ? 'Decrease' : 'Stable'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Categories</h3>
            <span className="amount">{categoryBreakdown.length}</span>
            <span className="count">active categories</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="insights-section">
          <h3>Smart Insights</h3>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.severity || 'info'}`}>
                <div className="insight-icon">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="insight-content">
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div className="categories-section">
          <h3>Top Spending Categories</h3>
          <div className="categories-list">
            {topCategories.map((category, index) => (
              <div key={category.category} className="category-item">
                <div className="category-info">
                  <span className="category-name">{category.category}</span>
                  <span className="category-count">{category.count} transactions</span>
                </div>
                <div className="category-amount">
                  <span className="amount">${category.total.toFixed(2)}</span>
                  <span className="percentage">{category.percentage.toFixed(1)}%</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="trends-section">
      {/* Monthly Trends */}
      <div className="trend-chart">
        <h3>Monthly Spending Trends</h3>
        <div className="chart-container">
          {monthlyTrends.map((month, index) => (
            <div key={index} className="chart-bar">
              <div className="bar-tooltip">
                <span className="tooltip-amount">${month.total.toFixed(2)}</span>
                <span className="tooltip-count">{month.count} expenses</span>
              </div>
              <div 
                className="bar-fill"
                style={{ 
                  height: `${month.total > 0 ? (month.total / Math.max(...monthlyTrends.map(m => m.total))) * 100 : 0}%` 
                }}
              ></div>
              <span className="bar-label">{month.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Trends */}
      <div className="trend-chart">
        <h3>Yearly Spending Trends</h3>
        <div className="yearly-stats">
          {yearlyTrends.map((year, index) => (
            <div key={year.year} className="year-stat">
              <div className="year-header">
                <h4>{year.year}</h4>
                <span className="year-total">${year.total.toFixed(2)}</span>
              </div>
              <div className="year-details">
                <span>{year.count} transactions</span>
                <span>Avg: ${year.average.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="patterns-section">
      {/* Day of Week Pattern */}
      <div className="pattern-chart">
        <h3>Spending by Day of Week</h3>
        <div className="pattern-grid">
          {Object.entries(spendingPatterns.byDayOfWeek).map(([day, data]) => (
            <div key={day} className="pattern-item">
              <span className="pattern-label">{day}</span>
              <div className="pattern-bar">
                <div 
                  className="pattern-fill"
                  style={{ 
                    width: `${data.total > 0 ? (data.total / Math.max(...Object.values(spendingPatterns.byDayOfWeek).map(d => d.total))) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <span className="pattern-amount">${data.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Range Distribution */}
      <div className="pattern-chart">
        <h3>Expense Amount Distribution</h3>
        <div className="amount-distribution">
          <div className="distribution-item">
            <span className="range-label">Small (&lt; $50)</span>
            <div className="distribution-bar">
              <div 
                className="distribution-fill small"
                style={{ 
                  width: `${spendingPatterns.byAmountRange.small > 0 ? (spendingPatterns.byAmountRange.small / expenses.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="distribution-count">{spendingPatterns.byAmountRange.small}</span>
          </div>
          <div className="distribution-item">
            <span className="range-label">Medium ($50 - $200)</span>
            <div className="distribution-bar">
              <div 
                className="distribution-fill medium"
                style={{ 
                  width: `${spendingPatterns.byAmountRange.medium > 0 ? (spendingPatterns.byAmountRange.medium / expenses.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="distribution-count">{spendingPatterns.byAmountRange.medium}</span>
          </div>
          <div className="distribution-item">
            <span className="range-label">Large (> $200)</span>
            <div className="distribution-bar">
              <div 
                className="distribution-fill large"
                style={{ 
                  width: `${spendingPatterns.byAmountRange.large > 0 ? (spendingPatterns.byAmountRange.large / expenses.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="distribution-count">{spendingPatterns.byAmountRange.large}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AnalyticsStyled>
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="header-content">
            <h1>Expense Analytics</h1>
            <p>Advanced insights and spending patterns</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button 
            className={`tab-button ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            Patterns
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'trends' && renderTrends()}
          {activeTab === 'patterns' && renderPatterns()}
        </div>
      </div>
    </AnalyticsStyled>
  );
};

const AnalyticsStyled = styled.div`
  width: 100%;
  min-height: 100%;
  background: transparent;
  overflow: visible;

  .analytics-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  /* Header Styles */
  .analytics-header {
    margin-bottom: 1rem;

    .header-content {
      h1 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.25rem;
        line-height: 1.2;
      }

      p {
        color: #64748b;
        font-size: 0.75rem;
        margin: 0;
      }
    }
  }

  /* Tab Navigation */
  .tab-navigation {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;

    .tab-button {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }

      &.active {
        background: #0f172a;
        color: #ffffff;
      }
    }
  }

  /* Metrics Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;

    .metric-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .metric-icon {
        width: 48px;
        height: 48px;
        background: #f0fdf4;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #10b981;
      }

      .metric-content {
        h3 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          margin: 0 0 0.25rem 0;
        }

        .amount {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.125rem;

          &.up {
            color: #ef4444;
          }

          &.down {
            color: #10b981;
          }

          svg {
            margin-right: 0.25rem;
          }
        }

        .count {
          font-size: 0.75rem;
          color: #64748b;
        }
      }
    }
  }

  /* Insights Section */
  .insights-section {
    margin-bottom: 2rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .insights-grid {
      display: grid;
      gap: 0.75rem;

      .insight-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

        &.warning {
          border-left: 4px solid #f59e0b;
          .insight-icon {
            color: #f59e0b;
          }
        }

        &.positive {
          border-left: 4px solid #10b981;
          .insight-icon {
            color: #10b981;
          }
        }

        &.info {
          border-left: 4px solid #3b82f6;
          .insight-icon {
            color: #3b82f6;
          }
        }

        .insight-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .insight-content {
          p {
            margin: 0;
            font-size: 0.875rem;
            color: #374151;
            line-height: 1.4;
          }
        }
      }
    }
  }

  /* Categories Section */
  .categories-section {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .categories-list {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .category-item {
        padding: 1rem;
        border-bottom: 1px solid #f1f5f9;
        position: relative;

        &:last-child {
          border-bottom: none;
        }

        .category-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .category-name {
            font-weight: 600;
            color: #0f172a;
          }

          .category-count {
            font-size: 0.75rem;
            color: #64748b;
          }
        }

        .category-amount {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .amount {
            font-weight: 600;
            color: #0f172a;
          }

          .percentage {
            font-size: 0.75rem;
            color: #64748b;
          }
        }

        .category-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 2px;
          overflow: hidden;

          .bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 2px;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }

  /* Trends Section */
  .trends-section {
    .trend-chart {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 1rem;
      }

      .chart-container {
        display: flex;
        align-items: end;
        gap: 0.5rem;
        height: 200px;
        padding: 1rem 0;

        .chart-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          .bar-tooltip {
            position: absolute;
            top: -40px;
            background: #0f172a;
            color: #ffffff;
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            white-space: nowrap;
            z-index: 10;

            .tooltip-amount {
              display: block;
              font-weight: 600;
            }

            .tooltip-count {
              display: block;
              opacity: 0.8;
            }
          }

          &:hover .bar-tooltip {
            opacity: 1;
          }

          .bar-fill {
            width: 100%;
            background: linear-gradient(180deg, #10b981, #059669);
            border-radius: 4px 4px 0 0;
            transition: height 0.3s ease;
            min-height: 4px;
          }

          .bar-label {
            margin-top: 0.5rem;
            font-size: 0.75rem;
            color: #64748b;
            text-align: center;
          }
        }
      }

      .yearly-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;

        .year-stat {
          background: #f8fafc;
          border-radius: 6px;
          padding: 1rem;

          .year-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            h4 {
              font-size: 1rem;
              font-weight: 600;
              color: #0f172a;
              margin: 0;
            }

            .year-total {
              font-weight: 600;
              color: #10b981;
            }
          }

          .year-details {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #64748b;
          }
        }
      }
    }
  }

  /* Patterns Section */
  .patterns-section {
    .pattern-chart {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      h3 {
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 1rem;
      }

      .pattern-grid {
        display: grid;
        gap: 0.75rem;

        .pattern-item {
          display: flex;
          align-items: center;
          gap: 1rem;

          .pattern-label {
            min-width: 100px;
            font-size: 0.875rem;
            color: #374151;
          }

          .pattern-bar {
            flex: 1;
            height: 8px;
            background: #f1f5f9;
            border-radius: 4px;
            overflow: hidden;

            .pattern-fill {
              height: 100%;
              background: linear-gradient(90deg, #3b82f6, #1d4ed8);
              border-radius: 4px;
              transition: width 0.3s ease;
            }
          }

          .pattern-amount {
            min-width: 80px;
            text-align: right;
            font-weight: 600;
            color: #0f172a;
          }
        }
      }

      .amount-distribution {
        display: grid;
        gap: 1rem;

        .distribution-item {
          display: flex;
          align-items: center;
          gap: 1rem;

          .range-label {
            min-width: 120px;
            font-size: 0.875rem;
            color: #374151;
          }

          .distribution-bar {
            flex: 1;
            height: 12px;
            background: #f1f5f9;
            border-radius: 6px;
            overflow: hidden;

            .distribution-fill {
              height: 100%;
              border-radius: 6px;
              transition: width 0.3s ease;

              &.small {
                background: linear-gradient(90deg, #10b981, #059669);
              }

              &.medium {
                background: linear-gradient(90deg, #f59e0b, #d97706);
              }

              &.large {
                background: linear-gradient(90deg, #ef4444, #dc2626);
              }
            }
          }

          .distribution-count {
            min-width: 40px;
            text-align: right;
            font-weight: 600;
            color: #0f172a;
          }
        }
      }
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .chart-container {
      gap: 0.25rem;
      
      .chart-bar .bar-label {
        font-size: 0.625rem;
      }
    }

    .yearly-stats {
      grid-template-columns: 1fr;
    }

    .pattern-item,
    .distribution-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;

      .pattern-label,
      .range-label {
        min-width: auto;
      }

      .pattern-amount,
      .distribution-count {
        min-width: auto;
        text-align: left;
      }
    }
  }
`;

export default AnalyticsDashboard;
