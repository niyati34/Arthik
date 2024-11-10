// src/hooks/useDataFiltering.js
import { useState, useEffect, useMemo } from 'react';

export const useDataFiltering = (data, options = {}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const {
    searchFields = ['title', 'description', 'category'],
    filterField = 'category',
    dateField = 'date',
    amountField = 'amount'
  } = options;

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map(item => item[filterField]))];
    return ["all", ...uniqueCategories.filter(Boolean)];
  }, [data, filterField]);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];

    // Apply category filter
    if (filter !== "all") {
      result = result.filter(item => item[filterField] === filter);
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => 
          item[field]?.toLowerCase().includes(query)
        )
      );
    }

    // Apply sorting
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
