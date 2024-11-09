// src/hooks/useDataFiltering.js
import { useMemo, useState } from "react";

export const useDataFiltering = (initialData = []) => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const categories = useMemo(() => {
    if (!initialData) return ["all"];
    return ["all", ...new Set(initialData.map((item) => item.category))];
  }, [initialData]);

  const filteredData = useMemo(() => {
    let result = [...initialData];

    // Filter by category
    if (filter !== "all") {
      result = result.filter((item) => item.category === filter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
      );
    }

    // Sort the results
    result.sort((a, b) => {
      switch (sortBy) {
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [initialData, filter, searchQuery, sortBy]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    categories,
  };
};
