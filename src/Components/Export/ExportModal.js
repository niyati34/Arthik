import React, { useState } from 'react';
import styled from 'styled-components';
import { useDataExport } from '../../utils/useDataExport';

/**
 * Export Modal Component
 * Provides interface for exporting expense data to CSV and PDF formats
 */
const ExportModal = ({ isOpen, onClose, expenses, analytics }) => {
  const [exportType, setExportType] = useState('csv');
  const [includeAnalytics, setIncludeAnalytics] = useState(false);
  const [filename, setFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  
  const { exportToCSV, exportToPDF, exportAnalyticsToCSV } = useDataExport();

  const handleExport = async () => {
    if (!filename.trim()) {
      setError('Please enter a filename');
      return;
    }

    setIsExporting(true);
    setError('');

    try {
      if (exportType === 'csv') {
        if (includeAnalytics && analytics) {
          exportAnalyticsToCSV(analytics, `${filename}.csv`);
        } else {
          exportToCSV(expenses, `${filename}.csv`);
        }
      } else if (exportType === 'pdf') {
        await exportToPDF(expenses, `${filename}.pdf`, {
          title: 'Expense Report',
          subtitle: `Generated on ${new Date().toLocaleDateString()}`
        });
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    setExportType('csv');
    setIncludeAnalytics(false);
    setFilename('');
    setError('');
    setIsExporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Export Data</h2>
          <CloseButton onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FormSection>
            <label>Export Format</label>
            <FormatOptions>
              <FormatOption 
                active={exportType === 'csv'} 
                onClick={() => setExportType('csv')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
                CSV
              </FormatOption>
              <FormatOption 
                active={exportType === 'pdf'} 
                onClick={() => setExportType('pdf')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 15h6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 11h6" stroke="currentColor" strokeWidth="2"/>
                </svg>
                PDF
              </FormatOption>
            </FormatOptions>
          </FormSection>

          <FormSection>
            <label>Filename</label>
            <Input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={`expenses-${new Date().toISOString().split('T')[0]}`}
            />
          </FormSection>

          {exportType === 'csv' && analytics && (
            <FormSection>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  id="includeAnalytics"
                  checked={includeAnalytics}
                  onChange={(e) => setIncludeAnalytics(e.target.checked)}
                />
                <label htmlFor="includeAnalytics">
                  Include analytics data (category breakdown, trends)
                </label>
              </CheckboxContainer>
            </FormSection>
          )}

          <ExportInfo>
            <InfoItem>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>
                {exportType === 'csv' 
                  ? 'CSV files can be opened in Excel, Google Sheets, or any spreadsheet application.'
                  : 'PDF files are perfect for sharing reports and printing.'
                }
              </span>
            </InfoItem>
            <InfoItem>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>File will be downloaded to your default downloads folder.</span>
            </InfoItem>
          </ExportInfo>

          {error && (
            <ErrorMessage>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {error}
            </ErrorMessage>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={handleClose} disabled={isExporting}>
            Cancel
          </CancelButton>
          <ExportButton onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Export {exportType.toUpperCase()}
              </>
            )}
          </ExportButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
`;

const FormatOptions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FormatOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.active ? '#eff6ff' : 'white'};
  color: ${props => props.active ? '#1d4ed8' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.active ? '#3b82f6' : '#d1d5db'};
    background: ${props => props.active ? '#eff6ff' : '#f9fafb'};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  input[type="checkbox"] {
    margin-top: 0.125rem;
  }

  label {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
  }
`;

const ExportInfo = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 0.875rem;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default ExportModal;
