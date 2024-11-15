import { renderHook } from '@testing-library/react';
import { useExpenseAnalytics } from './useExpenseAnalytics';

describe('useExpenseAnalytics', () => {
  const mockExpenses = [
    {
      id: 1,
      title: 'Groceries',
      amount: 50,
      date: '2024-01-15',
      category: 'Food',
      description: 'Weekly groceries'
    },
    {
      id: 2,
      title: 'Gas',
      amount: 30,
      date: '2024-01-16',
      category: 'Transportation',
      description: 'Fuel for car'
    },
    {
      id: 3,
      title: 'Restaurant',
      amount: 25,
      date: '2024-01-17',
      category: 'Food',
      description: 'Dinner out'
    },
    {
      id: 4,
      title: 'Movie',
      amount: 15,
      date: '2024-01-18',
      category: 'Entertainment',
      description: 'Movie tickets'
    }
  ];

  it('should return default values for empty expenses', () => {
    const { result } = renderHook(() => useExpenseAnalytics([]));
    
    expect(result.current.totalExpenses).toBe(0);
    expect(result.current.averageExpense).toBe(0);
    expect(result.current.categoryBreakdown).toEqual([]);
    expect(result.current.monthlyTrends).toHaveLength(12);
    expect(result.current.yearlyTrends).toHaveLength(3);
    expect(result.current.topCategories).toEqual([]);
    expect(result.current.insights).toEqual([]);
  });

  it('should calculate basic metrics correctly', () => {
    const { result } = renderHook(() => useExpenseAnalytics(mockExpenses));
    
    expect(result.current.totalExpenses).toBe(120);
    expect(result.current.averageExpense).toBe(30);
  });

  it('should calculate category breakdown correctly', () => {
    const { result } = renderHook(() => useExpenseAnalytics(mockExpenses));
    
    const foodCategory = result.current.categoryBreakdown.find(cat => cat.category === 'Food');
    const transportationCategory = result.current.categoryBreakdown.find(cat => cat.category === 'Transportation');
    const entertainmentCategory = result.current.categoryBreakdown.find(cat => cat.category === 'Entertainment');
    
    expect(foodCategory).toBeDefined();
    expect(foodCategory.total).toBe(75);
    expect(foodCategory.count).toBe(2);
    expect(foodCategory.percentage).toBe(62.5);
    
    expect(transportationCategory).toBeDefined();
    expect(transportationCategory.total).toBe(30);
    expect(transportationCategory.count).toBe(1);
    expect(transportationCategory.percentage).toBe(25);
    
    expect(entertainmentCategory).toBeDefined();
    expect(entertainmentCategory.total).toBe(15);
    expect(entertainmentCategory.count).toBe(1);
    expect(entertainmentCategory.percentage).toBe(12.5);
  });

  it('should identify top categories correctly', () => {
    const { result } = renderHook(() => useExpenseAnalytics(mockExpenses));
    
    expect(result.current.topCategories).toHaveLength(3);
    expect(result.current.topCategories[0].category).toBe('Food');
    expect(result.current.topCategories[0].total).toBe(75);
    expect(result.current.topCategories[1].category).toBe('Transportation');
    expect(result.current.topCategories[2].category).toBe('Entertainment');
  });

  it('should generate insights for top category', () => {
    const { result } = renderHook(() => useExpenseAnalytics(mockExpenses));
    
    const topCategoryInsight = result.current.insights.find(insight => insight.type === 'top_category');
    expect(topCategoryInsight).toBeDefined();
    expect(topCategoryInsight.message).toContain('Food is your highest spending category');
    expect(topCategoryInsight.value).toBe(75);
  });

  it('should handle expenses without categories', () => {
    const expensesWithoutCategory = [
      {
        id: 1,
        title: 'Unknown Expense',
        amount: 100,
        date: '2024-01-15',
        description: 'No category specified'
      }
    ];
    
    const { result } = renderHook(() => useExpenseAnalytics(expensesWithoutCategory));
    
    const uncategorized = result.current.categoryBreakdown.find(cat => cat.category === 'Uncategorized');
    expect(uncategorized).toBeDefined();
    expect(uncategorized.total).toBe(100);
    expect(uncategorized.count).toBe(1);
  });

  it('should calculate spending patterns correctly', () => {
    const { result } = renderHook(() => useExpenseAnalytics(mockExpenses));
    
    expect(result.current.spendingPatterns.byAmountRange.small).toBe(1); // $15 movie
    expect(result.current.spendingPatterns.byAmountRange.medium).toBe(3); // $25, $30, $50
    expect(result.current.spendingPatterns.byAmountRange.large).toBe(0);
  });

  it('should handle null or undefined expenses gracefully', () => {
    const { result } = renderHook(() => useExpenseAnalytics(null));
    
    expect(result.current.totalExpenses).toBe(0);
    expect(result.current.averageExpense).toBe(0);
    expect(result.current.categoryBreakdown).toEqual([]);
  });
});
