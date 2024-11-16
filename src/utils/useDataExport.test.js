import { renderHook } from '@testing-library/react';
import { useDataExport } from './useDataExport';

// Mock jsPDF
jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setTextColor: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: {
        width: 210
      }
    }
  }))
}));

// Mock URL.createObjectURL and document methods
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockClick = jest.fn();

Object.defineProperty(document, 'createElement', {
  value: mockCreateElement,
  writable: true
});

Object.defineProperty(document.body, 'appendChild', {
  value: mockAppendChild,
  writable: true
});

Object.defineProperty(document.body, 'removeChild', {
  value: mockRemoveChild,
  writable: true
});

describe('useDataExport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock link element
    const mockLink = {
      download: 'test.csv',
      setAttribute: jest.fn(),
      style: { visibility: 'hidden' },
      click: mockClick
    };
    mockCreateElement.mockReturnValue(mockLink);
  });

  const mockExpenses = [
    {
      id: 1,
      title: 'Groceries',
      amount: 50.25,
      category: 'Food',
      date: '2024-01-15',
      description: 'Weekly groceries'
    },
    {
      id: 2,
      title: 'Gas',
      amount: 30.00,
      category: 'Transportation',
      date: '2024-01-16',
      description: 'Fuel for car'
    }
  ];

  const mockAnalytics = {
    categoryBreakdown: [
      {
        category: 'Food',
        total: 50.25,
        count: 1,
        average: 50.25,
        percentage: 62.6
      },
      {
        category: 'Transportation',
        total: 30.00,
        count: 1,
        average: 30.00,
        percentage: 37.4
      }
    ],
    monthlyTrends: [
      {
        month: 'Jan 2024',
        total: 80.25,
        count: 2,
        average: 40.125
      }
    ],
    yearlyTrends: [
      {
        year: '2024',
        total: 80.25,
        count: 2,
        average: 40.125
      }
    ]
  };

  it('should convert data to CSV format correctly', () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' },
      { key: 'category', header: 'Category', type: 'text' }
    ];
    
    const csvContent = result.current.convertToCSV(mockExpenses, columns);
    
    expect(csvContent).toContain('Title,Amount,Category');
    expect(csvContent).toContain('Groceries,$50.25,Food');
    expect(csvContent).toContain('Gas,$30.00,Transportation');
  });

  it('should handle empty data in CSV conversion', () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' }
    ];
    
    const csvContent = result.current.convertToCSV([], columns);
    
    expect(csvContent).toBe('Title,Amount');
  });

  it('should handle null data in CSV conversion', () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' }
    ];
    
    const csvContent = result.current.convertToCSV(null, columns);
    
    expect(csvContent).toBe('');
  });

  it('should format currency values correctly', () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'amount', header: 'Amount', type: 'currency' }
    ];
    
    const csvContent = result.current.convertToCSV(mockExpenses, columns);
    
    expect(csvContent).toContain('$50.25');
    expect(csvContent).toContain('$30.00');
  });

  it('should format date values correctly', () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'date', header: 'Date', type: 'date' }
    ];
    
    const csvContent = result.current.convertToCSV(mockExpenses, columns);
    
    // The exact format depends on the locale, but it should contain the date
    expect(csvContent).toContain('2024-01-15');
    expect(csvContent).toContain('2024-01-16');
  });

  it('should escape special characters in CSV', () => {
    const { result } = renderHook(() => useDataExport());
    
    const expensesWithSpecialChars = [
      {
        id: 1,
        title: 'Expense with "quotes" and, commas',
        amount: 100,
        category: 'Test'
      }
    ];
    
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' }
    ];
    
    const csvContent = result.current.convertToCSV(expensesWithSpecialChars, columns);
    
    expect(csvContent).toContain('"Expense with ""quotes"" and, commas"');
  });

  it('should download CSV file correctly', () => {
    const { result } = renderHook(() => useDataExport());
    
    const csvContent = 'Title,Amount\nTest,$100.00';
    const filename = 'test.csv';
    
    result.current.downloadCSV(csvContent, filename);
    
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
  });

  it('should export expenses to CSV with correct columns', () => {
    const { result } = renderHook(() => useDataExport());
    
    const spy = jest.spyOn(result.current, 'downloadCSV');
    
    result.current.exportToCSV(mockExpenses, 'expenses.csv');
    
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Title,Amount,Category,Date,Description'),
      'expenses.csv'
    );
    
    spy.mockRestore();
  });

  it('should export analytics to CSV with multiple sections', () => {
    const { result } = renderHook(() => useDataExport());
    
    const spy = jest.spyOn(result.current, 'downloadCSV');
    
    result.current.exportAnalyticsToCSV(mockAnalytics, 'analytics.csv');
    
    const csvContent = spy.mock.calls[0][0];
    
    expect(csvContent).toContain('Category Breakdown');
    expect(csvContent).toContain('Monthly Trends');
    expect(csvContent).toContain('Yearly Trends');
    expect(csvContent).toContain('Food,50.25,1,50.25,62.6%');
    
    spy.mockRestore();
  });

  it('should handle analytics export with empty data', () => {
    const { result } = renderHook(() => useDataExport());
    
    const emptyAnalytics = {
      categoryBreakdown: [],
      monthlyTrends: [],
      yearlyTrends: []
    };
    
    const spy = jest.spyOn(result.current, 'downloadCSV');
    
    result.current.exportAnalyticsToCSV(emptyAnalytics, 'empty.csv');
    
    expect(spy).toHaveBeenCalledWith('', 'empty.csv');
    
    spy.mockRestore();
  });

  it('should generate PDF document correctly', async () => {
    const { result } = renderHook(() => useDataExport());
    
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' }
    ];
    
    const options = {
      title: 'Test Report',
      subtitle: 'Test Subtitle'
    };
    
    const doc = await result.current.generatePDF(mockExpenses, columns, options);
    
    expect(doc).toBeDefined();
    expect(doc.setFontSize).toHaveBeenCalled();
    expect(doc.text).toHaveBeenCalled();
  });

  it('should export expenses to PDF correctly', async () => {
    const { result } = renderHook(() => useDataExport());
    
    const spy = jest.spyOn(result.current, 'downloadPDF');
    
    await result.current.exportToPDF(mockExpenses, 'expenses.pdf');
    
    expect(spy).toHaveBeenCalledWith(
      expect.any(Object),
      'expenses.pdf'
    );
    
    spy.mockRestore();
  });
});
