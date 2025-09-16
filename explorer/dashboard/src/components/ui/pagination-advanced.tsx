import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Badge } from "./badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal,
  Loader2,
  Filter,
  RotateCcw
} from "lucide-react";

interface PaginationAdvancedProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  onLoadMore?: () => void;
  showLoadMore?: boolean;
  showPageSizeSelector?: boolean;
  showPageJumper?: boolean;
  showItemCount?: boolean;
  loadMoreText?: string;
  className?: string;
}

export function PaginationAdvanced({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading = false,
  onPageChange,
  onItemsPerPageChange,
  onLoadMore,
  showLoadMore = false,
  showPageSizeSelector = true,
  showPageJumper = true,
  showItemCount = true,
  loadMoreText = "Load More",
  className = ""
}: PaginationAdvancedProps) {
  const [jumpToPage, setJumpToPage] = useState("");

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage("");
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile Load More Button */}
      {showLoadMore && (
        <div className="flex justify-center md:hidden">
          <Button
            onClick={onLoadMore}
            disabled={isLoading || currentPage >= totalPages}
            className="btn-cyber min-w-[200px] h-12 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-3" />
                {loadMoreText}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Main Pagination Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 bg-muted/10 p-4 rounded-xl border border-border/30">
        {/* Item Count and Page Size Selector */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {showItemCount && (
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startItem.toLocaleString()}</span> to{" "}
              <span className="font-semibold text-foreground">{endItem.toLocaleString()}</span> of{" "}
              <span className="font-semibold text-neon-blue">{totalItems.toLocaleString()}</span> results
            </div>
          )}

          {showPageSizeSelector && onItemsPerPageChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="w-20 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Page Navigation */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Page Jumper */}
          {showPageJumper && totalPages > 5 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Go to:</span>
              <div className="flex items-center space-x-1">
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="Page"
                  className="w-16 h-8 text-sm text-center"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJumpToPage();
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleJumpToPage}
                  disabled={!jumpToPage || isLoading}
                  className="h-8 px-2"
                >
                  Go
                </Button>
              </div>
            </div>
          )}

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {/* First Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0 touch-optimized"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0 touch-optimized"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getVisiblePages().map((page, index) => {
                if (page === "...") {
                  return (
                    <div key={`dots-${index}`} className="flex items-center justify-center w-8 h-8">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                  );
                }

                const pageNum = page as number;
                const isCurrentPage = pageNum === currentPage;

                return (
                  <Button
                    key={pageNum}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    disabled={isLoading}
                    className={`h-8 w-8 p-0 touch-optimized ${
                      isCurrentPage 
                        ? 'bg-neon-blue text-black border-neon-blue hover:bg-neon-blue/90' 
                        : 'hover:bg-muted/50 hover:border-neon-blue/30'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0 touch-optimized"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0 touch-optimized"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Page Info Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-xs border-border/30 bg-muted/20 text-muted-foreground">
          Page {currentPage} of {totalPages}
        </Badge>
      </div>
    </div>
  );
}