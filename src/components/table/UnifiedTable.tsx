'use client'

import React, { useState, useMemo, useRef, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  ColumnDef,
  Row,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Grid, List, ChevronDown, ChevronUp, Search, Filter, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from '@/lib/utils'

// Types for the unified table system
export interface TableViewMode {
  mode: 'grid' | 'list' | 'table'
  gridColumns?: number
}

export interface TableConfig<T> {
  columns: ColumnDef<T>[]
  data: T[]
  enableSorting?: boolean
  enableFiltering?: boolean
  enablePagination?: boolean
  enableVirtualization?: boolean
  defaultSorting?: SortingState
  defaultFilters?: ColumnFiltersState
  defaultViewMode?: TableViewMode
  pageSize?: number
  searchPlaceholder?: string
  emptyStateMessage?: string
  loadingMessage?: string
}

export interface UnifiedTableProps<T> extends TableConfig<T> {
  loading?: boolean
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
  renderGridCard?: (item: T, index: number) => React.ReactNode
  renderListItem?: (item: T, index: number) => React.ReactNode
  className?: string
  containerHeight?: number
  stickyHeader?: boolean
}

export function UnifiedTable<T>({
  columns,
  data,
  loading = false,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = false,
  enableVirtualization = true,
  defaultSorting = [],
  defaultFilters = [],
  defaultViewMode = { mode: 'table' },
  pageSize = 50,
  searchPlaceholder = "Search...",
  emptyStateMessage = "No data available",
  loadingMessage = "Loading...",
  onRowClick,
  onRowDoubleClick,
  renderGridCard,
  renderListItem,
  className,
  containerHeight = 600,
  stickyHeader = true
}: UnifiedTableProps<T>) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(defaultFilters)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [viewMode, setViewMode] = useState<TableViewMode>(defaultViewMode)

  // Virtual scrolling refs
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getFacetedRowModel: enableFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFiltering ? getFacetedUniqueValues() : undefined,
    getFacetedMinMaxValues: enableFiltering ? getFacetedMinMaxValues() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Get table rows
  const { rows } = table.getRowModel()

  // Virtual scrolling for table mode
  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization ? rows.length : 0,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 52, // Estimated row height
    overscan: 10,
  })

  // Handle view mode change
  const handleViewModeChange = useCallback((newMode: TableViewMode['mode']) => {
    setViewMode({ ...viewMode, mode: newMode })
  }, [viewMode])

  // Filter functions
  const clearFilters = useCallback(() => {
    setColumnFilters([])
    setGlobalFilter('')
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className={cn("bg-[#0a0a0a] text-white", className)}>
        <TableToolbar
          table={table}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          clearFilters={clearFilters}
          loading={loading}
        />
        <div className="p-6">
          <LoadingState message={loadingMessage} viewMode={viewMode} />
        </div>
      </div>
    )
  }

  // Empty state
  if (!data.length) {
    return (
      <div className={cn("bg-[#0a0a0a] text-white", className)}>
        <TableToolbar
          table={table}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          searchPlaceholder={searchPlaceholder}
          clearFilters={clearFilters}
          loading={loading}
        />
        <EmptyState message={emptyStateMessage} />
      </div>
    )
  }

  return (
    <div className={cn("bg-[#0a0a0a] text-white", className)}>
      {/* Toolbar */}
      <TableToolbar
        table={table}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        searchPlaceholder={searchPlaceholder}
        clearFilters={clearFilters}
        loading={loading}
      />

      {/* Table Content */}
      <div className="relative">
        {viewMode.mode === 'table' && (
          <TableView
            table={table}
            rows={rows}
            rowVirtualizer={enableVirtualization ? rowVirtualizer : null}
            tableContainerRef={tableContainerRef}
            containerHeight={containerHeight}
            stickyHeader={stickyHeader}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
          />
        )}

        {viewMode.mode === 'grid' && (
          <GridView
            data={data}
            renderCard={renderGridCard}
            containerHeight={containerHeight}
            gridColumns={viewMode.gridColumns || 4}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
          />
        )}

        {viewMode.mode === 'list' && (
          <ListView
            data={data}
            renderItem={renderListItem}
            containerHeight={containerHeight}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
          />
        )}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <TablePagination table={table} />
      )}
    </div>
  )
}

