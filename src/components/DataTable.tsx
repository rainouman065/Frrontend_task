
import type { FC } from "react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type ArticleStatus = "generated" | "published" | "scheduled" | "archived";

type SortField = "traffic" | "words" | null;
type SortDirection = "asc" | "desc";

interface ArticleRow {
  id: number;
  title: string;
  keyword: string;
  traffic: number;
  words: number;
  createdOn: string;
  status: ArticleStatus;
}

interface DataTableProps {
  search: string;
  activeTab: string;
  loading?: boolean;
}

const rows: ArticleRow[] = [
  {
    id: 1,
    title: "How to Improve Your Skills in League of Legends",
    keyword: "league of legends",
    traffic: 2240000,
    words: 4575,
    createdOn: "20 hours ago",
    status: "generated",
  },
  {
    id: 2,
    title: "How to Master Last Hitting in League of Legends",
    keyword: "league of legends",
    traffic: 2240000,
    words: 3480,
    createdOn: "21 hours ago",
    status: "generated",
  },
  {
    id: 3,
    title: "7 Tips for Better Teamplay in League of Legends",
    keyword: "league of legends",
    traffic: 2240000,
    words: 2676,
    createdOn: "a day ago",
    status: "generated",
  },
  {
    id: 4,
    title: "Top Virtual Executive Assistant Services (2024)",
    keyword: "virtual executive assistant",
    traffic: 2900,
    words: 2408,
    createdOn: "1 Oct, 24",
    status: "published",
  },
  {
    id: 5,
    title: "Unlimited Graphics Design Solutions",
    keyword: "unlimited graphic design services",
    traffic: 390,
    words: 1793,
    createdOn: "---",
    status: "scheduled",
  },
];

const formatTraffic = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 0 });

const mapTabToStatus = (tab: string): ArticleStatus | "all" => {
  if (tab.startsWith("Generated")) return "generated";
  if (tab.startsWith("Published")) return "published";
  if (tab.startsWith("Scheduled")) return "scheduled";
  if (tab.startsWith("Archived")) return "archived";
  return "all";
};

const DataTable: FC<DataTableProps> = ({ search, activeTab, loading }) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const statusFilter = mapTabToStatus(activeTab);

    let result = rows;

    if (statusFilter !== "all") {
      result = result.filter((row) => row.status === statusFilter);
    }

    if (term) {
      result = result.filter(
        (row) =>
          row.title.toLowerCase().includes(term) ||
          row.keyword.toLowerCase().includes(term)
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];

        if (valueA === valueB) return 0;
        const comparison = valueA < valueB ? -1 : 1;
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [search, activeTab, sortField, sortDirection]);

  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const allVisibleSelected =
    pagedRows.length > 0 &&
    pagedRows.every((row) => selectedIds.includes(row.id));

  const handleToggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pagedRows.some((row) => row.id === id))
      );
    } else {
      setSelectedIds((prev) => {
        const visibleIds = pagedRows.map((row) => row.id);
        const set = new Set([...prev, ...visibleIds]);
        return Array.from(set);
      });
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageSizeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const next = Number(e.target.value) || 10;
    setPageSize(next);
    setPage(1);
  };

  const handlePageChange = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") return Math.max(1, prev - 1);
      return Math.min(pageCount, prev + 1);
    });
  };

  const handleSort = (field: SortField) => {
    if (!field) return;

    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((currentDirection) =>
          currentDirection === "asc" ? "desc" : "asc"
        );
        return currentField;
      }

      setSortDirection("desc");
      return field;
    });
  };

  const handleViewArticle = (row: ArticleRow) => {
    void Swal.fire({
      title: row.title,
      html: `
        <div style="text-align:left;font-size:13px;line-height:1.5;">
          <p><strong>Keyword:</strong> ${row.keyword}</p>
          <p><strong>Estimated traffic:</strong> ${formatTraffic(
            row.traffic
          )}</p>
          <p><strong>Words:</strong> ${row.words}</p>
          <p><strong>Created on:</strong> ${row.createdOn}</p>
          <p style="margin-top:8px;color:#6b7280;">
            This is a preview-style dialog. In a real product you could render
            the generated article here.
          </p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const handleBulkPublish = () => {
    if (selectedIds.length === 0) {
      void Swal.fire({
        title: "No articles selected",
        text: "Select one or more rows first to bulk publish.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    void Swal.fire({
      title: "Bulk publish",
      text: `Publish ${selectedIds.length} selected article${
        selectedIds.length > 1 ? "s" : ""
      } to WordPress?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, publish",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        void Swal.fire({
          title: "Queued for publishing",
          text: "The selected articles have been added to your publishing queue.",
          icon: "success",
          confirmButtonText: "Great",
        }).then(() => {
    
          setSelectedIds([]);
        });
      }
    });
  };

  const handleSinglePublish = (row: ArticleRow) => {
    void Swal.fire({
      title: "Publish to WordPress?",
      text: `Publish "${row.title}" to your connected WordPress site?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, publish",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        void Swal.fire({
          title: "Queued for publishing",
          text: `"${row.title}" has been added to your WordPress publishing queue.`,
          icon: "success",
          confirmButtonText: "Great",
        }).then(() => {
          
          setSelectedIds((prev) => prev.filter((id) => id !== row.id));
        });
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3 px-6 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            {loading ? (
              <span className="inline-flex items-center gap-2 text-gray-400">
                <span className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                Loading articles…
              </span>
            ) : (
              <>
                <span className="font-medium">{total}</span> article titles
                found for your current filters.
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="uppercase tracking-wide text-[10px] text-gray-400">
              Sort by
            </span>
            <Button
              type="button"
              size="sm"
              variant={sortField === "traffic" ? "default" : "outline"}
              className="h-7 px-2 text-[11px]"
              onClick={() => handleSort("traffic")}
              disabled={!!loading}
            >
              Traffic {sortField === "traffic" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={sortField === "words" ? "default" : "outline"}
              className="h-7 px-2 text-[11px]"
              onClick={() => handleSort("words")}
              disabled={!!loading}
            >
              Words {sortField === "words" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
            </Button>
            <div className="h-4 w-px bg-gray-200" />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-3 text-[11px]"
              onClick={handleBulkPublish}
              disabled={!!loading}
            >
              Bulk publish to WP
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={allVisibleSelected}
                  onChange={handleToggleSelectAll}
                  disabled={!!loading}
                />
              </TableHead>
              <TableHead>Article Title</TableHead>
              <TableHead>Keyword [Traffic]</TableHead>
              <TableHead className="text-right">Words</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Publish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <div className="h-4 w-4 rounded border border-gray-200 bg-gray-100 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="ml-auto h-4 w-10 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-7 w-16 rounded-md border border-gray-200 bg-gray-100 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-7 w-12 rounded-md border border-gray-200 bg-gray-100 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              : pagedRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleToggleRow(row.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.title}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-800">{row.keyword}</span>{" "}
                      <span className="text-gray-400">
                        [{formatTraffic(row.traffic)}]
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{row.words}</TableCell>
                    <TableCell>{row.createdOn}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => handleViewArticle(row)}
                        className="border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-left">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSinglePublish(row)}
                      >
                        WP
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-3 text-sm text-gray-600 border-t bg-white">
        <div>
          Total {total} Article Titles | Show{" "}
          <select
            className="border rounded-md px-2 py-0.5 text-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>{" "}
          entries per page
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded border bg-white text-xs disabled:opacity-40"
          >
            ‹
          </button>
          <span className="px-2 text-xs">
            {currentPage} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === pageCount}
            className="px-2 py-1 rounded border bg-white text-xs disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
};

export default DataTable;
