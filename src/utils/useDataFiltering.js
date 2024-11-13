// src/hooks/useDataFiltering.js
import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for filtering, searching, and sorting data arrays with advanced options.
 * 
 * @description
 * This hook provides a comprehensive solution for data filtering operations including:
 * - Text-based search across multiple fields
 * - Category-based filtering
 * - Multiple sorting options
 * - Real-time filtering with performance optimizations
 * 
 * @template T - The type of data items in the array
 * @param {T[]} data - The array of data to filter
 * @param {Object} options - Configuration options for filtering behavior
 * @param {string[]} [options.searchFields=['title', 'description', 'category']] - Fields to search within
 * @param {string} [options.filterField='category'] - Field to use for category filtering
 * @param {string} [options.dateField='date'] - Field to use for date-based sorting
 * @param {string} [options.amountField='amount'] - Field to use for amount-based sorting
 * 
 * @returns {Object} An object containing filtered data and control functions
 * @returns {T[]} returns.filteredData - The filtered and sorted data array
 * @returns {string} returns.searchQuery - Current search query string
 * @returns {Function} returns.setSearchQuery - Function to update search query
 * @returns {string} returns.filter - Current filter value
 * @returns {Function} returns.setFilter - Function to update filter value
 * @returns {string} returns.sortBy - Current sort method
 * @returns {Function} returns.setSortBy - Function to update sort method
 * @returns {string[]} returns.categories - Available categories for filtering
 * @returns {Function} returns.resetFilters - Function to reset all filters to defaults
 * 
 * @example
 * ```jsx
 * const { filteredData, searchQuery, setSearchQuery, filter, setFilter } = useDataFiltering(
 *   incomes,
 *   {
 *     searchFields: ['title', 'description'],
 *     filterField: 'category',
 *     dateField: 'createdAt',
 *     amountField: 'amount'
 *   }
 * );
 * ```
 * 
 * @example
 * ```jsx
 * // Basic usage with default options
 * const { filteredData, searchQuery, setSearchQuery } = useDataFiltering(incomes);
 * 
 * // Advanced usage with custom options
 * const { filteredData, filter, setFilter, sortBy, setSortBy } = useDataFiltering(
 *   expenses,
 *   {
 *     searchFields: ['title', 'notes'],
 *     filterField: 'type',
 *     dateField: 'transactionDate'
 *   }
 * );
 * ```
 */
export const useDataFiltering = (data, options = {}) => {
  const {
    searchFields = ['title', 'description', 'category'],
    filterField = 'category',
    dateField = 'date',
    amountField = 'amount'
  } = options;

  // State management for filtering and sorting
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  /**
   * Generates unique categories from the data for filter dropdown options.
   * Memoized to prevent unnecessary recalculations.
   * 
   * @type {string[]}
   */
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map(item => item[filterField]))];
    return ["all", ...uniqueCategories.filter(Boolean)];
  }, [data, filterField]);

  /**
   * Applies filtering and sorting to the data array.
   * Runs whenever data, filter criteria, or sorting changes.
   */
  useEffect(() => {
    let result = [...data];

    // Apply category filter
    if (filter !== "all") {
      result = result.filter(item => item[filterField] === filter);
    }

    // Apply search filter across specified fields
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => 
          item[field]?.toLowerCase().includes(query)
        )
      );
    }

    // Apply sorting based on selected criteria
    result.sort((a, b) => {
      switch (sortBy) {
        case "amount-asc":
          return (a[amountField] || 0) - (b[amountField] || 0);
        case "amount-desc":
          return (b[amountField] || 0) - (a[amountField] || 0);
        case "date-asc":
          return new Date(a[dateField] || 0) - new Date(b[dateField] || 0);
        case "date-desc":
        default:
          return new Date(b[dateField] || 0) - new Date(a[dateField] || 0);
      }
    });

    setFilteredData(result);
  }, [data, filter, searchQuery, sortBy, filterField, searchFields, dateField, amountField]);

  /**
   * Resets all filters to their default values.
   * Useful for clearing search results or returning to initial state.
   */
  const resetFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setSortBy("date-desc");
  };

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    categories,
    resetFilters
  };
};
