import { useState, useEffect, useCallback } from "react";

interface PaginationConfig {
  initialPage?: number;
  initialItemsPerPage?: number;
  totalItems: number;
  loadingDelay?: number;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  isLoading: boolean;
}

interface PaginationActions {
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  loadMore: () => void;
  refresh: () => void;
}

export function usePaginatedData(config: PaginationConfig): [PaginationState, PaginationActions] {
  const {
    initialPage = 1,
    initialItemsPerPage = 20,
    totalItems,
    loadingDelay = 300
  } = config;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const setPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, loadingDelay);
  }, [currentPage, totalPages, loadingDelay]);

  const setItemsPerPageAction = useCallback((newItemsPerPage: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setItemsPerPage(newItemsPerPage);
      // Adjust current page to maintain approximate position
      const newPage = Math.ceil((startIndex + 1) / newItemsPerPage);
      setCurrentPage(Math.min(newPage, Math.ceil(totalItems / newItemsPerPage)));
      setIsLoading(false);
    }, loadingDelay);
  }, [startIndex, totalItems, loadingDelay]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  }, [currentPage, totalPages, setPage]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);
  }, [loadingDelay]);

  // Reset to page 1 when total items change
  useEffect(() => {
    if (currentPage > Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(1);
    }
  }, [totalItems, itemsPerPage, currentPage]);

  const state: PaginationState = {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    isLoading
  };

  const actions: PaginationActions = {
    setPage,
    setItemsPerPage: setItemsPerPageAction,
    loadMore,
    refresh
  };

  return [state, actions];
}