// Toolbar Component
function TableToolbar<T>({
  table,
  viewMode,
  onViewModeChange,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder,
  clearFilters,
  loading
}: {
  table: any
  viewMode: TableViewMode
  onViewModeChange: (mode: TableViewMode['mode']) => void
  globalFilter: string
  setGlobalFilter: (value: string) => void
  searchPlaceholder: string
  clearFilters: () => void
  loading: boolean
}) {
  return (
    <div className="border-b border-gray-800 bg-[#1a1a1a]/50 backdrop-blur p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Search and filters */}
        <div className="flex items-center gap-4 flex-1">
          {/* Global search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 bg-[#0a0a0a] border-gray-700"
              disabled={loading}
            />
          </div>

          {/* Clear filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            Clear Filters
          </Button>

          {/* Active filters count */}
          {table.getState().columnFilters.length > 0 && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {table.getState().columnFilters.length} filters active
            </Badge>
          )}
        </div>

        {/* Right side - View controls */}
        <div className="flex items-center gap-2">
          {/* Results count */}
          <span className="text-sm text-gray-400">
            {table.getFilteredRowModel().rows.length.toLocaleString()} results
          </span>

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-gray-700 overflow-hidden">
            <Button
              variant={viewMode.mode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className="rounded-none px-3"
              disabled={loading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode.mode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="rounded-none px-3"
              disabled={loading}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode.mode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none px-3"
              disabled={loading}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Table View Component
function TableView<T>({
  table,
  rows,
  rowVirtualizer,
  tableContainerRef,
  containerHeight,
  stickyHeader,
  onRowClick,
  onRowDoubleClick
}: {
  table: any
  rows: Row<T>[]
  rowVirtualizer: any
  tableContainerRef: React.RefObject<HTMLDivElement>
  containerHeight: number
  stickyHeader: boolean
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
}) {
  const virtualItems = rowVirtualizer?.getVirtualItems() || []
  const totalSize = rowVirtualizer?.getTotalSize() || 0

  return (
    <div 
      ref={tableContainerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
    >
      <table className="w-full">
        {/* Header */}
        <thead className={cn(
          "bg-[#1a1a1a] border-b border-gray-800",
          stickyHeader && "sticky top-0 z-10"
        )}>
          {table.getHeaderGroups().map((headerGroup: any) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ width: header.getSize() }}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <span className="text-blue-400">
                        {header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Body */}
        <tbody>
          {rowVirtualizer ? (
            <>
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    className="border-b border-gray-800 hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
                    onClick={() => onRowClick?.(row.original)}
                    onDoubleClick={() => onRowDoubleClick?.(row.original)}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-800 hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row.original)}
                onDoubleClick={() => onRowDoubleClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Spacer for virtual scrolling */}
      {rowVirtualizer && (
        <div style={{ height: totalSize }} />
      )}
    </div>
  )
}

// Grid View Component
function GridView<T>({
  data,
  renderCard,
  containerHeight,
  gridColumns,
  onRowClick,
  onRowDoubleClick
}: {
  data: T[]
  renderCard?: (item: T, index: number) => React.ReactNode
  containerHeight: number
  gridColumns: number
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
}) {
  const defaultRenderCard = (item: T, index: number) => (
    <Card 
      key={index} 
      className="bg-[#1a1a1a] border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer"
      onClick={() => onRowClick?.(item)}
      onDoubleClick={() => onRowDoubleClick?.(item)}
    >
      <CardContent className="p-4">
        <pre className="text-xs text-gray-400 whitespace-pre-wrap">
          {JSON.stringify(item, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )

  return (
    <div 
      className="overflow-auto p-4"
      style={{ height: containerHeight }}
    >
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` 
        }}
      >
        {data.map((item, index) => 
          renderCard ? renderCard(item, index) : defaultRenderCard(item, index)
        )}
      </div>
    </div>
  )
}

// List View Component
function ListView<T>({
  data,
  renderItem,
  containerHeight,
  onRowClick,
  onRowDoubleClick
}: {
  data: T[]
  renderItem?: (item: T, index: number) => React.ReactNode
  containerHeight: number
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
}) {
  const defaultRenderItem = (item: T, index: number) => (
    <div 
      key={index}
      className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
      onClick={() => onRowClick?.(item)}
      onDoubleClick={() => onRowDoubleClick?.(item)}
    >
      <pre className="text-xs text-gray-400 whitespace-pre-wrap">
        {JSON.stringify(item, null, 2)}
      </pre>
    </div>
  )

  return (
    <div 
      className="overflow-auto p-4"
      style={{ height: containerHeight }}
    >
      <div className="space-y-4">
        {data.map((item, index) => 
          renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
        )}
      </div>
    </div>
  )
}

// Pagination Component
function TablePagination({ table }: { table: any }) {
  return (
    <div className="border-t border-gray-800 bg-[#1a1a1a]/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <span className="text-sm text-gray-500">
            ({table.getFilteredRowModel().rows.length} total results)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Loading State Component
function LoadingState({ 
  message, 
  viewMode 
}: { 
  message: string
  viewMode: TableViewMode 
}) {
  if (viewMode.mode === 'table') {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-12 bg-gray-800 rounded flex-1"></div>
              <div className="h-12 bg-gray-800 rounded w-24"></div>
              <div className="h-12 bg-gray-800 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (viewMode.mode === 'grid') {
    return (
      <div className="grid grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-800 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-20 bg-gray-800 rounded-lg"></div>
      ))}
    </div>
  )
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">📭</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-300">{message}</h3>
      <p className="text-gray-500">Try adjusting your search or filters</p>
    </div>
  )
} 