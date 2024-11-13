// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for lazy loading components
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock ResizeObserver for responsive components
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage for testing
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Suppress console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Custom matchers for financial data testing
expect.extend({
  toBeValidAmount(received) {
    const pass = typeof received === 'number' && !isNaN(received) && isFinite(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid amount`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid amount`,
        pass: false,
      };
    }
  },
  
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
  
  toHaveValidCurrency(received) {
    const pass = typeof received === 'string' && /^\$[\d,]+\.\d{2}$/.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid currency format`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid currency format`,
        pass: false,
      };
    }
  }
});

// Global test utilities
global.testUtils = {
  // Create mock financial data
  createMockIncome: (overrides = {}) => ({
    id: 'test-income-1',
    title: 'Test Income',
    amount: 1000,
    date: '2024-01-01',
    category: 'Salary',
    description: 'Test income description',
    ...overrides
  }),
  
  createMockExpense: (overrides = {}) => ({
    id: 'test-expense-1',
    title: 'Test Expense',
    amount: 50,
    date: '2024-01-01',
    category: 'Food',
    description: 'Test expense description',
    ...overrides
  }),
  
  createMockBudget: (overrides = {}) => ({
    id: 'test-budget-1',
    name: 'Test Budget',
    amount: 500,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    ...overrides
  }),
  
  // Mock context provider wrapper
  MockGlobalProvider: ({ children, value = {} }) => {
    const defaultContext = {
      incomes: [],
      expenses: [],
      budgets: [],
      addIncome: jest.fn(),
      deleteIncome: jest.fn(),
      addExpense: jest.fn(),
      deleteExpense: jest.fn(),
      addBudget: jest.fn(),
      deleteBudget: jest.fn(),
      totalExpenses: 0,
      totalIncomes: 0,
      totalBalance: 0,
      transactionHistory: [],
      activeBudgets: [],
      spendingPerBudget: [],
      savingsPerBudget: [],
      ...value
    };
    
    return (
      <div data-testid="mock-provider">
        {children}
      </div>
    );
  }
};
