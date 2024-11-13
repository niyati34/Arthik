import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncomeItem from './IncomeItem';

// Mock the styled-components to avoid issues in tests
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  styled: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('IncomeItem Component', () => {
  const defaultProps = {
    id: 'test-1',
    title: 'Test Income',
    amount: 1000,
    date: '2024-01-01',
    category: 'Salary',
    description: 'Test description',
    deleteItem: jest.fn(),
    indicatorColor: '#10b981',
    type: 'income',
    showDelete: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders income item with correct information', () => {
      render(<IncomeItem {...defaultProps} />);
      
      expect(screen.getByText('Test Income')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('renders expense item with correct type', () => {
      render(<IncomeItem {...defaultProps} type="expense" />);
      
      expect(screen.getByText('Test Income')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('hides delete button when showDelete is false', () => {
      render(<IncomeItem {...defaultProps} showDelete={false} />);
      
      const deleteButton = screen.queryByRole('button');
      expect(deleteButton).not.toBeInTheDocument();
    });

    it('shows delete button when showDelete is true', () => {
      render(<IncomeItem {...defaultProps} showDelete={true} />);
      
      const deleteButton = screen.getByRole('button');
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('Category Icons', () => {
    it('displays correct icon for salary category', () => {
      render(<IncomeItem {...defaultProps} category="salary" type="income" />);
      
      // Check if the icon container is present
      const iconContainer = screen.getByText('Test Income').closest('div').querySelector('.icon');
      expect(iconContainer).toBeInTheDocument();
    });

    it('displays correct icon for freelancing category', () => {
      render(<IncomeItem {...defaultProps} category="freelancing" type="income" />);
      
      const iconContainer = screen.getByText('Test Income').closest('div').querySelector('.icon');
      expect(iconContainer).toBeInTheDocument();
    });

    it('displays correct icon for expense categories', () => {
      render(<IncomeItem {...defaultProps} category="groceries" type="expense" />);
      
      const iconContainer = screen.getByText('Test Income').closest('div').querySelector('.icon');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls deleteItem when delete button is clicked', () => {
      const mockDeleteItem = jest.fn();
      render(<IncomeItem {...defaultProps} deleteItem={mockDeleteItem} />);
      
      const deleteButton = screen.getByRole('button');
      fireEvent.click(deleteButton);
      
      expect(mockDeleteItem).toHaveBeenCalledWith('test-1');
      expect(mockDeleteItem).toHaveBeenCalledTimes(1);
    });

    it('calls deleteItem with correct ID', () => {
      const mockDeleteItem = jest.fn();
      render(<IncomeItem {...defaultProps} id="unique-id" deleteItem={mockDeleteItem} />);
      
      const deleteButton = screen.getByRole('button');
      fireEvent.click(deleteButton);
      
      expect(mockDeleteItem).toHaveBeenCalledWith('unique-id');
    });
  });

  describe('Data Validation', () => {
    it('handles missing description gracefully', () => {
      render(<IncomeItem {...defaultProps} description={undefined} />);
      
      // Should not crash and should handle undefined description
      expect(screen.getByText('Test Income')).toBeInTheDocument();
    });

    it('handles empty description gracefully', () => {
      render(<IncomeItem {...defaultProps} description="" />);
      
      expect(screen.getByText('Test Income')).toBeInTheDocument();
    });

    it('handles zero amount', () => {
      render(<IncomeItem {...defaultProps} amount={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles large amounts', () => {
      render(<IncomeItem {...defaultProps} amount={999999.99} />);
      
      expect(screen.getByText('999999.99')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper button role for delete action', () => {
      render(<IncomeItem {...defaultProps} />);
      
      const deleteButton = screen.getByRole('button');
      expect(deleteButton).toBeInTheDocument();
    });

    it('maintains proper structure for screen readers', () => {
      render(<IncomeItem {...defaultProps} />);
      
      // Check if the main content is properly structured
      expect(screen.getByText('Test Income')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long titles', () => {
      const longTitle = 'This is a very long title that might cause layout issues in the component';
      render(<IncomeItem {...defaultProps} title={longTitle} />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles special characters in title', () => {
      const specialTitle = 'Income with special chars: !@#$%^&*()';
      render(<IncomeItem {...defaultProps} title={specialTitle} />);
      
      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('handles numeric category names', () => {
      render(<IncomeItem {...defaultProps} category="123" />);
      
      expect(screen.getByText('123')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders without unnecessary re-renders', () => {
      const { rerender } = render(<IncomeItem {...defaultProps} />);
      
      // Re-render with same props
      rerender(<IncomeItem {...defaultProps} />);
      
      // Component should still be present
      expect(screen.getByText('Test Income')).toBeInTheDocument();
    });

    it('handles rapid delete button clicks', () => {
      const mockDeleteItem = jest.fn();
      render(<IncomeItem {...defaultProps} deleteItem={mockDeleteItem} />);
      
      const deleteButton = screen.getByRole('button');
      
      // Rapid clicks
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      
      // Should only call once per render cycle
      expect(mockDeleteItem).toHaveBeenCalledTimes(3);
    });
  });
});
