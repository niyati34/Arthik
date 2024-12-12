import { useMemo } from 'react';

/**
 * Custom hook for advanced expense analytics and insights
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Analytics data including trends, insights, and calculated metrics
 */
export const useExpenseAnalytics = (expenses) => {
  const analytics = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      // Generate empty monthly trends (12 months)
      const emptyMonthlyTrends = [];
      const currentDate = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        emptyMonthlyTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: 0,
          count: 0,
          average: 0
        });
      }

      // Generate empty yearly trends (3 years)
      const emptyYearlyTrends = [];
      const currentYear = currentDate.getFullYear();
      for (let year = currentYear - 2; year <= currentYear; year++) {
        emptyYearlyTrends.push({
          year: year.toString(),
          total: 0,
          count: 0,
          average: 0
        });
      }

      return {
        totalExpenses: 0,
        averageExpense: 0,
        categoryBreakdown: [],
        monthlyTrends: emptyMonthlyTrends,
        yearlyTrends: emptyYearlyTrends,
        topCategories: [],
        recentTrends: {
          currentPeriod: 0,
          previousPeriod: 0,
          trendPercentage: 0,
          trendDirection: 'stable',
          averagePerDay: 0
        },
        insights: [],
        spendingPatterns: {
          byDayOfWeek: {},
          byTimeOfDay: {},
          byAmountRange: {
            small: 0,
            medium: 0,
            large: 0
          }
        }
      };
    }

    // Calculate basic metrics
    const totalExpenses = expenses.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      return sum + amount;
    }, 0);
    const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0, average: 0 };
      }
      acc[category].total += amount;
      acc[category].count += 1;
      acc[category].average = acc[category].total / acc[category].count;
      return acc;
    }, {});

    // Convert to array format for easier consumption
    const categoryBreakdownArray = Object.entries(categoryBreakdown).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      average: data.average,
      percentage: (data.total / totalExpenses) * 100
    }));

    // Monthly trends (last 12 months)
    const monthlyTrends = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === date.getFullYear() && 
               expenseDate.getMonth() === date.getMonth();
      });

      const monthTotal = monthExpenses.reduce((sum, expense) => {
        const amount = typeof expense.amount === 'number' ? expense.amount : 0;
        return sum + amount;
      }, 0);
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        total: monthTotal,
        count: monthExpenses.length,
        average: monthExpenses.length > 0 ? monthTotal / monthExpenses.length : 0
      });
    }

    // Yearly trends
    const yearlyTrends = [];
    const currentYear = currentDate.getFullYear();
    for (let year = currentYear - 2; year <= currentYear; year++) {
      const yearExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === year;
      });

      const yearTotal = yearExpenses.reduce((sum, expense) => {
        const amount = typeof expense.amount === 'number' ? expense.amount : 0;
        return sum + amount;
      }, 0);
      
      yearlyTrends.push({
        year: year.toString(),
        total: yearTotal,
        count: yearExpenses.length,
        average: yearExpenses.length > 0 ? yearTotal / yearExpenses.length : 0
      });
    }

    // Top spending categories
    const topCategories = categoryBreakdownArray
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= thirtyDaysAgo;
    });

    const recentTotal = recentExpenses.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      return sum + amount;
    }, 0);
    const previousThirtyDays = new Date();
    previousThirtyDays.setDate(previousThirtyDays.getDate() - 60);
    
    const previousExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= previousThirtyDays && expenseDate < thirtyDaysAgo;
    });

    const previousTotal = previousExpenses.reduce((sum, expense) => {
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      return sum + amount;
    }, 0);
    const trendPercentage = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal) * 100 : 0;

    const recentTrends = {
      currentPeriod: recentTotal,
      previousPeriod: previousTotal,
      trendPercentage,
      trendDirection: trendPercentage > 0 ? 'up' : trendPercentage < 0 ? 'down' : 'stable',
      averagePerDay: recentExpenses.length > 0 ? recentTotal / 30 : 0
    };

    // Generate insights
    const insights = [];
    
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      if (topCategory && 
          typeof topCategory.total === 'number' && 
          typeof topCategory.percentage === 'number' && 
          !isNaN(topCategory.total) && 
          !isNaN(topCategory.percentage)) {
        insights.push({
          type: 'top_category',
          message: `${topCategory.category} is your highest spending category at $${topCategory.total.toFixed(2)} (${topCategory.percentage.toFixed(1)}% of total)`,
          value: topCategory.total,
          category: topCategory.category
        });
      }
    }

    if (typeof recentTrends.trendPercentage === 'number' && 
        !isNaN(recentTrends.trendPercentage) && 
        recentTrends.trendPercentage > 10) {
      insights.push({
        type: 'spending_increase',
        message: `Your spending has increased by ${Math.abs(recentTrends.trendPercentage).toFixed(1)}% compared to the previous month`,
        value: recentTrends.trendPercentage,
        severity: 'warning'
      });
    } else if (typeof recentTrends.trendPercentage === 'number' && 
               !isNaN(recentTrends.trendPercentage) && 
               recentTrends.trendPercentage < -10) {
      insights.push({
        type: 'spending_decrease',
        message: `Great job! Your spending has decreased by ${Math.abs(recentTrends.trendPercentage).toFixed(1)}% compared to the previous month`,
        value: recentTrends.trendPercentage,
        severity: 'positive'
      });
    }

    if (typeof averageExpense === 'number' && 
        !isNaN(averageExpense) && 
        averageExpense > 100) {
      insights.push({
        type: 'high_average',
        message: `Your average expense is $${averageExpense.toFixed(2)}. Consider reviewing larger purchases.`,
        value: averageExpense,
        severity: 'info'
      });
    }

    // Spending patterns
    const spendingPatterns = {
      byDayOfWeek: {},
      byTimeOfDay: {},
      byAmountRange: {
        small: 0,    // < $50
        medium: 0,   // $50 - $200
        large: 0,    // > $200
      }
    };

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.getHours();
      
      // Day of week pattern
      if (!spendingPatterns.byDayOfWeek[dayOfWeek]) {
        spendingPatterns.byDayOfWeek[dayOfWeek] = { total: 0, count: 0 };
      }
      const amount = typeof expense.amount === 'number' ? expense.amount : 0;
      spendingPatterns.byDayOfWeek[dayOfWeek].total += amount;
      spendingPatterns.byDayOfWeek[dayOfWeek].count += 1;

      // Time of day pattern
      let timeOfDay;
      if (hour < 12) timeOfDay = 'Morning';
      else if (hour < 17) timeOfDay = 'Afternoon';
      else if (hour < 21) timeOfDay = 'Evening';
      else timeOfDay = 'Night';

      if (!spendingPatterns.byTimeOfDay[timeOfDay]) {
        spendingPatterns.byTimeOfDay[timeOfDay] = { total: 0, count: 0 };
      }
      spendingPatterns.byTimeOfDay[timeOfDay].total += amount;
      spendingPatterns.byTimeOfDay[timeOfDay].count += 1;

      // Amount range pattern
      if (amount < 50) spendingPatterns.byAmountRange.small += 1;
      else if (amount >= 50 && amount <= 200) spendingPatterns.byAmountRange.medium += 1;
      else spendingPatterns.byAmountRange.large += 1;
    });

    return {
      totalExpenses,
      averageExpense,
      categoryBreakdown: categoryBreakdownArray,
      monthlyTrends,
      yearlyTrends,
      topCategories,
      recentTrends,
      insights,
      spendingPatterns
    };
  }, [expenses]);

  return analytics;
};
