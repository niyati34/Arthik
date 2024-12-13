import { useCallback } from 'react';

/**
 * Custom hook for data export functionality
 * Handles PDF and CSV generation for expense data
 */
export const useDataExport = () => {
  
  /**
   * Convert data to CSV format
   * @param {Array} data - Array of expense objects
   * @param {Array} columns - Array of column definitions
   * @returns {string} CSV formatted string
   */
  const convertToCSV = useCallback((data, columns) => {
    if (!data || data.length === 0) return '';
    
    // Create header row
    const headers = columns.map(col => col.header).join(',');
    
    // Create data rows
    const rows = data.map(item => {
      return columns.map(col => {
        let value = item[col.key];
        
        // Format dates
        if (col.type === 'date' && value) {
          value = new Date(value).toLocaleDateString();
        }
        
        // Format currency
        if (col.type === 'currency' && value) {
          value = `$${typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : '0.00'}`;
        }
        
        // Escape commas and quotes
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }
        
        return value || '';
      }).join(',');
    });
    
    return [headers, ...rows].join('\n');
  }, []);

  /**
   * Download CSV file
   * @param {string} csvContent - CSV content string
   * @param {string} filename - Name of the file
   */
  const downloadCSV = useCallback((csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  /**
   * Generate PDF content using jsPDF
   * @param {Array} data - Array of expense objects
   * @param {Array} columns - Array of column definitions
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} PDF document object
   */
  const generatePDF = useCallback(async (data, columns, options = {}) => {
    try {
      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const {
        title = 'Expense Report',
        subtitle = `Generated on ${new Date().toLocaleDateString()}`,
        pageSize = 'a4',
        orientation = 'portrait'
      } = options;
      
      // Set up document
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      
      doc.setFontSize(12);
      doc.text(subtitle, 20, 30);
      
      // Calculate table dimensions
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const tableWidth = pageWidth - (margin * 2);
      const colWidth = tableWidth / columns.length;
      
      // Draw table header
      let yPosition = 50;
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition - 10, tableWidth, 10, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      columns.forEach((col, index) => {
        const x = margin + (index * colWidth);
        doc.text(col.header, x + 2, yPosition - 2);
      });
      
      // Draw table data
      doc.setFontSize(9);
      data.forEach((item, rowIndex) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        columns.forEach((col, colIndex) => {
          const x = margin + (colIndex * colWidth);
          let value = item[col.key];
          
          // Format values
          if (col.type === 'date' && value) {
            value = new Date(value).toLocaleDateString();
          } else if (col.type === 'currency' && value) {
            value = `$${typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : '0.00'}`;
          }
          
          // Truncate long text
          if (typeof value === 'string' && value.length > 15) {
            value = value.substring(0, 12) + '...';
          }
          
          doc.text(value || '', x + 2, yPosition);
        });
        
        yPosition += 8;
      });
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }, []);

  /**
   * Download PDF file
   * @param {Object} doc - PDF document object
   * @param {string} filename - Name of the file
   */
  const downloadPDF = useCallback((doc, filename) => {
    doc.save(filename);
  }, []);

  /**
   * Export expenses to CSV
   * @param {Array} expenses - Array of expense objects
   * @param {string} filename - Name of the file
   */
  const exportToCSV = useCallback((expenses, filename = 'expenses.csv') => {
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'description', header: 'Description', type: 'text' }
    ];
    
    const csvContent = convertToCSV(expenses, columns);
    downloadCSV(csvContent, filename);
  }, [convertToCSV, downloadCSV]);

  /**
   * Export expenses to PDF
   * @param {Array} expenses - Array of expense objects
   * @param {string} filename - Name of the file
   * @param {Object} options - PDF generation options
   */
  const exportToPDF = useCallback(async (expenses, filename = 'expenses.pdf', options = {}) => {
    const columns = [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'currency' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'date', header: 'Date', type: 'date' }
    ];
    
    const doc = await generatePDF(expenses, columns, options);
    downloadPDF(doc, filename);
  }, [generatePDF, downloadPDF]);

  /**
   * Export analytics data to CSV
   * @param {Object} analytics - Analytics data object
   * @param {string} filename - Name of the file
   */
  const exportAnalyticsToCSV = useCallback((analytics, filename = 'analytics.csv') => {
    const { categoryBreakdown, monthlyTrends, yearlyTrends } = analytics;
    
    let csvContent = '';
    
    // Category breakdown
    if (categoryBreakdown && categoryBreakdown.length > 0) {
      csvContent += 'Category Breakdown\n';
      csvContent += 'Category,Total,Count,Average,Percentage\n';
      categoryBreakdown.forEach(cat => {
        csvContent += `${cat.category},${cat.total},${cat.count},${cat.average},${cat.percentage}%\n`;
      });
      csvContent += '\n';
    }
    
    // Monthly trends
    if (monthlyTrends && monthlyTrends.length > 0) {
      csvContent += 'Monthly Trends\n';
      csvContent += 'Month,Total,Count,Average\n';
      monthlyTrends.forEach(month => {
        csvContent += `${month.month},${month.total},${month.count},${month.average}\n`;
      });
      csvContent += '\n';
    }
    
    // Yearly trends
    if (yearlyTrends && yearlyTrends.length > 0) {
      csvContent += 'Yearly Trends\n';
      csvContent += 'Year,Total,Count,Average\n';
      yearlyTrends.forEach(year => {
        csvContent += `${year.year},${year.total},${year.count},${year.average}\n`;
      });
    }
    
    downloadCSV(csvContent, filename);
  }, [downloadCSV]);

  return {
    exportToCSV,
    exportToPDF,
    exportAnalyticsToCSV,
    convertToCSV,
    generatePDF
  };
};
